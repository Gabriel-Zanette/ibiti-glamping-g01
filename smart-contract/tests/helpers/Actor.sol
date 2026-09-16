// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/// @dev Carteira contratual de teste: permite exercitar chamadas com outro msg.sender.
contract Actor {
    function execute(address target, bytes calldata data) external returns (bytes memory) {
        (bool ok, bytes memory result) = target.call(data);
        if (!ok) assembly ("memory-safe") { revert(add(result, 32), mload(result)) }
        return result;
    }
}
