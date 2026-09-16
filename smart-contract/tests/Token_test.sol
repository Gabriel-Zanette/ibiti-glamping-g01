// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";

/// @notice Executar no plugin Solidity Unit Testing do Remix. Cada teste retorna true
/// somente depois de validar suas condições com require; beforeEach recria o cenário.
contract TokenTest {
    IBIToken private token;
    Actor private alice;
    Actor private bob;
    Actor private outsider;
    function beforeEach() public {
        token = new IBIToken(address(this),150,uint64(block.timestamp),uint64(block.timestamp + 1460 days),address(0));
        alice = new Actor(); bob = new Actor(); outsider = new Actor();
    }
    function _buy(address to,uint256 n) private { token.primaryPurchase(to,n,keccak256("venda de teste")); }
    function _reject(address to,bytes memory data,string memory signature) private {
        (bool ok,bytes memory reason)=to.call(data);
        require(!ok && reason.length>=4 && bytes4(reason)==bytes4(keccak256(bytes(signature))),"Reversao diferente da esperada");
    }
    function testEmissaoUnica() public view returns(bool) {
        require(token.totalSupply()==150 && token.balanceOf(address(this))==150,"Emissao incorreta");
        require(token.decimals()==0 && token.emissionCap()==150,"Indivisibilidade incorreta");
        require(keccak256(bytes(token.name()))==keccak256("IBIToken") && keccak256(bytes(token.symbol()))==keccak256("IBT"),"Identificacao incorreta");return true;
    }
    function testReservaETeto() public view returns(bool) {
        require(token.reservedUnits()==50 && token.maxPerWallet()==20 && token.saleableUnits()==100,"Limites incorretos");return true;
    }
    function testCompraPrimaria() public returns(bool) {
        _buy(address(alice),5);require(token.balanceOf(address(alice))==5 && token.balanceOf(address(this))==145,"Compra nao transferiu saldo");
        require(token.isMember(address(alice)) && token.saleableUnits()==95,"Membership ou reserva incorreta");return true;
    }
    function testCompraApenasAdministrador() public returns(bool) {
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.primaryPurchase,(address(bob),1,bytes32(0))))),"OwnableUnauthorizedAccount(address)");return true;
    }
    function testCompraZero() public returns(bool) {
        _reject(address(token),abi.encodeCall(token.primaryPurchase,(address(alice),0,bytes32(0))),"ZeroUnits()");return true;
    }
    function testTetoPrimario() public returns(bool) {
        _buy(address(alice),20);_reject(address(token),abi.encodeCall(token.primaryPurchase,(address(alice),1,bytes32(0))),"WalletCapExceeded(address,uint256,uint256)");return true;
    }
    function testReservaProtegida() public returns(bool) {
        for(uint256 i=0;i<5;i++) _buy(address(new Actor()),20);
        require(token.saleableUnits()==0,"Venda excedeu reserva");
        _reject(address(token),abi.encodeCall(token.primaryPurchase,(address(alice),1,bytes32(0))),"ReserveProtected(uint256,uint256)");return true;
    }
    function testReducaoReserva() public returns(bool) {
        token.reduceReserve(40);require(token.saleableUnits()==110,"Reserva nao foi reduzida");
        _reject(address(token),abi.encodeCall(token.reduceReserve,(41)),"InvalidReserve(uint256,uint256)");
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.reduceReserve,(30)))),"OwnableUnauthorizedAccount(address)");return true;
    }
    function testTransferenciaEntrePortadores() public returns(bool) {
        _buy(address(alice),5);_buy(address(bob),1);
        alice.execute(address(token),abi.encodeCall(token.transfer,(address(bob),3)));
        require(token.balanceOf(address(alice))==2 && token.balanceOf(address(bob))==4,"Transferencia incorreta");return true;
    }
    function testDestinoSemSaldoBloqueado() public returns(bool) {
        _buy(address(alice),5);
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.transfer,(address(bob),1)))),"RecipientNotHolder(address)");return true;
    }
    function testTetoSecundario() public returns(bool) {
        _buy(address(alice),20);_buy(address(bob),1);
        _reject(address(bob),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.transfer,(address(alice),1)))),"WalletCapExceeded(address,uint256,uint256)");return true;
    }
    function testTransferFrom() public returns(bool) {
        _buy(address(alice),5);_buy(address(bob),1);
        alice.execute(address(token),abi.encodeCall(token.approve,(address(this),3)));
        token.transferFrom(address(alice),address(bob),3);
        require(token.balanceOf(address(bob))==4 && token.allowance(address(alice),address(this))==0,"Autorizacao incorreta");return true;
    }
    function testTransferFromSemAutorizacao() public returns(bool) {
        _buy(address(alice),5);_buy(address(bob),1);
        _reject(address(token),abi.encodeCall(token.transferFrom,(address(alice),address(bob),1)),"ERC20InsufficientAllowance(address,uint256,uint256)");return true;
    }
    function testSaldoInsuficiente() public returns(bool) {
        _buy(address(alice),1);_buy(address(bob),1);
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.transfer,(address(bob),2)))),"ERC20InsufficientBalance(address,uint256,uint256)");return true;
    }
    function testDevolucaoERegistroDePortadores() public returns(bool) {
        _buy(address(alice),5);require(token.holderCount()==2,"Portador ausente");
        alice.execute(address(token),abi.encodeCall(token.transfer,(address(this),5)));
        require(!token.isMember(address(alice)) && token.holderCount()==1 && token.balanceOf(address(this))==150,"Registro nao removeu carteira vazia");return true;
    }






    function testInterfaceSemResgateOuMintPublico() public returns(bool) {
        (bool r,)=address(token).call(abi.encodeWithSignature("markRedeemed(address,uint256,bytes32)",address(alice),1,bytes32(0)));
        (bool m,)=address(token).call(abi.encodeWithSignature("mint(address,uint256)",address(alice),1));
        (bool b,)=address(token).call(abi.encodeWithSignature("burn(uint256)",1));
        require(!r && !m && !b && token.totalSupply()==150,"Interface permite emissao ou resgate");return true;
    }


}
