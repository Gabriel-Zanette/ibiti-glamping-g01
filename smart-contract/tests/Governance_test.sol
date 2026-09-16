// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";

/// @notice Executar no plugin Solidity Unit Testing do Remix. Cada teste retorna true
/// somente depois de validar suas condições com require; beforeEach recria o cenário.
contract GovernanceTest {
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
    function testPausaERetomada() public returns(bool) {
        token.pause();_reject(address(token),abi.encodeCall(token.primaryPurchase,(address(alice),1,bytes32(0))),"EnforcedPause()");
        token.unpause();_buy(address(alice),1);require(token.balanceOf(address(alice))==1,"Retomada falhou");return true;
    }
    function testAdministracaoEmDuasEtapas() public returns(bool) {
        token.transferOwnership(address(alice));require(token.owner()==address(this),"Troca antecipada");
        alice.execute(address(token),abi.encodeCall(token.acceptOwnership,()));require(token.owner()==address(alice),"Novo administrador incorreto");
        _reject(address(token),abi.encodeCall(token.pause,()),"OwnableUnauthorizedAccount(address)");return true;
    }
    function testRenunciaBloqueada() public returns(bool) {
        _reject(address(token),abi.encodeCall(token.renounceOwnership,()),"RenounceDisabled()");return true;
    }
    function testRecuperacaoSemInflacao() public returns(bool) {
        _buy(address(alice),5);token.reissue(address(alice),address(bob));
        require(token.totalSupply()==150 && token.balanceOf(address(alice))==0 && token.balanceOf(address(bob))==5,"Recuperacao incorreta");
        require(token.revoked(address(alice)),"Carteira antiga nao revogada");
        _reject(address(token),abi.encodeCall(token.primaryPurchase,(address(alice),1,bytes32(0))),"WalletRevoked(address)");return true;
    }
    function testRecuperacaoRespeitaTeto() public returns(bool) {
        _buy(address(alice),20);_buy(address(bob),1);
        _reject(address(token),abi.encodeCall(token.reissue,(address(bob),address(alice))),"WalletCapExceeded(address,uint256,uint256)");return true;
    }
    function testRecuperacaoInvalida() public returns(bool) {
        _reject(address(token),abi.encodeCall(token.reissue,(address(alice),address(bob))),"NothingToReissue(address)");
        _reject(address(token),abi.encodeCall(token.reissue,(address(this),address(bob))),"InvalidAddress()");return true;
    }
    function testExpiracao() public returns(bool) {
        IBIToken expired=new IBIToken(address(this),150,1,uint64(block.timestamp-1),address(0));
        require(expired.isExpired() && !expired.isMember(address(this)),"Expiracao incorreta");
        _reject(address(expired),abi.encodeCall(expired.primaryPurchase,(address(alice),1,bytes32(0))),"TokenExpired(uint64)");return true;
    }
    function testConstrutorInvalido() public returns(bool) {
        try new IBIToken(address(this),14,1,2,address(0)) {revert("Cap invalido aceito");} catch(bytes memory e){require(bytes4(e)==bytes4(keccak256("InvalidEmissionCap(uint256)")),"Erro cap incorreto");}
        try new IBIToken(address(this),150,2,1,address(0)) {revert("Validade invalida aceita");} catch(bytes memory e){require(bytes4(e)==bytes4(keccak256("InvalidValidity(uint64,uint64)")),"Erro validade incorreto");}
        return true;
    }
}
