// Remix: usa o registro criado por 01_publicar.js. Edite somente config.
// Hospedagens são operadas em offchain/, nunca por uma chamada de resgate no contrato.
(async () => {
  const config = {
    acao: 'status', // status, registrar, compra, transferencia, reporte, saque, anunciar-recuperacao, recuperacao, cancelar-recuperacao, pausar, retomar
    destino: '', origem: '', quantidade: '1', faturamento: '1000.00', periodo: 1,
    identificadorPessoa: '', // bytes32 preparado pelo serviço; não inserir CPF
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
  if (record.contractVersion !== 3) throw Error('Registro histórico: esta operação exige deploy da versão técnica 3.');
  const token = new ethers.Contract(record.token,metadata.abi,signer);
  const hash = ethers.id ? ethers.id(config.referencia) : ethers.utils.id(config.referencia);
  const parseUnits = ethers.parseUnits ?? ethers.utils.parseUnits;
  let tx;
  switch (config.acao) {
    case 'status': {
      const result={token:record.token,rede:record.chainId,nome:await token.name(),supply:String(await token.totalSupply()),reserva:String(await token.reservedUnits()),teto:String(await token.maxPerWallet()),administrador:await token.owner(),tesouraria:await token.treasury(),precoUnitario:String(await token.primaryUnitPrice()),pausado:await token.paused(),periodos:String(await token.lastReportedPeriod())};
      console.log(result);return result;
    }
    case 'registrar': tx=await token.registerWallet(config.destino,config.identificadorPessoa);break;
    case 'compra': {
      const currency=await token.stablecoin();
      if(currency === '0x0000000000000000000000000000000000000000') tx=await token.primaryPurchase(config.destino,config.quantidade,hash);
      else {
        const buyer=await signer.getAddress();
        if(config.destino && config.destino.toLowerCase()!==buyer.toLowerCase()) throw Error('Selecione a carteira do próprio comprador.');
        const cost=BigInt((await token.primaryUnitPrice()).toString())*BigInt(config.quantidade);
        if(cost<=0n) throw Error('Configure preço e quantidade positivos.');
        const stable=new ethers.Contract(currency,['function approve(address,uint256) returns(bool)'],signer);
        await(await stable.approve(record.token,cost.toString())).wait();
        tx=await token.buyPrimary(config.quantidade,hash);
      }
      break;
    }
    case 'transferencia': tx=await token.transfer(config.destino,config.quantidade);break;
    case 'saque': tx=await token.claimRoyalty(config.periodo);break;
    case 'anunciar-recuperacao': tx=await token.requestRecovery(config.origem,config.destino,hash);break;
    case 'cancelar-recuperacao': tx=await token.cancelRecovery(config.origem);break;
    case 'recuperacao': tx=await token.reissue(config.origem,config.destino);break;
    case 'pausar': tx=await token.pause();break;
    case 'retomar': tx=await token.unpause();break;
    case 'reporte': {
      const next=Number(await token.lastReportedPeriod())+1;
      if(next>8) throw Error('Todos os semestres já foram reportados.');
      const end=Number(await token.periodEnd(next));
      if((await provider.getBlock('latest')).timestamp<end) throw Error('Semestre ainda não encerrado: '+new Date(end*1000).toISOString());
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
