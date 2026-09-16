// Remix: compile IBIToken.sol e mocks/MockStablecoin.sol antes de executar.
// O ambiente e a conta são os selecionados em Deploy & Run Transactions.
// Padrão: demonstração na Remix VM. Sepolia exige habilitação explícita abaixo.
(async () => {
  const config = {
    permitirSepolia: false,
    stablecoinSepolia: '0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE',
    // Datas de demonstração. Os termos econômicos de produção precisam de ratificação.
    validadeEmDias: 1460
  };
  const provider = ethers.BrowserProvider ? new ethers.BrowserProvider(web3Provider) : new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  if (![1337,31337,11155111].includes(chainId)) throw Error('Selecione Remix VM ou Sepolia.');
  if (chainId === 11155111 && !config.permitirSepolia) throw Error('Sepolia desabilitada. Revise o contrato e habilite permitirSepolia para uma nova publicação.');
  const signer = await provider.getSigner();
  const admin = await signer.getAddress();
  const waitDeployment = async c => ethers.BrowserProvider ? c.waitForDeployment() : c.deployed();
  const addressOf = async c => ethers.BrowserProvider ? c.getAddress() : c.address;
  const deploy = async (name,legacyPath,args) => {
    let metadata;
    for (const path of ['artifacts/'+name+'.json',legacyPath]) {
      try {
        const candidate = JSON.parse(await remix.call('fileManager','getFile',path));
        if (candidate.abi && candidate.data?.bytecode?.object) { metadata=candidate;break; }
      } catch { /* O Remix pode gravar artefatos na raiz ou junto da fonte. */ }
    }
    if (!metadata) throw Error('Compile '+name+'.sol no Remix antes de publicar.');
    const factory = new ethers.ContractFactory(metadata.abi,metadata.data.bytecode.object,signer);
    const contract = await factory.deploy(...args);
    await waitDeployment(contract);
    return contract;
  };
  let stablecoin = config.stablecoinSepolia;
  if (chainId !== 11155111) {
    const stable = await deploy('MockStablecoin','contracts/mocks/artifacts/MockStablecoin.json',['Teste','tBRL',6]);
    stablecoin = await addressOf(stable);
    await (await stable.mint(admin,'1000000000')).wait(); // 1.000 tBRL fictícios; não altera os 150 IBT.
  } else if (!ethers.isAddress?.(stablecoin) && !ethers.utils?.isAddress(stablecoin)) throw Error('Endereço de stablecoin inválido.');
  const block = await provider.getBlock('latest');
  const validFrom = block.timestamp;
  const validUntil = validFrom + config.validadeEmDias * 86400;
  const token = await deploy('IBIToken','contracts/artifacts/IBIToken.json',[admin,150,validFrom,validUntil,stablecoin]);
  const tx = ethers.BrowserProvider ? token.deploymentTransaction() : token.deployTransaction;
  const receipt = await tx.wait();
  const record = {contractVersion:2,chainId,token:await addressOf(token),stablecoin,admin,supply:'150',decimals:0,validFrom,validUntil,transactionHash:tx.hash,startBlock:receipt.blockNumber};
  await remix.call('fileManager','setFile','deployments/remix-latest.json',JSON.stringify(record,null,2));
  console.log('Publicação confirmada. Salve o registro deployments/remix-latest.json:',record);
  return record;
})().catch(error => { console.error(error.message); throw error; });
