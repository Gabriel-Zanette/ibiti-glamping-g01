import type { Quote } from "./purchase.ts";
/** O servidor de produção não fornece implementação automática deste adaptador. */
export interface CustodyGateway {
  readonly mode: "local-demo";
  wallet(personId: string): Promise<string>;
  sign(personId: string, message: string): Promise<string>;
  register(wallet: string, personChainId: string): Promise<string | null>;
  execute(
    personId: string,
    quote: Quote,
    submitted: (hash: string) => void,
  ): Promise<string>;
}
