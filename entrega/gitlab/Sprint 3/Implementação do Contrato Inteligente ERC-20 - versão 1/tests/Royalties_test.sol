// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "../contracts/mocks/MockStablecoin.sol";
import "./helpers/Actor.sol";

contract RoyaltiesTest {
    IBIToken private token; MockStablecoin private stable; Actor private alice; Actor private bob;
    function beforeEach() public {
        stable=new MockStablecoin("Teste","tBRL",6);
        token=new IBIToken(address(this),150,uint64(block.timestamp),uint64(block.timestamp+1460 days),address(stable));
        alice=new Actor();bob=new Actor();token.primaryPurchase(address(alice),20,bytes32(0));token.primaryPurchase(address(bob),10,bytes32(0));
        stable.mint(address(this),100_000_000);stable.approve(address(token),100_000_000);
    }
    function _reject(address to,bytes memory data,string memory signature) private {
        (bool ok,bytes memory reason)=to.call(data);
        require(!ok && reason.length>=4 && bytes4(reason)==bytes4(keccak256(bytes(signature))),"Reversao diferente da esperada");
    }
    function testDistribuicaoProporcional() public returns(bool) {
        token.reportRevenue(1_000_000,keccak256("relatorio"));
        require(token.royaltyDue(1,address(alice))==20_000 && token.royaltyDue(1,address(bob))==10_000,"Rateio incorreto");
        require(token.royaltyDue(1,address(this))==120_000 && stable.balanceOf(address(token))==150_000,"Reserva ou deposito incorreto");return true;
    }
    function testSaqueSemDuplicacao() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));alice.execute(address(token),abi.encodeCall(token.claimRoyalty,(1)));
        require(stable.balanceOf(address(alice))==20_000 && token.royaltyPaid(1,address(alice))==20_000 && token.royaltyDue(1,address(alice))==0,"Saque incorreto");
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.claimRoyalty,(1)))),"NothingToClaim(uint8,address)");return true;
    }
    function testFotografiaNaoMudaAposTransferencia() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));alice.execute(address(token),abi.encodeCall(token.transfer,(address(bob),5)));
        require(token.royaltyDue(1,address(alice))==20_000 && token.royaltyDue(1,address(bob))==10_000,"Fotografia retroativamente alterada");
        token.reportRevenue(1_000_000,bytes32(0));require(token.royaltyDue(2,address(alice))==15_000 && token.royaltyDue(2,address(bob))==15_000,"Nova fotografia incorreta");return true;
    }
    function testLimiteOitoPeriodos() public returns(bool) {
        for(uint8 i=0;i<8;i++)token.reportRevenue(100,bytes32(0));
        _reject(address(token),abi.encodeCall(token.reportRevenue,(100,bytes32(0))),"AllPeriodsReported(uint8)");return true;
    }
    function testArredondamentoDepositaSomenteDevido() public returns(bool) {
        token.reportRevenue(107,bytes32(0));IBIToken.Period memory p=token.periodInfo(1);
        require(p.royaltyAmount==16 && p.totalDue==15 && stable.balanceOf(address(token))==15,"Arredondamento incorreto");return true;
    }
    function testFalhaNoDepositoReverteReporte() public returns(bool) {
        stable.approve(address(token),0);
        _reject(address(token),abi.encodeCall(token.reportRevenue,(1_000_000,bytes32(0))),"ERC20InsufficientAllowance(address,uint256,uint256)");
        require(token.lastReportedPeriod()==0 && token.royaltyDue(1,address(alice))==0,"Reporte parcial persistiu");return true;
    }
    function testReporteApenasAdministrador() public returns(bool) {
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.reportRevenue,(100,bytes32(0))))),"OwnableUnauthorizedAccount(address)");return true;
    }
    function testPausaBloqueiaReporteESaque() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));token.pause();
        _reject(address(token),abi.encodeCall(token.reportRevenue,(100,bytes32(0))),"EnforcedPause()");
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(token),abi.encodeCall(token.claimRoyalty,(1)))),"EnforcedPause()");return true;
    }
    function testRecuperacaoTransferePendencias() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));Actor replacement=new Actor();token.reissue(address(alice),address(replacement));
        require(token.pendingRoyaltyOf(address(alice))==0 && token.pendingRoyaltyOf(address(replacement))==20_000,"Pendencia nao migrou");
        replacement.execute(address(token),abi.encodeCall(token.claimRoyalty,(1)));require(stable.balanceOf(address(replacement))==20_000,"Saque na nova carteira falhou");return true;
    }




}
