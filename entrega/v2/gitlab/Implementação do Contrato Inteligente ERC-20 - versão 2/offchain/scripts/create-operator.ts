import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { runtime } from "../src/runtime.ts";
import type { Role } from "../src/portal.ts";
let muted = false;
const output = new Writable({
  write(chunk, _encoding, done) {
    if (!muted) process.stdout.write(chunk);
    done();
  },
});
const prompt = createInterface({
  input: process.stdin,
  output,
  terminal: Boolean(process.stdin.isTTY),
});
const r = runtime();
try {
  const email = await prompt.question("E-mail individual do funcionário: "),
    name = await prompt.question("Nome do funcionário: "),
    role = await prompt.question(
      "Papel (cadastro, financeiro, atendimento ou supervisao): ",
    );
  process.stdout.write("Senha (mínimo 15 caracteres; entrada oculta): ");
  muted = true;
  const password = await prompt.question("");
  muted = false;
  process.stdout.write("\n");
  const account = await r.portal.createOperator(
    email,
    password,
    name,
    role as Role,
  );
  console.log(
    `Conta criada: ${account.name} · ${account.role}. Nenhuma permissão de carteira foi concedida pelo login.`,
  );
} finally {
  muted = false;
  prompt.close();
  r.close();
}
