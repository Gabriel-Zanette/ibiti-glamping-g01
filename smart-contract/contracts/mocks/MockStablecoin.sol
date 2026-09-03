// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockStablecoin
 * @notice Stablecoin de TESTE usada apenas em ambiente local e na Sepolia para
 * simular o meio de pagamento dos royalties (D9: parcela da IBITI convertida em
 * stablecoin e distribuída pelo contrato). Qualquer ERC-20 real (ex.: uma
 * stablecoin em reais) pode ocupar esse papel no contrato principal.
 *
 * @dev A função `mint` é aberta de propósito: este contrato existe só para
 * testes e demonstração. NÃO representa a criação de uma moeda própria pelo
 * projeto (restrição do TAPI) — é um substituto de teste para uma moeda já
 * existente no mercado.
 */
contract MockStablecoin is ERC20 {
    uint8 private immutable _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Cunha `amount` unidades para `to` (somente ambiente de teste).
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
