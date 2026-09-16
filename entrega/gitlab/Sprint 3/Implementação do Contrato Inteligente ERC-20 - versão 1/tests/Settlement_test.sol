// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "../contracts/mocks/MockStablecoin.sol";
import "./helpers/Actor.sol";

contract SettlementTest {
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
    function testLiquidacaoForaDaBlockchain() public returns(bool) {
        IBIToken externalPayment=new IBIToken(address(this),150,uint64(block.timestamp),uint64(block.timestamp+1460 days),address(0));
        externalPayment.primaryPurchase(address(alice),20,bytes32(0));externalPayment.reportRevenue(1_000_000,bytes32(0));
        _reject(address(alice),abi.encodeCall(Actor.execute,(address(externalPayment),abi.encodeCall(externalPayment.claimRoyalty,(1)))),"PeriodNotOnChain(uint8)");
        externalPayment.settleOffChain(1,address(alice),keccak256("comprovante"));
        require(externalPayment.royaltyPaid(1,address(alice))==20_000,"Pagamento externo nao registrado");
        _reject(address(externalPayment),abi.encodeCall(externalPayment.settleOffChain,(1,address(alice),bytes32(0))),"NothingToClaim(uint8,address)");return true;
    }
    function testStablecoinSoPodeSerDefinidaUmaVez() public returns(bool) {
        _reject(address(token),abi.encodeCall(token.setStablecoin,(address(stable))),"StablecoinAlreadySet(address)");return true;
    }
    function testPeriodoInexistente() public returns(bool) {
        _reject(address(token),abi.encodeCall(token.claimRoyalty,(1)),"PeriodNotReported(uint8)");return true;
    }
    function testNaoPermiteLiquidarExternamentePeriodoOnChain() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));
        _reject(address(token),abi.encodeCall(token.settleOffChain,(1,address(alice),bytes32(0))),"PeriodOnChain(uint8)");return true;
    }
}
