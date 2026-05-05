# 🚧 Projeto TCC - Sistema de Gestão de Guindastes Ribas

## 📌 1. Informações Gerais

**Nome do Projeto:** GR Manager (Guindastes Ribas Manager)

**Empresa:** Guindastes Ribas

**Contexto:**
Empresa familiar em fase de crescimento que realiza aluguel de guindastes, empilhadeiras e muncks para movimentação de cargas pesadas.

Atualmente:
- Gestão feita manualmente + Excel
- Alto risco de erro humano
- Falta de controle eficiente de documentos e vencimentos

**Problema Principal:**
Dificuldade em gerenciar:
- Funcionários
- Equipamentos
- Documentação (principalmente vencimentos)

**Objetivo do Sistema:**
Criar um ecossistema digital integrado para:
- Centralizar dados
- Automatizar notificações
- Melhorar rastreabilidade
- Reduzir erro operacional

**Divisão do Projeto:**
- 📱 App Mobile (Funcionários)
- 🌐 Plataforma Web (Administrativo)
- 🧠 Backend (Regras de negócio)
- 🗄️ Banco de Dados (Persistência e estrutura)

---

## 🧱 2. Stack Tecnológica

### Mobile
- Expo (React Native)
- TypeScript

### Frontend Web
- React
- TypeScript
- TailwindCSS

### Backend
- Node.js
- NestJS

### Banco de Dados
- Supabase (PostgreSQL + Auth + Storage)

---

## 🎨 3. Identidade Visual

**Objetivo Visual:**
Transmitir:
- Força (maquinário pesado)
- Segurança (operações críticas)
- Profissionalismo (empresa confiável)

### Paleta de Cores

- **Primária:** #0F172A (Azul escuro - robustez)
- **Secundária:** #F59E0B (Amarelo industrial - atenção)
- **Destaque:** #22C55E (Verde - status válido / ok)
- **Alerta:** #EF4444 (Vermelho - vencido / problema)
- **Fundo:** #F8FAFC (Cinza claro neutro)

### Tipografia
- Principal: Inter
- Alternativa: Poppins

### Estilo
- Minimalista
- Interfaces limpas
- Uso forte de cores para status (não depender de texto)

---

## 🧭 4. Arquitetura do Sistema

### Mobile (Funcionário)
Foco:
- Simplicidade
- Acesso rápido

Funcionalidades:
- Login
- Visualização de documentos pessoais
- Visualização de documentos de equipamentos vinculados
- Status de validade

---

### Web (Administrativo)
Foco:
- Gestão completa
- Monitoramento

Funcionalidades:
- CRUD de:
  - Funcionários
  - Equipamentos
  - Clientes
  - Contratos
- Controle de documentos
- Dashboard de vencimentos
- Sistema de notificações (email)
- Relatórios

---

### Backend
Responsável por:
- Autenticação
- Regras de negócio
- Agendamento de notificações
- Integração com banco

---

### Banco de Dados
Responsável por:
- Estrutura relacional
- Controle de documentos e vencimentos
- Relacionamento entre entidades

---

## 🗂️ 5. Modelagem Inicial (Entidades)

- users
- employees
- equipments
- documents
- document_types
- contracts
- clients
- notifications
- logs

---

## ✅ 6. TODO List (Roadmap Inicial)

### 🧩 Geral
- [ ] Criar repositório (monorepo recomendado)
- [ ] Definir padrão de commits (conventional commits)
- [ ] Configurar ESLint + Prettier
- [ ] Definir estrutura de pastas

---

### ⚙️ Backend (NestJS)
- [ ] Criar projeto NestJS
- [ ] Configurar conexão com Supabase
- [ ] Estruturar módulos base:
  - Auth
  - Users
  - Employees
  - Equipments
  - Documents
- [ ] Implementar autenticação (JWT)
- [ ] Criar CRUD básico inicial
- [ ] Criar sistema de agendamento (cron jobs)
- [ ] Implementar envio de emails (notificações)

---

### 🌐 Frontend Web
- [ ] Criar projeto React + TS + Tailwind
- [ ] Gerar base inicial com Lovable (prompt estruturado)
- [ ] Criar layout base:
  - Sidebar
  - Header
- [ ] Implementar autenticação
- [ ] Criar dashboard inicial
- [ ] Criar telas:
  - Funcionários
  - Equipamentos
  - Documentos
- [ ] Sistema de alertas visuais (cores + badges)

---

### 📱 Mobile (Expo)
- [ ] Criar projeto Expo
- [ ] Estruturar navegação
- [ ] Criar mockups:
  - Tela de Login
  - Tela Home (documentos)
- [ ] Implementar autenticação
- [ ] Integração com backend
- [ ] Listagem de documentos
- [ ] Visualização de status

---

### 🗄️ Banco de Dados (Supabase)
- [ ] Modelagem completa das tabelas
- [ ] Criar tabelas no Supabase
- [ ] Definir relacionamentos (FKs)
- [ ] Criar políticas de segurança (RLS)
- [ ] Definir estrutura de documentos (storage)
- [ ] Seed inicial para testes

---

## 🔔 7. Sistema de Notificações

**Objetivo:**
Evitar vencimentos não percebidos

**Regras:**
- Notificar:
  - 30 dias antes
  - 15 dias antes
  - 7 dias antes
  - 1 dia antes
- Envio por email
- Registro de envio no banco

---

## 📊 8. Relatórios (Futuro Próximo)

- Documentos vencidos
- Documentos próximos do vencimento
- Histórico de equipamentos
- Funcionários irregulares

---

## 🧠 9. Princípios do Projeto

- Simplicidade > Complexidade
- Clareza > Quantidade de features
- Automação > Trabalho manual
- Interface intuitiva sempre

---

## 🚀 10. Próximo Passo Imediato

1. Criar repositório
2. Subir backend (Nest)
3. Modelar banco
4. Gerar base do frontend