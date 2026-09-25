// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

/// @notice Aniversários UTC, sempre derivados da data original; 31/08 + 6 meses = último dia de fevereiro.
library OpeningCalendar {
    error OpeningOutsideSupportedRange();

    function addMonths(uint64 timestamp, uint256 months) internal pure returns (uint64) {
        (uint256 year, uint256 month, uint256 day) = date(timestamp);
        uint256 target = year * 12 + month - 1 + months;
        year = target / 12;
        month = target % 12 + 1;
        uint256 last = daysInMonth(year, month);
        if (day > last) day = last;
        uint256 daysTotal;
        for (uint256 y = 1970; y < year; ++y) daysTotal += leap(y) ? 366 : 365;
        for (uint256 m = 1; m < month; ++m) daysTotal += daysInMonth(year, m);
        return uint64((daysTotal + day - 1) * 1 days + timestamp % 1 days);
    }

    function date(uint64 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day) {
        // Limite explícito torna os laços de calendário limitados.
        if (timestamp >= 4133980800) revert OpeningOutsideSupportedRange(); // 01/01/2101
        uint256 remaining = timestamp / 1 days;
        year = 1970;
        while (remaining >= (leap(year) ? 366 : 365)) {
            remaining -= leap(year) ? 366 : 365;
            ++year;
        }
        month = 1;
        while (remaining >= daysInMonth(year, month)) {
            remaining -= daysInMonth(year, month);
            ++month;
        }
        day = remaining + 1;
    }

    function leap(uint256 year) private pure returns (bool) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    function daysInMonth(uint256 year, uint256 month) private pure returns (uint256) {
        if (month == 2) return leap(year) ? 29 : 28;
        return month == 4 || month == 6 || month == 9 || month == 11 ? 30 : 31;
    }
}
