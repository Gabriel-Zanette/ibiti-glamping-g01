// Remix: usa o registro criado por 01_publicar.js. Edite somente config.
// Hospedagens são operadas em offchain/, nunca por uma chamada de resgate no contrato.
(async () => {
  const config = {
    acao: 'status', // status, compra, transferencia, reporte, saque, recuperacao, pausar, retomar
    destino: '', origem: '', quantidade: '1', faturamento: '1000.00', periodo: 1,
    referencia: 'demonstracao-academica'
  };
  const record = JSON.parse(await remix.call('fileManager','getFile','deployments/remix-latest.json'));
  const provider = ethers.BrowserProvider ? new ethers.BrowserProvider(web3Provider) : new ethers.providers.Web3Provider(web3Provider);
  if (Number((await provider.getNetwork()).chainId) !== record.chainId) throw Error('A rede selecionada difere da publicação registrada.');
  if (await provider.getCode(record.token) === '0x') throw Error('Contrato não encontrado nesta rede.');
  const signer = await provider.getSigner();
  let metadata;
  for (const path of ['artifacts/IBIToken.json','contracts/artifacts/IBIToken.json']) {
    try {
      const candidate = JSON.parse(await remix.call('fileManager','getFile',path));
      if (candidate.abi) { metadata=candidate;break; }
    } catch { /* Compatibilidade com a organização de artefatos do Remix. */ }
  }
  if (!metadata) throw Error('Compile IBIToken.sol no Remix antes de operar.');
  const token = new ethers.Contract(record.token,metadata.abi,signer);
  const hash = ethers.id ? ethers.id(config.referencia) : ethers.utils.id(config.referencia);
  const parseUnits = ethers.parseUnits ?? ethers.utils.parseUnits;
  let tx;
  switch (config.acao) {
    case 'status': {
      const result={token:record.token,rede:record.chainId,nome:await token.name(),supply:String(await token.totalSupply()),reserva:String(await token.reservedUnits()),teto:String(await token.maxPerWallet()),administrador:await token.owner(),pausado:await token.paused(),periodos:String(await token.lastReportedPeriod())};
      console.log(result);return result;
    }
    case 'compra': tx=await token.primaryPurchase(config.destino,config.quantidade,hash);break;
    case 'transferencia': tx=await token.transfer(config.destino,config.quantidade);break;
    case 'saque': tx=await token.claimRoyalty(config.periodo);break;
    case 'recuperacao': tx=await token.reissue(config.origem,config.destino);break;
    case 'pausar': tx=await token.pause();break;
    case 'retomar': tx=await token.unpause();break;
    case 'reporte': {
      const currency = await token.stablecoin();let decimals=2;
      if (currency !== '0x0000000000000000000000000000000000000000') {
        const stable=new ethers.Contract(currency,['function decimals() view returns(uint8)','function allowance(address,address) view returns(uint256)','function approve(address,uint256) returns(bool)'],signer);
        decimals=Number(await stable.decimals());
        const gross=BigInt(parseUnits(config.faturamento,decimals).toString());
        const required=gross*1500n/10000n;
        if(BigInt((await stable.allowance(await signer.getAddress(),record.token)).toString())<required) await(await stable.approve(record.token,required.toString())).wait();
      }
      tx=await token.reportRevenue(parseUnits(config.faturamento,decimals),hash);break;
    }
    default: throw Error('Ação desconhecida. Use uma das ações documentadas.');
  }
  const receipt=await tx.wait();console.log('Transação confirmada:',tx.hash);return {transactionHash:tx.hash,status:receipt.status};
})().catch(error => { console.error(error.message); throw error; });
