// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../contracts/IBIToken.sol";
import "./helpers/Actor.sol";

/// @notice Suíte nativa Remix; testes temporais e integração completos em feedback.test.ts (Anvil).
contract TokenTest {
    IBIToken private token;
    Actor private alice;
    Actor private bob;
    function beforeEach() public {
        token = new IBIToken(address(this),150,1735689600,1861919999,address(0)); // 2025–2028, demonstração
        alice = new Actor(); bob = new Actor();
        token.registerWallet(address(alice),keccak256("pessoa A"));
        token.registerWallet(address(bob),keccak256("pessoa A"));
    }
    function testEmissaoReservaETeto() public view returns(bool) {
        require(token.totalSupply()==150 && token.balanceOf(address(this))==150 && token.decimals()==0);
        require(token.reservedUnits()==50 && token.maxPerWallet()==20 && token.saleableUnits()==100);
        require(token.treasury()==address(this));return true;
    }
    function testCompraETetoPorPessoa() public returns(bool) {
        token.primaryPurchase(address(alice),15,bytes32(0));token.primaryPurchase(address(bob),5,bytes32(0));
        (bool ok,) = address(token).call(abi.encodeCall(token.primaryPurchase,(address(bob),1,bytes32(0))));
        require(!ok && token.personBalance(keccak256("pessoa A"))==20);return true;
    }
    function testTransferenciaMesmaPessoaNoTeto() public returns(bool) {
        token.primaryPurchase(address(alice),15,bytes32(0));token.primaryPurchase(address(bob),5,bytes32(0));
        (bool ok,) = address(alice).call(abi.encodeCall(alice.execute,(address(token),abi.encodeCall(token.transfer,(address(bob),5)))));
        require(!ok);
        require(token.balanceOf(address(bob))==5 && token.personBalance(keccak256("pessoa A"))==20);return true;
    }
    function testTesourariaNaoContornaCompra() public returns(bool) {
        (bool ok,) = address(token).call(abi.encodeCall(token.transfer,(address(alice),1)));
        require(!ok && token.balanceOf(address(alice))==0);return true;
    }
}
