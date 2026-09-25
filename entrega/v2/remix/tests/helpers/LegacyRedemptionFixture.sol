// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
import "../../contracts/IBIToken.sol";
/// @dev Somente teste do bloqueio de migração. Não integrar nem publicar como token.
contract LegacyRedemptionFixture is IBIToken {
    event RedemptionMarked(address indexed holder,uint256 units,bytes32 voucherRef,uint256 activeRemaining);
    constructor(address admin,uint256 cap,uint64 start,uint64 end,address stable) IBIToken(admin,cap,start,end,stable) {}
    function emitLegacyRedemption(address holder) external { emit RedemptionMarked(holder,1,bytes32(0),0); }
}
