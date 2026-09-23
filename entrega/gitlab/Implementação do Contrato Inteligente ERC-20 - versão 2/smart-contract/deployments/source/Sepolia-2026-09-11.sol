// Sources flattened with hardhat v3.15.0 https://hardhat.org

// SPDX-License-Identifier: MIT

// File npm/@openzeppelin/contracts@5.6.1/utils/Context.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File npm/@openzeppelin/contracts@5.6.1/access/Ownable.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File npm/@openzeppelin/contracts@5.6.1/access/Ownable2Step.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (access/Ownable2Step.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This extension of the {Ownable} contract includes a two-step mechanism to transfer
 * ownership, where the new owner must call {acceptOwnership} in order to replace the
 * old one. This can help prevent common mistakes, such as transfers of ownership to
 * incorrect accounts, or to contracts that are unable to interact with the
 * permission system.
 *
 * The initial owner is specified at deployment time in the constructor for `Ownable`. This
 * can later be changed with {transferOwnership} and {acceptOwnership}.
 *
 * This module is used through inheritance. It will make available all functions
 * from parent (Ownable).
 */
abstract contract Ownable2Step is Ownable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     *
     * Setting `newOwner` to the zero address is allowed; this can be used to cancel an initiated ownership transfer.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        if (pendingOwner() != sender) {
            revert OwnableUnauthorizedAccount(sender);
        }
        _transferOwnership(sender);
    }
}


// File npm/@openzeppelin/contracts@5.6.1/interfaces/draft-IERC6093.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (interfaces/draft-IERC6093.sol)

pragma solidity >=0.8.4;

/**
 * @dev Standard ERC-20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC-721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-721.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC-1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/IERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/extensions/IERC20Metadata.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity >=0.6.2;

/**
 * @dev Interface for the optional metadata functions from the ERC-20 standard.
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/ERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
    mapping(address account => uint256) private _balances;

    mapping(address account => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * Both values are immutable: they can only be set once during construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /// @inheritdoc IERC20
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /// @inheritdoc IERC20
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /// @inheritdoc IERC20
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Skips emitting an {Approval} event indicating an allowance update. This is not
     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation sets the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the `transferFrom` operation can force the flag to
     * true using the following override:
     *
     * ```solidity
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/Pausable.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/extensions/ERC20Pausable.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/ERC20Pausable.sol)

pragma solidity ^0.8.20;


/**
 * @dev ERC-20 token with pausable token transfers, minting and burning.
 *
 * Useful for scenarios such as preventing trades until the end of an evaluation
 * period, or having an emergency switch for freezing all token transfers in the
 * event of a large bug.
 *
 * IMPORTANT: This contract does not include public pause and unpause functions. In
 * addition to inheriting this contract, you must define both functions, invoking the
 * {Pausable-_pause} and {Pausable-_unpause} internal functions, with appropriate
 * access control, e.g. using {AccessControl} or {Ownable}. Not doing so will
 * make the contract pause mechanism of the contract unreachable, and thus unusable.
 */
