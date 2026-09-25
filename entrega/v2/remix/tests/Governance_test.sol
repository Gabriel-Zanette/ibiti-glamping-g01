// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";
contract GovernanceTest {
    IBIToken private token; Actor private alice; Actor private bob;
    function beforeEach() public {
        token=new IBIToken(address(this),150,1735689600,1861919999,address(0));
        alice=new Actor();bob=new Actor();token.registerWallet(address(bob),keccak256("B"));
    }
    function testAdministracaoNaoMoveTesouraria() public returns(bool) {
        token.transferOwnership(address(alice));require(token.owner()==address(this));
        alice.execute(address(token),abi.encodeCall(token.acceptOwnership,()));
        alice.execute(address(token),abi.encodeCall(token.primaryPurchase,(address(bob),1,bytes32(0))));
        require(token.owner()==address(alice) && token.treasury()==address(this) && token.balanceOf(address(this))==149);return true;
    }
    function testRecuperacaoNaoImediata() public returns(bool) {
        token.primaryPurchase(address(bob),5,bytes32(0));
        token.requestRecovery(address(bob),address(0xCAFE),keccak256("processo"));
        (bool ok,) = address(token).call(abi.encodeCall(token.reissue,(address(bob),address(0xCAFE))));
        require(!ok && token.balanceOf(address(bob))==5);return true;
    }
    function testCancelamentoPeloTitularDurantePausa() public returns(bool) {
        token.primaryPurchase(address(bob),5,bytes32(0));
        token.requestRecovery(address(bob),address(0xCAFE),keccak256("processo"));token.pause();
        bob.execute(address(token),abi.encodeCall(token.cancelRecovery,(address(bob))));
        (,,uint64 eta,)=token.recoveries(address(bob));require(eta==0);return true;
    }
    function testConfiscoBloqueado() public returns(bool) {
        token.primaryPurchase(address(bob),20,bytes32(0));
        (bool ok,) = address(token).call(abi.encodeCall(token.requestRecovery,(address(bob),address(this),keccak256("processo"))));
        require(!ok && token.balanceOf(address(bob))==20);return true;
    }
}
