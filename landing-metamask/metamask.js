(function () {
  'use strict';

  var CONFIG = Object.freeze({
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    chainName: 'Sepolia',
    contractAddress: '0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030',
    tokenSymbol: 'IBT',
    tokenDecimals: 0,
    explorerUrl: 'https://sepolia.etherscan.io/address/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030'
  });

  var BALANCE_OF_SELECTOR = '0x70a08231';
  var connectedAccount = '';

  function byId(id) {
    return document.getElementById(id);
  }

  function shortAddress(address) {
    return address ? address.slice(0, 6) + '…' + address.slice(-4) : '—';
  }

  function normalizeChainId(value) {
    return typeof value === 'number' ? value : Number.parseInt(String(value), 16);
  }

  function balanceOfCallData(address) {
    var clean = String(address).toLowerCase().replace(/^0x/, '');
    if (!/^[0-9a-f]{40}$/.test(clean)) throw new Error('Endereço de carteira inválido.');
    return BALANCE_OF_SELECTOR + clean.padStart(64, '0');
  }

  function parseHexBalance(value) {
    if (!/^0x[0-9a-f]+$/i.test(String(value))) throw new Error('Saldo retornado pela rede é inválido.');
    return BigInt(value);
  }

  function formatTokenBalance(value) {
    if (CONFIG.tokenDecimals === 0) return value.toString() + ' ' + CONFIG.tokenSymbol;
    var divisor = 10n ** BigInt(CONFIG.tokenDecimals);
    return (value / divisor).toString() + ' ' + CONFIG.tokenSymbol;
  }

  function provider() {
    return window.ethereum || null;
  }

  function setBusy(busy) {
    var button = byId('wallet-connect');
    button.disabled = busy;
    button.textContent = busy ? 'Conectando…' : connectedAccount ? shortAddress(connectedAccount) : 'Conectar MetaMask';
  }

  function renderDisconnected(message, isError) {
    connectedAccount = '';
    byId('wallet-title').textContent = 'Carteira ainda não conectada';
    byId('wallet-message').textContent = message || 'Conecte a MetaMask para conferir sua rede, seu endereço e seu saldo de IBT. A conexão não realiza compra nem movimenta tokens.';
    byId('wallet-message').classList.toggle('wallet-error', Boolean(isError));
    byId('wallet-details').hidden = true;
    byId('wallet-connect').dataset.connected = 'false';
    byId('wallet-install').hidden = Boolean(provider());
    setBusy(false);
  }

  function renderConnected(account, balance) {
    connectedAccount = account;
    byId('wallet-title').textContent = 'MetaMask conectada';
    byId('wallet-message').textContent = 'Conexão somente para consulta. Nenhuma assinatura, compra ou transferência foi solicitada.';
    byId('wallet-message').classList.remove('wallet-error');
    byId('wallet-account').textContent = shortAddress(account);
    byId('wallet-account').title = account;
    byId('wallet-network').textContent = CONFIG.chainName;
    byId('wallet-balance').textContent = formatTokenBalance(balance);
    byId('wallet-details').hidden = false;
    byId('wallet-connect').dataset.connected = 'true';
    byId('wallet-install').hidden = true;
    setBusy(false);
  }

  async function ensureSepolia(walletProvider) {
    var current = await walletProvider.request({ method: 'eth_chainId' });
    if (normalizeChainId(current) === CONFIG.chainId) return;

    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CONFIG.chainIdHex }]
      });
    } catch (error) {
      if (error && error.code === 4902) {
        await walletProvider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CONFIG.chainIdHex,
            chainName: 'Sepolia test network',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
        return;
      }
      throw error;
    }
  }

  async function readBalance(walletProvider, account) {
    var code = await walletProvider.request({
      method: 'eth_getCode',
      params: [CONFIG.contractAddress, 'latest']
    });
    if (!code || code === '0x') throw new Error('O contrato IBIToken não foi encontrado na Sepolia.');

    var result = await walletProvider.request({
      method: 'eth_call',
      params: [{ to: CONFIG.contractAddress, data: balanceOfCallData(account) }, 'latest']
    });
    return parseHexBalance(result);
  }

  function friendlyError(error) {
    if (!error) return 'Não foi possível conectar a carteira.';
    if (error.code === 4001) return 'Conexão cancelada na MetaMask.';
    if (error.code === -32002) return 'Já existe uma solicitação aberta na MetaMask. Confira a extensão.';
    return error.message || 'Não foi possível conectar a carteira.';
  }

  async function connect(requestPermission) {
    var walletProvider = provider();
    if (!walletProvider) {
      renderDisconnected('MetaMask não encontrada. Instale a extensão e abra esta página por um servidor local ou HTTPS.', true);
      return;
    }

    setBusy(true);
    try {
      var accounts = await walletProvider.request({
        method: requestPermission ? 'eth_requestAccounts' : 'eth_accounts'
      });
      if (!accounts || !accounts.length) {
        renderDisconnected();
        return;
      }

      var currentChainId = await walletProvider.request({ method: 'eth_chainId' });
      if (normalizeChainId(currentChainId) !== CONFIG.chainId && !requestPermission) {
        renderDisconnected('MetaMask detectada. Clique em “Conectar MetaMask” para trocar para a rede Sepolia.', false);
        return;
      }

      await ensureSepolia(walletProvider);
      var confirmedChainId = await walletProvider.request({ method: 'eth_chainId' });
      if (normalizeChainId(confirmedChainId) !== CONFIG.chainId) {
        throw new Error('Selecione a rede Sepolia na MetaMask para consultar seu saldo.');
      }
      var account = accounts[0];
      var balance = await readBalance(walletProvider, account);
      renderConnected(account, balance);
    } catch (error) {
      renderDisconnected(friendlyError(error), true);
    }
  }

  function init() {
    byId('wallet-explorer').href = CONFIG.explorerUrl;
    byId('wallet-connect').addEventListener('click', function () { connect(true); });

    var walletProvider = provider();
    if (!walletProvider) {
      renderDisconnected('MetaMask não encontrada. Você ainda pode navegar pela landing normalmente.', false);
      return;
    }

    walletProvider.on && walletProvider.on('accountsChanged', function (accounts) {
      if (!accounts || !accounts.length) renderDisconnected('A carteira foi desconectada na MetaMask.');
      else connect(false);
    });
    walletProvider.on && walletProvider.on('chainChanged', function () { connect(false); });
    connect(false);
  }

  window.IBITokenMetaMask = Object.freeze({
    config: CONFIG,
    connect: connect,
    utils: Object.freeze({
      balanceOfCallData: balanceOfCallData,
      normalizeChainId: normalizeChainId,
      parseHexBalance: parseHexBalance,
      shortAddress: shortAddress
    })
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