abstract contract ERC20Pausable is ERC20, Pausable {
    /**
     * @dev See {ERC20-_update}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _update(address from, address to, uint256 value) internal virtual override whenNotPaused {
        super._update(from, to, value);
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/introspection/IERC165.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (utils/introspection/IERC165.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC165.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC165.sol)

pragma solidity >=0.4.16;


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC20.sol)

pragma solidity >=0.4.16;


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC1363.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC1363.sol)

pragma solidity >=0.6.2;


/**
 * @title IERC1363
 * @dev Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
 *
 * Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
 * after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
 */
interface IERC1363 is IERC20, IERC165 {
    /*
     * Note: the ERC-165 identifier for this interface is 0xb0202a11.
     * 0xb0202a11 ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @param data Additional data with no specified format, sent in call to `spender`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/utils/SafeERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;


/**
 * @title SafeERC20
 * @dev Wrappers around ERC-20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    /**
     * @dev An operation with an ERC-20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        if (!_safeTransfer(token, to, value, true)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        if (!_safeTransferFrom(token, from, to, value, true)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Variant of {safeTransfer} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransfer(IERC20 token, address to, uint256 value) internal returns (bool) {
        return _safeTransfer(token, to, value, false);
    }

    /**
     * @dev Variant of {safeTransferFrom} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransferFrom(IERC20 token, address from, address to, uint256 value) internal returns (bool) {
        return _safeTransferFrom(token, from, to, value, false);
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     *
     * NOTE: If the token implements ERC-7674, this function will not modify any temporary allowance. This function
     * only sets the "standard" allowance. Any temporary allowance will remain active, in addition to the value being
     * set here.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        if (!_safeApprove(token, spender, value, false)) {
            if (!_safeApprove(token, spender, 0, true)) revert SafeERC20FailedOperation(address(token));
            if (!_safeApprove(token, spender, value, true)) revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that relies on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            safeTransfer(token, to, value);
        } else if (!token.transferAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
     * has no code. This can be used to implement an {ERC721}-like safe transfer that relies on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferFromAndCallRelaxed(
        IERC1363 token,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            safeTransferFrom(token, from, to, value);
        } else if (!token.transferFromAndCall(from, to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
     * Oppositely, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
     * once without retrying, and relies on the returned value to be true.
     *
     * Reverts if the returned value is other than `true`.
     */
    function approveAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            forceApprove(token, to, value);
        } else if (!token.approveAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity `token.transfer(to, value)` call, relaxing the requirement on the return value: the
     * return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param to The recipient of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeTransfer(IERC20 token, address to, uint256 value, bool bubble) private returns (bool success) {
        bytes4 selector = IERC20.transfer.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(to, shr(96, not(0))))
            mstore(0x24, value)
            success := call(gas(), token, 0, 0x00, 0x44, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
        }
    }

    /**
     * @dev Imitates a Solidity `token.transferFrom(from, to, value)` call, relaxing the requirement on the return
     * value: the return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param from The sender of the tokens
     * @param to The recipient of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value,
        bool bubble
    ) private returns (bool success) {
        bytes4 selector = IERC20.transferFrom.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(from, shr(96, not(0))))
            mstore(0x24, and(to, shr(96, not(0))))
            mstore(0x44, value)
            success := call(gas(), token, 0, 0x00, 0x64, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
            mstore(0x60, 0)
        }
    }

    /**
     * @dev Imitates a Solidity `token.approve(spender, value)` call, relaxing the requirement on the return value:
     * the return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param spender The spender of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeApprove(IERC20 token, address spender, uint256 value, bool bubble) private returns (bool success) {
        bytes4 selector = IERC20.approve.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(spender, shr(96, not(0))))
            mstore(0x24, value)
            success := call(gas(), token, 0, 0x00, 0x44, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
        }
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/StorageSlot.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

pragma solidity ^0.8.20;

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC-1967 implementation slot:
 * ```solidity
 * contract ERC1967 {
 *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(newImplementation.code.length > 0);
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * TIP: Consider using this library along with {SlotDerivation}.
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
     */
    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/ReentrancyGuard.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * IMPORTANT: Deprecated. This storage-based reentrancy guard will be removed and replaced
 * by the {ReentrancyGuardTransient} variant in v6.0.
 *
 * @custom:stateless
 */
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    /**
     * @dev A `view` only version of {nonReentrant}. Use to block view functions
     * from being called, preventing reading from inconsistent contract state.
     *
     * CAUTION: This is a "view" modifier and does not change the reentrancy
     * status. Use it only on view functions. For payable or non-payable functions,
     * use the standard {nonReentrant} modifier instead.
     */
    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        _nonReentrantBeforeView();

        // Any calls to nonReentrant after this point will fail
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}


// File contracts/IBIToken.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.24;






