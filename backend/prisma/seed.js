"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Iniciando seed do banco de dados...\n");
    console.log("🗑️  Limpando dados antigos...");
    await prisma.operacoes.deleteMany();
    await prisma.pagamentos.deleteMany();
    await prisma.itens_contrato.deleteMany();
    await prisma.manutencoes.deleteMany();
    await prisma.documentos.deleteMany();
    await prisma.contratos.deleteMany();
    await prisma.funcionarios.deleteMany();
    await prisma.equipamentos.deleteMany();
    await prisma.categorias_equipamento.deleteMany();
    await prisma.profiles.deleteMany();
    console.log("👥 Buscando usuários existentes no auth.users...");
    const existingUsers = await prisma.users.findMany({
        orderBy: { created_at: "asc" },
        take: 3,
    });
    let adminId = null;
    let operadorId = null;
    let financeiroId = null;
    if (existingUsers.length > 0) {
        console.log(`   Encontrados ${existingUsers.length} usuário(s) em auth.users`);
        const profilesData = [
            { id: existingUsers[0].id, nome: "Helena Ribas", cargo: "admin", email: existingUsers[0].email || "helena@grmanager.com", telefone: "(11) 99876-5432" },
            ...(existingUsers[1] ? [{ id: existingUsers[1].id, nome: "João Silva", cargo: "operacional", email: existingUsers[1].email || "joao@grmanager.com", telefone: "(11) 98765-4321" }] : []),
            ...(existingUsers[2] ? [{ id: existingUsers[2].id, nome: "Maria Santos", cargo: "financeiro", email: existingUsers[2].email || "maria@grmanager.com", telefone: "(11) 97654-3210" }] : []),
        ];
        for (const p of profilesData) {
            await prisma.profiles.upsert({
                where: { id: p.id },
                update: { nome: p.nome, cargo: p.cargo, email: p.email, telefone: p.telefone, ativo: true },
                create: { id: p.id, nome: p.nome, cargo: p.cargo, email: p.email, telefone: p.telefone, ativo: true },
            });
        }
        adminId = existingUsers[0].id;
        operadorId = existingUsers[1]?.id ?? null;
        financeiroId = existingUsers[2]?.id ?? null;
        console.log(`   ✅ ${profilesData.length} profile(s) criados`);
    }
    else {
        console.log("   ⚠️  Nenhum usuário encontrado em auth.users. Profiles serão ignorados.");
        console.log("   Dica: crie usuários pelo Supabase Auth antes de rodar o seed.\n");
    }
    console.log("📂 Criando categorias de equipamento...");
    await prisma.categorias_equipamento.createMany({
        data: [
            { nome: "Guindaste", descricao: "Guinchos e guindastes de diversos tipos" },
            { nome: "Escavadeira", descricao: "Escavadeiras hidráulicas e pás carregadeiras" },
            { nome: "Compactador", descricao: "Rolos compactadores e sapatas vibratórias" },
            { nome: "Betoneira", descricao: "Betoneiras e bombas de concreto" },
            { nome: "Gerador", descricao: "Geradores de energia diesel e gasolina" },
        ],
    });
    const categorias = await prisma.categorias_equipamento.findMany({ orderBy: { nome: "asc" } });
    const catMap = {};
    for (const c of categorias)
        catMap[c.nome] = c.id;
    console.log("🏗️  Criando equipamentos...");
    const equipamentos = await Promise.all([
        prisma.equipamentos.create({
            data: {
                categoria_id: catMap["Guindaste"],
                nome: "Guindaste Torre GT200",
                modelo: "GT200",
                fabricante: "Liebherr",
                ano_fabricacao: 2020,
                numero_serie: "LH-GT200-001",
                placa: "GND-0001",
                capacidade_kg: new library_1.Decimal(20000),
                altura_max_metros: new library_1.Decimal(60),
                alcance_max_metros: new library_1.Decimal(40),
                valor_locacao_diaria: new library_1.Decimal(2500),
                status: "disponivel",
                observacoes: "Equipamento em perfeito estado de funcionamento",
            },
        }),
        prisma.equipamentos.create({
            data: {
                categoria_id: catMap["Escavadeira"],
                nome: "Escavadeira CAT 320",
                modelo: "CAT 320",
                fabricante: "Caterpillar",
                ano_fabricacao: 2019,
                numero_serie: "CAT-320-0015",
                placa: "ESC-0002",
                capacidade_kg: new library_1.Decimal(30000),
                altura_max_metros: new library_1.Decimal(3),
                alcance_max_metros: new library_1.Decimal(6),
                valor_locacao_diaria: new library_1.Decimal(1800),
                status: "disponivel",
                observacoes: "Revisão concluída em 2024",
            },
        }),
        prisma.equipamentos.create({
            data: {
                categoria_id: catMap["Compactador"],
                nome: "Rolo Compactador Dynapac CA30",
                modelo: "CA30",
                fabricante: "Dynapac",
                ano_fabricacao: 2018,
                numero_serie: "DYN-CA30-023",
                placa: "COM-0003",
                capacidade_kg: new library_1.Decimal(15000),
                valor_locacao_diaria: new library_1.Decimal(800),
                status: "locado",
                observacoes: "Em contrato até 15/04/2024",
            },
        }),
        prisma.equipamentos.create({
            data: {
                categoria_id: catMap["Betoneira"],
                nome: "Betoneira 400L",
                modelo: "MB400",
                fabricante: "Marcon",
                ano_fabricacao: 2021,
                numero_serie: "MRC-MB400-008",
                placa: "BET-0004",
                capacidade_kg: new library_1.Decimal(400),
                valor_locacao_diaria: new library_1.Decimal(250),
                status: "em_manutencao",
                observacoes: "Motor em reparo",
            },
        }),
        prisma.equipamentos.create({
            data: {
                categoria_id: catMap["Gerador"],
                nome: "Gerador Diesel 100kVA",
                modelo: "GD100",
                fabricante: "SDMO",
                ano_fabricacao: 2020,
                numero_serie: "SDM-GD100-045",
                placa: "GER-0005",
                capacidade_kg: new library_1.Decimal(800),
                valor_locacao_diaria: new library_1.Decimal(600),
                status: "disponivel",
            },
        }),
    ]);
    console.log("👔 Criando clientes...");
    const clientes = await Promise.all([
        prisma.clientes.create({
            data: {
                tipo: "pessoa_juridica",
                razao_social: "Construtora Silva & Cia Ltda",
                nome_fantasia: "Silva Construções",
                cnpj: "12.345.678/0001-90",
                email: "contato@silvaconst.com.br",
                telefone: "(11) 3456-7890",
                celular: "(11) 99876-5432",
                cep: "01310-100",
                logradouro: "Avenida Paulista",
                numero: "1000",
                bairro: "Bela Vista",
                cidade: "São Paulo",
                estado: "SP",
                observacoes: "Cliente de longa data, bom pagador",
            },
        }),
        prisma.clientes.create({
            data: {
                tipo: "pessoa_juridica",
                razao_social: "Obras Brasil Engenharia Ltda",
                nome_fantasia: "Obras Brasil",
                cnpj: "98.765.432/0001-12",
                email: "vendas@obrasbrasil.com.br",
                telefone: "(11) 2345-6789",
                celular: "(11) 98765-4321",
                cep: "05403-001",
                logradouro: "Avenida Faria Lima",
                numero: "2000",
                complemento: "Sala 500",
                bairro: "Pinheiros",
                cidade: "São Paulo",
                estado: "SP",
            },
        }),
        prisma.clientes.create({
            data: {
                tipo: "pessoa_fisica",
                nome_completo: "Pedro Oliveira Santos",
                cpf: "123.456.789-00",
                email: "pedro@example.com",
                telefone: "(11) 1234-5678",
                celular: "(11) 99876-1234",
                cep: "04543-051",
                logradouro: "Rua das Flores",
                numero: "456",
                bairro: "Vila Mariana",
                cidade: "São Paulo",
                estado: "SP",
                observacoes: "Cliente novo",
            },
        }),
    ]);
    console.log("👷 Criando funcionários...");
    const funcionarios = await Promise.all([
        prisma.funcionarios.create({
            data: {
                profile_id: operadorId,
                nome: "João Silva",
                cpf: "111.222.333-44",
                rg: "123456789",
                data_nascimento: new Date("1985-05-15"),
                cargo: "Operador de Guindaste",
                matricula: "FUNC-001",
                email: "joao@grmanager.com",
                telefone: "(11) 98765-4321",
                cep: "01310-100",
                logradouro: "Rua A",
                numero: "100",
                bairro: "Centro",
                cidade: "São Paulo",
                estado: "SP",
                cnh_numero: "987654321",
                cnh_categoria: "C",
                cnh_validade: new Date("2027-05-15"),
                data_admissao: new Date("2020-01-10"),
                observacoes: "Operador experiente com 15+ anos",
            },
        }),
        prisma.funcionarios.create({
            data: {
                nome: "Carlos Mendes",
                cpf: "222.333.444-55",
                rg: "234567890",
                data_nascimento: new Date("1990-08-22"),
                cargo: "Operador de Escavadeira",
                matricula: "FUNC-002",
                email: "carlos@grmanager.com",
                telefone: "(11) 97654-3210",
                cep: "04543-051",
                logradouro: "Rua B",
                numero: "200",
                bairro: "Vila Mariana",
                cidade: "São Paulo",
                estado: "SP",
                cnh_numero: "876543210",
                cnh_categoria: "C",
                cnh_validade: new Date("2026-08-22"),
                data_admissao: new Date("2021-06-15"),
            },
        }),
        prisma.funcionarios.create({
            data: {
                nome: "Roberto Pereira",
                cpf: "333.444.555-66",
                rg: "345678901",
                data_nascimento: new Date("1988-03-10"),
                cargo: "Técnico de Manutenção",
                matricula: "FUNC-003",
                email: "roberto@grmanager.com",
                telefone: "(11) 96543-2109",
                cep: "05403-001",
                logradouro: "Rua C",
                numero: "300",
                bairro: "Pinheiros",
                cidade: "São Paulo",
                estado: "SP",
                data_admissao: new Date("2019-09-01"),
                observacoes: "Técnico certificado",
            },
        }),
    ]);
    console.log("📋 Criando contratos...");
    const contratos = await Promise.all([
        prisma.contratos.create({
            data: {
                cliente_id: clientes[0].id,
                criado_por_id: adminId,
                numero: "CT-2024-001",
                data_inicio: new Date("2024-04-01"),
                data_fim_previsto: new Date("2024-06-30"),
                local_servico: "Obra Paulista - São Paulo",
                cep_servico: "01310-100",
                cidade_servico: "São Paulo",
                estado_servico: "SP",
                valor_total: new library_1.Decimal(150000),
                condicoes_pagamento: "50% na assinatura, 50% ao final",
                status: "em_execucao",
                descricao: "Locação de guindaste para obra residencial de 30 andares",
                observacoes: "Contrato com extensão possível de 3 meses",
            },
        }),
        prisma.contratos.create({
            data: {
                cliente_id: clientes[1].id,
                criado_por_id: adminId,
                numero: "CT-2024-002",
                data_inicio: new Date("2024-04-05"),
                data_fim_previsto: new Date("2024-05-05"),
                local_servico: "Obra Vila Mariana - São Paulo",
                cep_servico: "04543-051",
                cidade_servico: "São Paulo",
                estado_servico: "SP",
                valor_total: new library_1.Decimal(54000),
                condicoes_pagamento: "À vista",
                status: "aprovado",
                descricao: "Locação de escavadeira para terraplanagem",
            },
        }),
        prisma.contratos.create({
            data: {
                cliente_id: clientes[2].id,
                criado_por_id: adminId,
                numero: "CT-2024-003",
                data_inicio: new Date("2024-04-10"),
                data_fim_previsto: new Date("2024-04-20"),
                local_servico: "Construção Pinheiros",
                cep_servico: "05403-001",
                cidade_servico: "São Paulo",
                estado_servico: "SP",
                valor_total: new library_1.Decimal(7500),
                condicoes_pagamento: "Parcelado em 2x",
                status: "rascunho",
                descricao: "Locação de betoneira para pequena obra",
                observacoes: "Aguardando aprovação do cliente",
            },
        }),
    ]);
    console.log("🔧 Criando itens de contrato...");
    const itensContrato = await Promise.all([
        prisma.itens_contrato.create({
            data: {
                contrato_id: contratos[0].id,
                equipamento_id: equipamentos[0].id,
                operador_id: funcionarios[0].id,
                data_inicio: new Date("2024-04-01"),
                data_fim: new Date("2024-06-30"),
                quantidade_dias: 91,
                valor_diaria: new library_1.Decimal(2500),
                valor_total: new library_1.Decimal(227500),
                descricao: "Guindaste Torre GT200 com operador",
            },
        }),
        prisma.itens_contrato.create({
            data: {
                contrato_id: contratos[1].id,
                equipamento_id: equipamentos[1].id,
                operador_id: funcionarios[1].id,
                data_inicio: new Date("2024-04-05"),
                data_fim: new Date("2024-05-05"),
                quantidade_dias: 30,
                valor_diaria: new library_1.Decimal(1800),
                valor_total: new library_1.Decimal(54000),
                descricao: "Escavadeira CAT 320 com operador",
            },
        }),
    ]);
    console.log("📄 Criando documentos...");
    const documentos = await Promise.all([
        prisma.documentos.create({
            data: {
                contrato_id: contratos[0].id,
                cliente_id: clientes[0].id,
                tipo: "contrato",
                nome_arquivo: "CT-2024-001-assinado.pdf",
                descricao: "Contrato assinado e digitalizado",
                tamanho_bytes: BigInt(2500000),
                mime_type: "application/pdf",
                storage_path: "contratos/CT-2024-001-assinado.pdf",
                enviado_por_id: adminId,
            },
        }),
        prisma.documentos.create({
            data: {
                equipamento_id: equipamentos[0].id,
                tipo: "certificado",
                nome_arquivo: "Certificado-Guindaste-GT200.pdf",
                descricao: "Certificação de segurança do guindaste",
                tamanho_bytes: BigInt(1500000),
                mime_type: "application/pdf",
                storage_path: "certificados/Certificado-Guindaste-GT200.pdf",
                validade: new Date("2025-12-31"),
                enviado_por_id: adminId,
            },
        }),
        prisma.documentos.create({
            data: {
                funcionario_id: funcionarios[0].id,
                tipo: "cnh",
                nome_arquivo: "CNH-JoaoSilva.pdf",
                descricao: "Carteira Nacional de Habilitação",
                tamanho_bytes: BigInt(500000),
                mime_type: "application/pdf",
                storage_path: "funcionarios/CNH-JoaoSilva.pdf",
                validade: new Date("2027-05-15"),
                enviado_por_id: adminId,
            },
        }),
    ]);
    console.log("🔨 Criando manutenções...");
    const manutencoes = await Promise.all([
        prisma.manutencoes.create({
            data: {
                equipamento_id: equipamentos[3].id,
                responsavel_id: funcionarios[2].id,
                tipo: "corretiva",
                status: "em_andamento",
                data_agendada: new Date("2024-04-10"),
                data_inicio: new Date("2024-04-10T08:00:00Z"),
                descricao: "Reparo no motor diesel",
                servicos_realizados: "Troca de óleo, filtros e verificação de velas",
                custo_estimado: new library_1.Decimal(3500),
                prestador_nome: "Mecânica Silva Serviços",
                prestador_cnpj: "45.678.901/0001-23",
                observacoes: "Equipamento voltará ao operacional em 2 dias",
            },
        }),
        prisma.manutencoes.create({
            data: {
                equipamento_id: equipamentos[0].id,
                responsavel_id: funcionarios[2].id,
                tipo: "preventiva",
                status: "agendada",
                data_agendada: new Date("2024-05-15"),
                descricao: "Manutenção preventiva mensal",
                custo_estimado: new library_1.Decimal(5000),
            },
        }),
    ]);
    console.log("⚙️  Criando operações...");
    await prisma.operacoes.create({
        data: {
            contrato_id: contratos[0].id,
            item_contrato_id: itensContrato[0].id,
            operador_id: funcionarios[0].id,
            data_saida: new Date("2024-04-01T06:00:00Z"),
            local_servico: "Obra Paulista - São Paulo",
            horimetro_saida: new library_1.Decimal(1000),
            descricao: "Início da operação no canteiro",
            observacoes: "Equipamento posicionado corretamente",
        },
    });
    console.log("💰 Criando pagamentos...");
    const pagamentos = await Promise.all([
        prisma.pagamentos.create({
            data: {
                contrato_id: contratos[0].id,
                numero_parcela: 1,
                valor: new library_1.Decimal(75000),
                data_vencimento: new Date("2024-04-01"),
                data_pagamento: new Date("2024-03-30"),
                status: "pago",
                forma_pagamento: "Transferência Bancária",
                observacoes: "Recebido com 1 dia de antecedência",
            },
        }),
        prisma.pagamentos.create({
            data: {
                contrato_id: contratos[0].id,
                numero_parcela: 2,
                valor: new library_1.Decimal(75000),
                data_vencimento: new Date("2024-06-30"),
                status: "pendente",
                forma_pagamento: "Transferência Bancária",
            },
        }),
        prisma.pagamentos.create({
            data: {
                contrato_id: contratos[1].id,
                numero_parcela: 1,
                valor: new library_1.Decimal(54000),
                data_vencimento: new Date("2024-04-05"),
                status: "pendente",
                forma_pagamento: "À Vista",
            },
        }),
    ]);
    const profileCount = existingUsers.length > 0 ? Math.min(existingUsers.length, 3) : 0;
    console.log("\n✅ Seed concluído com sucesso!");
    console.log("📊 Resumo dos dados criados:");
    console.log(`  • Profiles:                ${profileCount}`);
    console.log(`  • Categorias de Equipamento: ${categorias.length}`);
    console.log(`  • Equipamentos:            ${equipamentos.length}`);
    console.log(`  • Clientes:                ${clientes.length}`);
    console.log(`  • Funcionários:            ${funcionarios.length}`);
    console.log(`  • Contratos:               ${contratos.length}`);
    console.log(`  • Itens de Contrato:       ${itensContrato.length}`);
    console.log(`  • Documentos:              ${documentos.length}`);
    console.log(`  • Manutenções:             ${manutencoes.length}`);
    console.log(`  • Operações:               1`);
    console.log(`  • Pagamentos:              ${pagamentos.length}`);
}
main()
    .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map