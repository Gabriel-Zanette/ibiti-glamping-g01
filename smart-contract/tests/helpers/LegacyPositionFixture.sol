// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../../contracts/IBIToken.sol";
/// @dev Fixture EXCLUSIVA de regressão: simula posição legada zerada com recebíveis.
/// Não é uma funcionalidade disponível no IBIToken e não deve ser publicado como token.
contract LegacyPositionFixture is IBIToken {
    constructor(address admin,uint256 cap,uint64 start,uint64 end,address stable) IBIToken(admin,cap,start,end,stable) {}
    function simulateLegacyZeroPosition(address holder) external {
        uint256 units = balanceOf(holder);
        _burn(holder, units);
        _mint(treasury, units);
    }
}
