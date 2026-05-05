# Seed de Dados - GR Manager

Este documento descreve como usar o arquivo seed para popular o banco de dados com dados de exemplo.

## 📋 O que é incluído no Seed?

O arquivo `seed.ts` cria dados de exemplo em todas as tabelas do banco de dados:

### Dados Criados:

1. **Profiles (3)**
   - Helena Ribas (Admin)
   - João Silva (Operacional)
   - Maria Santos (Financeiro)

2. **Categorias de Equipamento (5)**
   - Guindaste
   - Escavadeira
   - Compactador
   - Betoneira
   - Gerador

3. **Equipamentos (5)**
   - Guindaste Torre GT200 (Disponível)
   - Escavadeira CAT 320 (Disponível)
   - Rolo Compactador Dynapac CA30 (Locado)
   - Betoneira 400L (Em Manutenção)
   - Gerador Diesel 100kVA (Disponível)

4. **Clientes (3)**
   - Construtora Silva & Cia Ltda (Pessoa Jurídica)
   - Obras Brasil Engenharia Ltda (Pessoa Jurídica)
   - Pedro Oliveira Santos (Pessoa Física)

5. **Funcionários (3)**
   - João Silva (Operador de Guindaste)
   - Carlos Mendes (Operador de Escavadeira)
   - Roberto Pereira (Técnico de Manutenção)

6. **Contratos (3)**
   - CT-2024-001 (Em Execução)
   - CT-2024-002 (Aprovado)
   - CT-2024-003 (Rascunho)

7. **Itens de Contrato (2)**
   - Guindaste para CT-2024-001
   - Escavadeira para CT-2024-002

8. **Documentos (3)**
   - Contrato assinado
   - Certificado de equipamento
   - CNH de funcionário

9. **Manutenções (2)**
   - Manutenção corretiva da Betoneira (Em andamento)
   - Manutenção preventiva do Guindaste (Agendada)

10. **Operações (1)**
    - Saída de equipamento para obra

11. **Pagamentos (3)**
    - 2 parcelas do CT-2024-001
    - 1 pagamento do CT-2024-002

## 🚀 Como usar

### Opção 1: Executar apenas o Seed
```bash
npm run prisma:seed
```

Este comando executa o seed sem resetar o banco de dados.

### Opção 2: Resetar e Semear (Recomendado para desenvolvimento)
```bash
npm run prisma:seed:reset
```

Este comando:
1. Reseta o banco de dados (DELETE de todos os dados)
2. Executa as migrations
3. Executa o seed

⚠️ **AVISO**: Este comando deleta TODOS os dados do banco de dados!

### Opção 3: Resetar migrations e Semear
```bash
prisma migrate reset
npm run prisma:seed
```

## 📊 Dados Realistas

Todos os dados criados são realistas e baseados em um cenário de aluguel de equipamentos:

- **Clientes reais**: Empresas de construção com informações válidas
- **Equipamentos**: Equipamentos reais de construção com especificações
- **Contratos**: Contratos com datas, valores e status variados
- **Funcionários**: Funcionários com documentação completa
- **Relacionamentos**: Todas as relações entre entidades estão corretamente configuradas

## 🔧 Personalizar o Seed

Para adicionar ou modificar dados de exemplo, edite o arquivo `prisma/seed.ts`:

```typescript
// Adicionar novo cliente
const novoCliente = await prisma.clientes.create({
  data: {
    tipo: "pessoa_juridica",
    razao_social: "Sua Empresa",
    // ... outros campos
  }
});
```

Após modificar, execute novamente:
```bash
npm run prisma:seed:reset
```

## 📝 Informações sobre as entidades

### Contratos
- **CT-2024-001**: Guindaste para obra grande (91 dias)
- **CT-2024-002**: Escavadeira para terraplanagem (30 dias)
- **CT-2024-003**: Betoneira para pequena obra (10 dias)

### Equipamentos
- Todos têm valores de locação diária realistas
- Especificações técnicas completas
- Status variados para testar filtros

### Funcionários
- Vinculados aos profiles do sistema
- CNH com datas de validade
- Cargo e especializações

## ⚠️ Observações Importantes

1. **Usuários de Autenticação**: O seed não cria usuários em `auth.users` (Supabase Auth). Você precisa criar usuários manualmente no Supabase ou usar a API de autenticação.

2. **UUID para Profiles**: Os profiles têm UUIDs fixos gerados que você pode usar para testar relacionamentos.

3. **Datas**: As datas são baseadas em 2024 e podem precisar ser atualizadas para manter dados relevantes.

4. **Validações**: O seed assume que o schema está correto. Se houver erros de constraints, verifique as migrations.

## 🐛 Troubleshooting

### Erro: "table "public.profiles" does not exist"
```bash
npm run prisma:push
npm run prisma:seed
```

### Erro: "Unique constraint failed"
Execute o reset completo:
```bash
npm run prisma:seed:reset
```

### Erro: "Role "postgres" does not exist"
Verifique sua `DATABASE_URL` no arquivo `.env`.

## 📚 Referências

- [Prisma Seeding](https://www.prisma.io/docs/orm/prisma-client/development-tools/seed)
- [Prisma Documentation](https://www.prisma.io/docs/)
