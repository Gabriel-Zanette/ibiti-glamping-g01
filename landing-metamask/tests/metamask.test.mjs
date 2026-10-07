import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../metamask.js', import.meta.url), 'utf8');

function element() {
  const listeners = new Map();
  return {
    classList: { toggle() {}, add() {}, remove() {} },
    dataset: {},
    disabled: false,
    hidden: false,
    href: '',
    textContent: '',
    title: '',
    addEventListener(type, callback) { listeners.set(type, callback); },
    listeners
  };
}

function load(provider) {
  const ids = [
    'wallet-account', 'wallet-balance', 'wallet-connect', 'wallet-details',
    'wallet-explorer', 'wallet-install', 'wallet-message', 'wallet-network',
    'wallet-title'
  ];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  const document = {
    readyState: 'complete',
    addEventListener() {},
    getElementById(id) { return elements[id]; }
  };
  const window = { ethereum: provider };
  const context = vm.createContext({ BigInt, document, Error, Object, Number, String, window });
  vm.runInContext(source, context);
  return { api: window.IBITokenMetaMask, elements };
}

test('gera a chamada ERC-20 balanceOf para a carteira conectada', () => {
  const { api } = load(null);
  const address = '0x1234567890abcdef1234567890abcdef12345678';
  assert.equal(
    api.utils.balanceOfCallData(address),
    '0x70a08231' + '1234567890abcdef1234567890abcdef12345678'.padStart(64, '0')
  );
  assert.equal(api.utils.parseHexBalance('0x14'), 20n);
  assert.equal(api.utils.shortAddress(address), '0x1234…5678');
});

test('conecta, troca para Sepolia e consulta o saldo sem pedir transação', async () => {
  const calls = [];
  let chainId = '0x1';
  const address = '0x1234567890abcdef1234567890abcdef12345678';
  const provider = {
    on() {},
    async request(payload) {
      calls.push(payload);
      if (payload.method === 'eth_accounts') return [];
      if (payload.method === 'eth_requestAccounts') return [address];
      if (payload.method === 'eth_chainId') return chainId;
      if (payload.method === 'wallet_switchEthereumChain') { chainId = '0xaa36a7'; return null; }
      if (payload.method === 'eth_getCode') return '0x6000';
      if (payload.method === 'eth_call') return '0x02';
      throw new Error(`método inesperado: ${payload.method}`);
    }
  };

  const { api, elements } = load(provider);
  await api.connect(true);

  assert.equal(elements['wallet-network'].textContent, 'Sepolia');
  assert.equal(elements['wallet-balance'].textContent, '2 IBT');
  assert.equal(elements['wallet-connect'].dataset.connected, 'true');
  assert.ok(calls.some(call => call.method === 'wallet_switchEthereumChain'));
  assert.ok(calls.some(call => call.method === 'eth_call'));
  assert.ok(!calls.some(call => ['eth_sendTransaction', 'personal_sign'].includes(call.method)));
});

test('não abre troca de rede automaticamente antes do clique da pessoa', async () => {
  const calls = [];
  const address = '0x1234567890abcdef1234567890abcdef12345678';
  const provider = {
    on() {},
    async request(payload) {
      calls.push(payload);
      if (payload.method === 'eth_accounts') return [address];
      if (payload.method === 'eth_chainId') return '0x1';
      throw new Error(`método inesperado: ${payload.method}`);
    }
  };

  const { api, elements } = load(provider);
  await api.connect(false);

  assert.ok(!calls.some(call => call.method === 'wallet_switchEthereumChain'));
  assert.match(elements['wallet-message'].textContent, /Clique em “Conectar MetaMask”/);
});
