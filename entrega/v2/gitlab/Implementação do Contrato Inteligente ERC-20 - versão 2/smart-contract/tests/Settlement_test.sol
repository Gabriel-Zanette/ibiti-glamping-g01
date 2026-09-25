// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";
contract SettlementTest {
    IBIToken private token; Actor private alice;
    function beforeEach() public {
        token=new IBIToken(address(this),150,1735689600,1861919999,address(0));
        alice=new Actor();token.registerWallet(address(alice),keccak256("A"));token.primaryPurchase(address(alice),20,bytes32(0));
    }
    function testLiquidacaoExternaSemDuplicacao() public returns(bool) {
        token.reportRevenue(1_000_000,bytes32(0));token.settleOffChain(1,address(this),keccak256("comprovante"));
        require(token.royaltyDue(1,address(this))==0 && token.royaltyPaid(1,address(this))==150_000);
        (bool ok,) = address(token).call(abi.encodeCall(token.settleOffChain,(1,address(this),bytes32(0))));
        require(!ok);return true;
    }
    function testRenunciaBloqueada() public returns(bool) {
        (bool ok,) = address(token).call(abi.encodeCall(token.renounceOwnership,()));require(!ok);return true;
    }
    function testPausaBloqueiaReporte() public returns(bool) {
        token.pause();(bool ok,) = address(token).call(abi.encodeCall(token.reportRevenue,(100,bytes32(0))));require(!ok);return true;
    }
}
