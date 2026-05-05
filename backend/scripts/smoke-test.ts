/**
 * Smoke Test — testa todos os endpoints do backend GR Manager
 *
 * Uso:
 *   npm run test:smoke
 *
 * Requisitos:
 *   - Backend rodando em http://localhost:3000 (ou PORT definida)
 *   - Banco de dados conectado (preferencialmente com seed executado)
 */

const BASE = process.env.API_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  method: string;
  path: string;
  status: number;
  ok: boolean;
  ms: number;
  error?: string;
}

const results: TestResult[] = [];
let createdIds: Record<string, string> = {};

async function test(
  name: string,
  method: string,
  path: string,
  body?: unknown
): Promise<any> {
  const start = Date.now();
  try {
    const opts: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE}${path}`, opts);
    const ms = Date.now() - start;
    const data = res.headers.get("content-type")?.includes("json")
      ? await res.json()
      : await res.text();

    results.push({ name, method, path, status: res.status, ok: res.ok, ms });

    const icon = res.ok ? "✅" : "❌";
    console.log(`  ${icon} ${method.padEnd(6)} ${path.padEnd(50)} ${res.status}  (${ms}ms)`);

    if (!res.ok) {
      const errorMsg = typeof data === "string" ? data : JSON.stringify(data);
      results[results.length - 1].error = errorMsg.slice(0, 200);
    }

    return { status: res.status, data, ok: res.ok };
  } catch (err: any) {
    const ms = Date.now() - start;
    console.log(`  💥 ${method.padEnd(6)} ${path.padEnd(50)} FAIL  (${ms}ms) — ${err.message}`);
    results.push({ name, method, path, status: 0, ok: false, ms, error: err.message });
    return { status: 0, data: null, ok: false };
  }
}

async function main() {
  console.log(`\n🔥 Smoke Test — Backend GR Manager`);
  console.log(`   Base URL: ${BASE}\n`);

  // ───── HEALTH ─────
  console.log("── Health ──");
  await test("Health check", "GET", "/");

  // ───── CATEGORIAS ─────
  console.log("\n── Categorias de Equipamento ──");
  // Não há controller dedicado, mas equipamentos dependem de categorias
  // Vamos testar indiretamente via equipamentos

  // ───── CLIENTES ─────
  console.log("\n── Clientes ──");
  const clienteBody = {
    tipo: "pessoa_juridica",
    razao_social: "Smoke Test Ltda",
    nome_fantasia: "Smoke Test",
    cnpj: "99.999.999/0001-99",
    email: "smoke@test.com",
    telefone: "(11) 0000-0000",
    cidade: "São Paulo",
    estado: "SP",
  };

  const { data: createdCliente } = await test("Criar cliente", "POST", "/clientes", clienteBody);
  if (createdCliente?.id) createdIds.cliente = createdCliente.id;

  await test("Listar clientes", "GET", "/clientes");
  await test("Listar clientes (paginado)", "GET", "/clientes?skip=0&take=5");
  await test("Clientes ativos", "GET", "/clientes/ativos");

  if (createdIds.cliente) {
    await test("Buscar cliente por ID", "GET", `/clientes/${createdIds.cliente}`);
    await test("Atualizar cliente", "PATCH", `/clientes/${createdIds.cliente}`, { nome_fantasia: "Smoke Updated" });
    await test("Buscar por CNPJ", "GET", `/clientes/by-cnpj/${encodeURIComponent("99.999.999/0001-99")}`);
  }

  // ───── FUNCIONÁRIOS ─────
  console.log("\n── Funcionários ──");
  const funcBody = {
    nome: "Smoke Test Func",
    cpf: "999.888.777-66",
    cargo: "Testador",
    matricula: "SMOKE-001",
    email: "smoke-func@test.com",
  };

  const { data: createdFunc } = await test("Criar funcionário", "POST", "/funcionarios", funcBody);
  if (createdFunc?.id) createdIds.funcionario = createdFunc.id;

  await test("Listar funcionários", "GET", "/funcionarios");
  await test("Listar funcionários (paginado)", "GET", "/funcionarios?skip=0&take=5");
  await test("Funcionários ativos", "GET", "/funcionarios/ativos");

  if (createdIds.funcionario) {
    await test("Buscar funcionário por ID", "GET", `/funcionarios/${createdIds.funcionario}`);
    await test("Atualizar funcionário", "PATCH", `/funcionarios/${createdIds.funcionario}`, { cargo: "Testador Sr." });
  }

  // ───── EQUIPAMENTOS ─────
  console.log("\n── Equipamentos ──");

  // Precisamos de uma categoria para criar equipamento
  const { data: equipList } = await test("Listar equipamentos", "GET", "/equipamentos");
  await test("Listar equipamentos (paginado)", "GET", "/equipamentos?skip=0&take=5");
  await test("Equipamentos ativos", "GET", "/equipamentos/ativos");
  await test("Equipamentos por status", "GET", "/equipamentos/status/disponivel");

  if (equipList && Array.isArray(equipList) && equipList.length > 0) {
    createdIds.equipamento = equipList[0].id;
    await test("Buscar equipamento por ID", "GET", `/equipamentos/${createdIds.equipamento}`);
  }

  // ───── CONTRATOS ─────
  console.log("\n── Contratos ──");

  if (createdIds.cliente) {
    const contratoBody = {
      cliente_id: createdIds.cliente,
      numero: "CT-SMOKE-001",
      data_inicio: "2024-06-01",
      data_fim_previsto: "2024-12-31",
      local_servico: "Smoke Test Local",
      valor_total: 10000,
      status: "rascunho",
      descricao: "Contrato de smoke test",
    };

    const { data: createdContrato } = await test("Criar contrato", "POST", "/contratos", contratoBody);
    if (createdContrato?.id) createdIds.contrato = createdContrato.id;
  }

  await test("Listar contratos", "GET", "/contratos");
  await test("Listar contratos (paginado)", "GET", "/contratos?skip=0&take=5");
  await test("Contratos ativos", "GET", "/contratos/ativos");
  await test("Contratos por status", "GET", "/contratos/status/rascunho");
  await test("Contratos próx. vencimento", "GET", "/contratos/status/proximo-vencimento?dias=90");

  if (createdIds.contrato) {
    await test("Buscar contrato por ID", "GET", `/contratos/${createdIds.contrato}`);
    await test("Atualizar contrato", "PATCH", `/contratos/${createdIds.contrato}`, { descricao: "Smoke Updated" });
    if (createdIds.cliente) {
      await test("Contratos por cliente", "GET", `/contratos/cliente/${createdIds.cliente}`);
    }
  }

  // ───── DOCUMENTOS ─────
  console.log("\n── Documentos ──");

  const docBody: any = {
    tipo: "outro",
    nome_arquivo: "smoke-test.pdf",
    descricao: "Documento de teste",
    storage_path: "smoke/smoke-test.pdf",
  };
  if (createdIds.funcionario) docBody.funcionario_id = createdIds.funcionario;

  const { data: createdDoc } = await test("Criar documento", "POST", "/documentos", docBody);
  if (createdDoc?.id) createdIds.documento = createdDoc.id;

  await test("Listar documentos", "GET", "/documentos");
  await test("Listar documentos (paginado)", "GET", "/documentos?skip=0&take=5");
  await test("Documentos por tipo", "GET", "/documentos/type/outro");
  await test("Documentos vencidos", "GET", "/documentos/status/vencidos");
  await test("Documentos próx. vencimento", "GET", "/documentos/status/proximo-vencimento?dias=30");

  if (createdIds.funcionario) {
    await test("Documentos por funcionário", "GET", `/documentos/funcionario/${createdIds.funcionario}`);
  }
  if (createdIds.documento) {
    await test("Buscar documento por ID", "GET", `/documentos/${createdIds.documento}`);
    await test("Atualizar documento", "PATCH", `/documentos/${createdIds.documento}`, { descricao: "Smoke Updated" });
  }

  // ───── LIMPEZA (DELETE) ─────
  console.log("\n── Limpeza (DELETE) ──");
  if (createdIds.documento) {
    await test("Deletar documento", "DELETE", `/documentos/${createdIds.documento}`);
  }
  if (createdIds.contrato) {
    await test("Deletar contrato", "DELETE", `/contratos/${createdIds.contrato}`);
  }
  if (createdIds.funcionario) {
    await test("Deletar funcionário", "DELETE", `/funcionarios/${createdIds.funcionario}`);
  }
  if (createdIds.cliente) {
    await test("Deletar cliente", "DELETE", `/clientes/${createdIds.cliente}`);
  }

  // ───── RELATÓRIO ─────
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const total = results.length;
  const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / total);

  console.log("\n" + "═".repeat(70));
  console.log(`📊 RESULTADO: ${passed}/${total} passaram | ${failed} falharam | média ${avgMs}ms`);
  console.log("═".repeat(70));

  if (failed > 0) {
    console.log("\n❌ Endpoints com falha:");
    results
      .filter((r) => !r.ok)
      .forEach((r) => {
        console.log(`   ${r.method} ${r.path} → ${r.status || "NETWORK ERROR"}`);
        if (r.error) console.log(`     ${r.error.slice(0, 120)}`);
      });
  }

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

main();