/**
 * @title IBIToken — cota de apoiador do IBITI Glamping
 * @author Grupo G01 · Inteli ADMD7 (Blockchain, criptomoedas e tokenização de ativos) · Projeto parceiro IBITI
 *
 * @notice Implementação (versão 1) do ativo digital único modelado no whitepaper do grupo.
 * @dev Modelo vigente (10/09/2026): hospedagens são controladas por pessoa no serviço offchain/.
 *      Contadores e markRedeemed abaixo são compatibilidade histórica da v1; não devem ser usados
 *      em conjunto com o novo cadastro. Não existe identidade individual por unidade ERC-20.
 * Cada unidade inteira do IBIToken reúne, inseparavelmente, três faces:
 *
 *  1. UTILITÁRIA   — direito a uma experiência de hospedagem no IBITI Glamping, consumida por
 *                    "marcação de resgate" (o token NÃO é queimado: seção 3.1 / 4.4 do whitepaper);
 *  2. PERTENCIMENTO — o Passaporte IBITI é um status derivado da posse: quem tem saldo é membro
 *                    (seção 5), verificável por qualquer parceiro do território lendo este contrato;
 *  3. ECONÔMICA    — fração igual dos royalties de 15% sobre o faturamento bruto do Glamping, apurados
 *                    e distribuídos por semestre ao longo de 4 anos (seção 6).
 *
 * Padrão ERC-20 SEM casas decimais (token indivisível — D4), estendido com:
 *  - contadores de unidades ATIVAS e RESGATADAS por carteira (saldo = ativas + resgatadas), que
 *    permitem consumir a experiência sem queima e transferir unidades já usadas sem gasto duplo
 *    (seção 10.3);
 *  - travas de negócio na transferência: destino precisa já ter saldo (única porta de entrada é a
 *    compra primária feita pela carteira administrativa — D10), teto de posse por carteira de 2/15 do
 *    supply (reserva da IBITI isenta — D12), reserva de 1/3 do supply fora de venda salvo decisão
 *    expressa (D8), validade de 4 anos (D5), carteiras revogadas por reemissão bloqueadas;
 *  - reporte de receita assinado pela IBITI (valor + hash do relatório) com cálculo pro-rata
 *    determinístico do royalty por carteira na fotografia de saldos do reporte (seção 6.2 / 6.3);
 *  - pagamento do royalty em stablecoin por saque (pull) quando configurada; do contrário, apenas
 *    o registro on-chain com liquidação em reais fora da blockchain (D9 — direção em aberto);
 *  - reemissão administrativa por perda de chave ou sucessão (seção 5.3 / 10.5);
 *  - pausa de emergência (função recomendada na seção 9.1, adotada nesta v1).
 *
 * Governança: administração única da IBITI (D13) — o `owner` deste contrato é a carteira
 * administrativa da IBITI. A troca de administrador é em dois passos (Ownable2Step) e a renúncia
 * está desabilitada, porque um contrato sem administrador deixaria resgates e reportes sem dono.
 *
 * Parâmetros ECONÔMICOS (supply, reserva, teto por carteira, validade, alíquota) ficam fixos desde o
 * deploy (imutáveis/constantes): alterá-los depois da venda equivaleria a mudar os termos do que já
 * foi vendido (seção 8.3). Só a carteira administrativa e o endereço da stablecoin são ajustáveis,
 * e a reserva só pode ser REDUZIDA por decisão expressa da IBITI (nunca aumentada).
 *
 * O que fica FORA da blockchain, por decisão de arquitetura (seção 10.4): verificação de identidade,
 * vínculo pessoa–carteira, reservas/datas, vouchers de resgate, relatórios financeiros completos.
 * O contrato guarda apenas endereços, quantidades, valores agregados e hashes.
 *
 * @dev Ambiente-alvo desta versão: testnet Sepolia (ambiente simulado, restrição do TAPI).
 */
