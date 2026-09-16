import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { JsonRpcProvider, ContractFactory } from 'ethers';
import { artifact } from './compile.ts';

export async function localChain(port = 0) {
  const probe=createServer();probe.listen(port,'127.0.0.1');await once(probe,'listening');
  const address=probe.address();if (!address || typeof address==='string') throw Error('Porta local indisponível');
  port=address.port;probe.close();await once(probe,'close');
  const binary=fileURLToPath(new URL('../node_modules/.bin/anvil',import.meta.url));
  const child=spawn(binary,['--host','127.0.0.1','--port',String(port),'--chain-id','31337','--hardfork','osaka','--silent'],{stdio:['ignore','ignore','pipe']});
  let startupError:Error|undefined;let stderr='';child.on('error',e=>{startupError=e;});child.stderr.on('data',b=>{stderr+=String(b);});
  const provider=new JsonRpcProvider(`http://127.0.0.1:${port}`,31337,{staticNetwork:true,cacheTimeout:-1});
  provider.pollingInterval=20;
  const stop=async()=>{provider.destroy();if(child.exitCode===null && child.pid){child.kill('SIGTERM');await once(child,'exit');}};
  try {
    let ready=false;
    for(let i=0;i<100;i++) {
      if(startupError)throw startupError;
      if(child.exitCode!==null)throw Error(`Anvil falhou: ${stderr}`);
      try{await provider.getBlockNumber();ready=true;break;}catch{await new Promise(r=>setTimeout(r,50));}
    }
    if(!ready)throw Error('Anvil não iniciou em tempo hábil.');
    const signers=await Promise.all(Array.from({length:10},(_,i)=>provider.getSigner(i)));
    async function deploy(name:string,args:unknown[]=[],signer=signers[0]):Promise<any>{const a=artifact(name);const c=await new ContractFactory(a.abi,a.bytecode,signer).deploy(...args);await c.waitForDeployment();return c;}
    return {provider,signers,deploy,stop,port};
  }catch(e){await stop();throw e;}
}
