// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";
contract RoyaltiesTest {
    IBIToken private token; Actor private alice;
    function beforeEach() public {
        token=new IBIToken(address(this),150,1735689600,1861919999,address(0));
        alice=new Actor();token.registerWallet(address(alice),keccak256("A"));
        token.primaryPurchase(address(alice),20,bytes32(0));
    }
    function testRateioIncluiReserva() public returns(bool) {
        token.reportRevenue(1_000_000,keccak256("relatorio"));
        require(token.royaltyDue(1,address(alice))==20_000 && token.royaltyDue(1,address(this))==130_000);return true;
    }
    function testArredondamento() public returns(bool) {
        token.reportRevenue(107,bytes32(0));IBIToken.Period memory p=token.periodInfo(1);
        require(p.royaltyAmount==16 && p.totalDue==15);return true;
    }
    function testCalendarioCivilBissexto() public view returns(bool) {
        require(token.periodEnd(1)==1751328000 && token.periodEnd(7)==1846022400 && token.periodEnd(8)==1861920000);return true;
    }
}