contract IBIToken is ERC20, ERC20Pausable, Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────────────────────
    // Parâmetros fixos do modelo
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Alíquota do contrato de royalties do território para investimento de terceiro: 15%.
    uint256 public constant ROYALTY_BPS = 1_500;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    /// @notice Apurações semestrais ao longo dos 4 anos de validade: 8 períodos (2027-1 … 2030-2).
    uint8 public constant TOTAL_PERIODS = 8;

    /// @notice Teto da emissão única (projeção do whitepaper: 150 unidades). Não existe mint depois do deploy.
    uint256 public immutable emissionCap;

    /// @notice Máximo de unidades por carteira = 2 dos 15 pontos do royalty = 2/15 do supply (projeção: 20).
    ///         A carteira administrativa (reserva da IBITI) é isenta.
    uint256 public immutable maxPerWallet;

    /// @notice Início da validade (a partir de quando experiências podem ser marcadas como resgatadas).
    uint64 public immutable validFrom;

    /// @notice Fim da validade: depois desta data o contrato rejeita transferências e resgates.
    uint64 public immutable validUntil;

    // ─────────────────────────────────────────────────────────────────────────────
    // Estado
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Unidades que a carteira administrativa deve manter (reserva da IBITI = 5 dos 15 pontos
    ///         do royalty = 1/3 do supply; projeção: 50). Só pode ser reduzida, por decisão expressa.
    uint256 public reservedUnits;

    /// @notice Stablecoin usada para pagar os royalties on-chain. Endereço zero = liquidação fora da blockchain.
    IERC20 public stablecoin;

    /// @notice Último período (semestre) já reportado pela IBITI (0 = nenhum).
    uint8 public lastReportedPeriod;

    /// @dev Unidades já resgatadas (experiência consumida) por carteira. Invariante: <= balanceOf.
    mapping(address => uint256) private _redeemedUnits;

    /// @notice Carteiras invalidadas por reemissão (perda de chave / sucessão). Não recebem, não transferem, não sacam.
    mapping(address => bool) public revoked;

    /// @dev Registro enumerável de carteiras com saldo > 0 (limitado pelo supply: no máximo `emissionCap` endereços).
    address[] private _holders;
    mapping(address => uint256) private _holderIndex; // índice + 1; 0 = não está no registro

    struct Period {
        uint256 grossRevenue;   // faturamento bruto reportado (diárias + consumo), na unidade de conta adotada
        uint256 royaltyAmount;  // 15% do faturamento bruto
        uint256 totalDue;       // soma dos valores registrados por carteira (<= royaltyAmount por arredondamento)
        uint256 snapshotSupply; // supply na fotografia de saldos (constante: não há queima nem mint)
        uint256 holderCount;    // carteiras contempladas
        bytes32 reportHash;     // hash do relatório financeiro que sustenta o valor
        uint64 reportedAt;      // timestamp do reporte (data de corte da fotografia)
        bool onChain;           // true = royalty depositado em stablecoin neste contrato, sacável por claimRoyalty
    }

    mapping(uint8 => Period) private _periods;

    /// @notice Valor de royalty ainda NÃO liquidado por período e carteira (registrado na fotografia do reporte).
    mapping(uint8 => mapping(address => uint256)) public royaltyDue;

    /// @notice Valor de royalty já liquidado (sacado em stablecoin ou pago fora da blockchain) por período e carteira.
    mapping(uint8 => mapping(address => uint256)) public royaltyPaid;

    // ─────────────────────────────────────────────────────────────────────────────
    // Eventos (seção 9.3 do whitepaper — nenhum contém dado pessoal)
    // ─────────────────────────────────────────────────────────────────────────────

    event Emission(address indexed admin, uint256 emissionCap, uint256 reservedUnits, uint256 maxPerWallet, uint64 validFrom, uint64 validUntil);
    event PrimaryPurchase(address indexed to, uint256 units, bytes32 saleRef);
    event UnitsMoved(address indexed from, address indexed to, uint256 activeUnits, uint256 redeemedUnits);
    event RedemptionMarked(address indexed holder, uint256 units, bytes32 voucherRef, uint256 activeRemaining);
    event RevenueReported(uint8 indexed period, uint256 grossRevenue, uint256 royaltyAmount, bytes32 reportHash, uint256 snapshotSupply, uint256 holderCount, bool onChain);
    event RoyaltyRegistered(uint8 indexed period, address indexed holder, uint256 amount);
    event RoyaltyClaimed(uint8 indexed period, address indexed holder, uint256 amount);
    event RoyaltySettledOffChain(uint8 indexed period, address indexed holder, uint256 amount, bytes32 paymentRef);
    event Reissued(address indexed oldWallet, address indexed newWallet, uint256 units, uint256 redeemedUnits);
    event ReserveReduced(uint256 previousReserve, uint256 newReserve);
    event StablecoinSet(address indexed stablecoin);

    // ─────────────────────────────────────────────────────────────────────────────
    // Erros (travas que o contrato verifica sozinho — seção 9.2)
    // ─────────────────────────────────────────────────────────────────────────────

    error InvalidAddress();
    error InvalidEmissionCap(uint256 cap);
    error InvalidValidity(uint64 validFrom, uint64 validUntil);
    error ZeroUnits();
    error RecipientNotHolder(address to);
    error WalletCapExceeded(address wallet, uint256 resultingBalance, uint256 maxPerWallet);
    error ReserveProtected(uint256 adminBalanceAfter, uint256 reservedUnits);
    error WalletRevoked(address wallet);
    error TokenExpired(uint64 validUntil);
    error TokenNotYetValid(uint64 validFrom);
    error InsufficientActiveUnits(address holder, uint256 active, uint256 requested);
    error AllPeriodsReported(uint8 totalPeriods);
    error PeriodNotReported(uint8 period);
    error PeriodNotOnChain(uint8 period);
    error PeriodOnChain(uint8 period);
    error NothingToClaim(uint8 period, address holder);
    error StablecoinAlreadySet(address current);
    error InvalidReserve(uint256 requested, uint256 current);
    error NothingToReissue(address wallet);
    error RenounceDisabled();

    // ─────────────────────────────────────────────────────────────────────────────
    // Emissão (única, no deploy — "Emitir leva", seção 9.1)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @param admin        Carteira administrativa da IBITI: recebe toda a emissão (reserva + unidades à venda)
     *                     e é a única com permissão para as funções administrativas.
     * @param emissionCap_ Quantidade total de unidades da emissão (projeção: 150). Mínimo 15, para que as
     *                     frações do modelo (1/3 de reserva, 2/15 de teto) resultem em unidades inteiras.
     * @param validFrom_   Timestamp (UTC) a partir do qual experiências podem ser resgatadas.
     * @param validUntil_  Timestamp (UTC) de expiração: fim dos 4 anos da emissão.
     * @param stablecoin_  Endereço da stablecoin para pagamento on-chain do royalty, ou zero (liquidação fora da chain).
     */
    constructor(address admin, uint256 emissionCap_, uint64 validFrom_, uint64 validUntil_, address stablecoin_)
        ERC20("IBIToken", "IBT")
        Ownable(admin)
    {
        if (emissionCap_ < 15) revert InvalidEmissionCap(emissionCap_);
        if (validUntil_ <= validFrom_) revert InvalidValidity(validFrom_, validUntil_);

        emissionCap = emissionCap_;
        maxPerWallet = (emissionCap_ * 2) / 15; // 2 dos 15 pontos do royalty
        reservedUnits = emissionCap_ / 3; // 5 dos 15 pontos do royalty
        validFrom = validFrom_;
        validUntil = validUntil_;

        if (stablecoin_ != address(0)) {
            stablecoin = IERC20(stablecoin_);
            emit StablecoinSet(stablecoin_);
        }

        _mint(admin, emissionCap_);
        emit Emission(admin, emissionCap_, reservedUnits, maxPerWallet, validFrom_, validUntil_);
    }

    /// @notice Token indivisível: zero casas decimais (1 unidade = 1 experiência + fração do royalty + membership).
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Funções administrativas (carteira administrativa da IBITI)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @notice Compra primária: entrega `units` unidades a um apoiador que concluiu a verificação de
     * identidade fora da blockchain. É a única forma de uma carteira sem saldo entrar no ecossistema.
     * @param to      Carteira do apoiador verificado.
     * @param units   Quantidade de unidades inteiras.
     * @param saleRef Hash do registro da venda/verificação no sistema da IBITI (rastreabilidade sem dado pessoal).
     * @dev As travas (teto por carteira, reserva, validade, revogação, pausa) são aplicadas em `_update`.
     */
    function primaryPurchase(address to, uint256 units, bytes32 saleRef) external onlyOwner whenNotPaused {
        if (units == 0) revert ZeroUnits();
        _transfer(owner(), to, units);
        emit PrimaryPurchase(to, units, saleRef);
    }

    /**
     * @notice Marca `units` unidades da carteira como resgatadas (experiência consumida) — sem queima.
     * Chamada pela IBITI depois que o sistema de resgate (fora da chain) emitiu o voucher e confirmou a estadia.
     * @param holder     Carteira do portador.
     * @param units      Unidades inteiras consumidas (agregação: várias unidades podem virar uma experiência maior).
     * @param voucherRef Hash do identificador do voucher emitido pelo sistema de resgate (sem dado pessoal).
     */
    function markRedeemed(address holder, uint256 units, bytes32 voucherRef) external onlyOwner whenNotPaused {
        if (units == 0) revert ZeroUnits();
        if (block.timestamp < validFrom) revert TokenNotYetValid(validFrom);
        if (block.timestamp > validUntil) revert TokenExpired(validUntil);
        if (revoked[holder]) revert WalletRevoked(holder);

        uint256 active = activeUnitsOf(holder);
        if (units > active) revert InsufficientActiveUnits(holder, active, units);

        _redeemedUnits[holder] += units;
        emit RedemptionMarked(holder, units, voucherRef, active - units);
    }

    /**
     * @notice Reporta o faturamento bruto do semestre. O contrato calcula o royalty (15%), tira a fotografia
     * de saldos e registra o valor devido a cada carteira, pro-rata ao saldo (inclui a reserva da IBITI;
     * unidades resgatadas continuam contando). Se a stablecoin estiver configurada, o total devido é
     * depositado neste contrato na mesma transação (a IBITI precisa ter aprovado o valor antes) e fica
     * disponível para saque por `claimRoyalty`.
     * @param grossRevenue Faturamento bruto do período (diárias + receitas adicionais), na unidade de conta
     *                     adotada: menor unidade da stablecoin quando configurada; centavos de real caso contrário.
     * @param reportHash   Hash do relatório financeiro que sustenta o valor (o relatório em si fica fora da chain).
     * @dev Custo limitado: o laço percorre no máximo `emissionCap` carteiras (cada uma tem >= 1 unidade).
     */
    function reportRevenue(uint256 grossRevenue, bytes32 reportHash) external onlyOwner whenNotPaused nonReentrant {
        if (lastReportedPeriod >= TOTAL_PERIODS) revert AllPeriodsReported(TOTAL_PERIODS);

        uint8 period = lastReportedPeriod + 1;
        lastReportedPeriod = period;

        uint256 royalty = (grossRevenue * ROYALTY_BPS) / BPS_DENOMINATOR;
        uint256 supply = totalSupply();
        uint256 walletCount = _holders.length;
        bool onChain = address(stablecoin) != address(0);

        uint256 totalDue;
        for (uint256 i = 0; i < walletCount; ++i) {
            address holder = _holders[i];
            uint256 due = (royalty * balanceOf(holder)) / supply;
            if (due == 0) continue;
            royaltyDue[period][holder] += due;
            totalDue += due;
            emit RoyaltyRegistered(period, holder, due);
        }

        _periods[period] = Period({
            grossRevenue: grossRevenue,
            royaltyAmount: royalty,
            totalDue: totalDue,
            snapshotSupply: supply,
            holderCount: walletCount,
            reportHash: reportHash,
            reportedAt: uint64(block.timestamp),
            onChain: onChain
        });

        if (onChain && totalDue > 0) {
            stablecoin.safeTransferFrom(_msgSender(), address(this), totalDue);
        }

        emit RevenueReported(period, grossRevenue, royalty, reportHash, supply, walletCount, onChain);
    }

    /**
     * @notice Registra a liquidação FORA da blockchain (pagamento em reais) do royalty de um portador,
     * em períodos reportados sem stablecoin. Mantém a trilha de auditoria completa on-chain.
     * @param paymentRef Hash do comprovante bancário / referência do pagamento.
     */
    function settleOffChain(uint8 period, address holder, bytes32 paymentRef) external onlyOwner whenNotPaused {
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        if (_periods[period].onChain) revert PeriodOnChain(period);

        uint256 amount = royaltyDue[period][holder];
        if (amount == 0) revert NothingToClaim(period, holder);

        royaltyDue[period][holder] = 0;
        royaltyPaid[period][holder] += amount;
        emit RoyaltySettledOffChain(period, holder, amount, paymentRef);
    }

    /**
     * @notice Reemissão por perda de chave ou sucessão: move todo o saldo (com seus contadores de unidades
     * ativas/resgatadas e os royalties ainda não liquidados) de `oldWallet` para `newWallet` e invalida a
     * carteira antiga, mediante processo administrativo fora da blockchain. Nunca existem dois saldos
     * válidos representando o mesmo direito.
     * @dev Implementada como queima + cunhagem de igual quantidade (supply inalterado): é literalmente uma
     *      reemissão, e não passa pelas regras de transferência entre portadores.
     */
    function reissue(address oldWallet, address newWallet) external onlyOwner whenNotPaused {
        if (newWallet == address(0) || newWallet == oldWallet || oldWallet == owner()) revert InvalidAddress();
        if (revoked[newWallet]) revert WalletRevoked(newWallet);

        uint256 units = balanceOf(oldWallet);
        if (units == 0) revert NothingToReissue(oldWallet);

        uint256 resulting = balanceOf(newWallet) + units;
        if (newWallet != owner() && resulting > maxPerWallet) revert WalletCapExceeded(newWallet, resulting, maxPerWallet);

        uint256 redeemedUnits = _redeemedUnits[oldWallet];
        _redeemedUnits[oldWallet] = 0;
        _redeemedUnits[newWallet] += redeemedUnits;
        revoked[oldWallet] = true;

        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            uint256 pending = royaltyDue[p][oldWallet];
            if (pending > 0) {
                royaltyDue[p][oldWallet] = 0;
                royaltyDue[p][newWallet] += pending;
            }
        }

        _burn(oldWallet, units);
        _mint(newWallet, units);
        emit Reissued(oldWallet, newWallet, units, redeemedUnits);
    }

    /**
     * @notice Reduz a reserva da IBITI (decisão expressa da administração — D8: "fora de venda salvo decisão
     * dela"). A reserva nunca pode ser aumentada: isso retiraria unidades já prometidas à venda.
     */
    function reduceReserve(uint256 newReserve) external onlyOwner {
        uint256 current = reservedUnits;
        if (newReserve >= current) revert InvalidReserve(newReserve, current);
        reservedUnits = newReserve;
        emit ReserveReduced(current, newReserve);
    }

    /// @notice Define a stablecoin de pagamento (uma única vez). Períodos reportados antes seguem liquidados fora da chain.
    function setStablecoin(address stablecoin_) external onlyOwner {
        if (stablecoin_ == address(0)) revert InvalidAddress();
        if (address(stablecoin) != address(0)) revert StablecoinAlreadySet(address(stablecoin));
        stablecoin = IERC20(stablecoin_);
        emit StablecoinSet(stablecoin_);
    }

    /// @notice Pausa de emergência: congela transferências, resgates, reportes e saques (incidente, ordem judicial).
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Retoma a operação.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice A renúncia está desabilitada: sem administrador não há resgate, reporte nem reemissão.
    function renounceOwnership() public view override onlyOwner {
        revert RenounceDisabled();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Portador: saque do royalty (jornada expert: a própria carteira; assistida: o custodiante)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @notice Saca, em stablecoin, o royalty registrado para o chamador em um período reportado on-chain.
     * @dev Padrão pull: cada carteira saca o que lhe cabe; um endereço problemático não bloqueia os demais.
     */
    function claimRoyalty(uint8 period) external whenNotPaused nonReentrant {
        address holder = _msgSender();
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        if (!_periods[period].onChain) revert PeriodNotOnChain(period);
        if (revoked[holder]) revert WalletRevoked(holder);

        uint256 amount = royaltyDue[period][holder];
        if (amount == 0) revert NothingToClaim(period, holder);

        royaltyDue[period][holder] = 0;
        royaltyPaid[period][holder] += amount;
        stablecoin.safeTransfer(holder, amount);
        emit RoyaltyClaimed(period, holder, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Consultas públicas ("Verificar acesso", seção 9.1 — usadas por parceiros do território)
    // ─────────────────────────────────────────────────────────────────────────────

    /// @notice Unidades com experiência ainda disponível.
    function activeUnitsOf(address account) public view returns (uint256) {
        return balanceOf(account) - _redeemedUnits[account];
    }

    /// @notice Unidades cuja experiência já foi consumida (continuam valendo membership e royalty).
    function redeemedUnitsOf(address account) public view returns (uint256) {
        return _redeemedUnits[account];
    }

    /// @notice True depois do fim dos 4 anos: as três faces do token se extinguem (o registro fica como histórico).
    function isExpired() public view returns (bool) {
        return block.timestamp > validUntil;
    }

    /// @notice Passaporte IBITI: quem tem saldo, não foi revogado e está dentro da validade é membro.
    function isMember(address account) public view returns (bool) {
        return balanceOf(account) > 0 && !revoked[account] && !isExpired();
    }

    /**
     * @notice Consulta única para liberação de benefícios: saldo total, unidades ativas, resgatadas,
     * condição de membro e situação de validade. Não expõe nenhum dado pessoal.
     */
    function accessInfo(address account)
        external
        view
        returns (uint256 balance, uint256 active, uint256 redeemed, bool member, bool expired)
    {
        balance = balanceOf(account);
        redeemed = _redeemedUnits[account];
        active = balance - redeemed;
        member = isMember(account);
        expired = isExpired();
    }

    /// @notice Unidades que a carteira administrativa ainda pode vender sem tocar na reserva.
    function saleableUnits() external view returns (uint256) {
        uint256 adminBalance = balanceOf(owner());
        return adminBalance > reservedUnits ? adminBalance - reservedUnits : 0;
    }

    /// @notice Carteiras com saldo > 0 (a fotografia usada nas distribuições).
    function holders() external view returns (address[] memory) {
        return _holders;
    }

    function holderCount() external view returns (uint256) {
        return _holders.length;
    }

    /// @notice Dados de um período reportado.
    function periodInfo(uint8 period) external view returns (Period memory) {
        if (period == 0 || period > lastReportedPeriod) revert PeriodNotReported(period);
        return _periods[period];
    }

    /// @notice Soma do royalty ainda não liquidado de uma carteira em todos os períodos reportados.
    function pendingRoyaltyOf(address account) external view returns (uint256 total) {
        for (uint8 p = 1; p <= lastReportedPeriod; ++p) {
            total += royaltyDue[p][account];
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Núcleo: travas de transferência e contadores (seção 9.2 / 10.3)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * @dev Toda movimentação passa por aqui (ERC-20 + pausa). Para transferências entre carteiras:
     *      1. validade: rejeita depois de `validUntil`;
     *      2. revogação: origem e destino não podem estar invalidados por reemissão;
     *      3. porta de entrada: destino sem saldo só recebe da carteira administrativa (compra primária);
     *         a carteira administrativa sempre pode receber (ex.: devolução, troca de administrador);
     *      4. teto por carteira: 2/15 do supply, exceto a carteira administrativa (reserva);
     *      5. reserva: a carteira administrativa não desce abaixo de `reservedUnits`;
     *      6. contadores: move primeiro unidades ativas; se exceder, move unidades resgatadas, que chegam
     *         ao destino já marcadas como consumidas (sem gasto duplo de experiência).
     *      Cunhagem (deploy, reemissão) e queima (reemissão) não passam pelas regras 1–6.
     */
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        if (from != address(0) && to != address(0) && from != to) {
            _enforceTransferRules(from, to, value);
            _moveUnits(from, to, value);
        }

        super._update(from, to, value);

        if (from != address(0)) _syncHolder(from);
        if (to != address(0)) _syncHolder(to);
    }

    function _enforceTransferRules(address from, address to, uint256 value) private view {
        if (block.timestamp > validUntil) revert TokenExpired(validUntil);
        if (revoked[from]) revert WalletRevoked(from);
        if (revoked[to]) revert WalletRevoked(to);

        address admin = owner();
        uint256 toBalance = balanceOf(to);

        if (to != admin) {
            if (from != admin && toBalance == 0) revert RecipientNotHolder(to);
            if (toBalance + value > maxPerWallet) revert WalletCapExceeded(to, toBalance + value, maxPerWallet);
        }

        if (from == admin) {
            uint256 fromBalance = balanceOf(from);
            // saldo insuficiente é tratado pelo ERC-20 (ERC20InsufficientBalance); aqui só a reserva
            if (fromBalance >= value && fromBalance - value < reservedUnits) {
                revert ReserveProtected(fromBalance - value, reservedUnits);
            }
        }
    }

    function _moveUnits(address from, address to, uint256 value) private {
        uint256 fromBalance = balanceOf(from);
        if (fromBalance < value) return; // o ERC-20 reverte em seguida com ERC20InsufficientBalance

        uint256 active = fromBalance - _redeemedUnits[from];
        if (value > active) {
            uint256 movedRedeemed = value - active;
            _redeemedUnits[from] -= movedRedeemed;
            _redeemedUnits[to] += movedRedeemed;
            emit UnitsMoved(from, to, active, movedRedeemed);
        } else {
            emit UnitsMoved(from, to, value, 0);
        }
    }

    function _syncHolder(address account) private {
        uint256 balance = balanceOf(account);
        uint256 index = _holderIndex[account];

        if (balance > 0 && index == 0) {
            _holders.push(account);
            _holderIndex[account] = _holders.length;
        } else if (balance == 0 && index != 0) {
            uint256 lastIndex = _holders.length;
            if (index != lastIndex) {
                address moved = _holders[lastIndex - 1];
                _holders[index - 1] = moved;
                _holderIndex[moved] = index;
            }
            _holders.pop();
            _holderIndex[account] = 0;
        }
    }
}


// File contracts/mocks/MockStablecoin.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.24;

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

