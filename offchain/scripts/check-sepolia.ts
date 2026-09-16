import { FetchRequest, JsonRpcProvider, Contract } from 'ethers';
import { ABI } from '../src/chain.ts';
import { ensure } from '../src/ledger.ts';
const rpc=new FetchRequest(process.env.RPC_URL??'https://ethereum-sepolia-rpc.publicnode.com');rpc.timeout=10000;
const provider=new JsonRpcProvider(rpc,undefined,{cacheTimeout:-1});
try {
  ensure(Number((await provider.getNetwork()).chainId)===11155111,'WRONG_CHAIN');
  const block=await provider.getBlock('finalized');
  const address=process.env.TOKEN_ADDRESS;
  if(!address){console.log(JSON.stringify({network:'Sepolia',chainId:11155111,finalizedBlock:block?.number,status:'RPC_OK_TOKEN_ADDRESS_MISSING'},null,2));process.exitCode=2;}
  else {
    const token=new Contract(address,ABI,provider);
    const [name,decimals,supply,from,until,owner]=await Promise.all([token.name(),token.decimals(),token.totalSupply(),token.validFrom(),token.validUntil(),token.owner()]);
    ensure(name==='IBIToken'&&Number(decimals)===0&&supply===150n,'INCOMPATIBLE_CONTRACT');
    console.log(JSON.stringify({network:'Sepolia',address,name,decimals:Number(decimals),supply:String(supply),validFrom:String(from),validUntil:String(until),owner,finalizedBlock:block?.number,status:'IBITOKEN_CONFIRMED'},null,2));
  }
} catch(e){console.error(e instanceof Error && /^[A-Z_]+$/.test(e.message)?e.message:'SEPOLIA_CHECK_FAILED');process.exitCode=1;}
finally{provider.destroy();}
