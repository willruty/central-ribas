# CLAUDE.md — guindates-ribas

## External Context & Knowledge Base

**Vault path:** `/media/william/HD Interno/development/second-brain/`

Este vault é um wiki Obsidian mantido pelo próprio agente do second-brain. Antes de qualquer implementação, você deve navegar por ele para extrair o contexto relevante.

---

## Protocolo obrigatório de consulta

Toda vez que o usuário solicitar a criação de componentes, regras de negócio, definições de UI/UX, arquitetura, ou qualquer implementação não trivial, siga esta sequência **antes de escrever código**:

### Passo 1 — Ler o índice mestre

```
/media/william/HD Interno/development/second-brain/index.md
```

O `index.md` é o catálogo completo do vault. Use-o para identificar quais páginas são relevantes para o prompt recebido. Cada entrada tem uma descrição de uma linha que indica o escopo do arquivo.

### Passo 2 — Determinar as páginas a ler

Com base no `index.md`, priorize os arquivos nesta ordem:

| Tipo de solicitação | Onde buscar primeiro |
|---------------------|----------------------|
| Entidade do projeto (stack, status, decisões) | `wiki/entities/guindastes-ribas.md` |
| Regras de UX, comportamento de interface | `wiki/concepts/laws-of-ux.md` → arquivos individuais em `raw/` (ex: `hicks-law.md`, `cognitive-load.md`) |
| Modelagem de dados, banco, migrations | `wiki/sources/2026-04-06-modelagem-db-locacao.md` → `wiki/sources/2026-04-01-modelagem-monorepo-guindastes.md` |
| Padrões de alertas e vencimento de documentos | `wiki/concepts/document-expiration-monitoring.md` |
| Status operacional e TODOs do projeto | `wiki/projects/` (buscar arquivo correspondente ao projeto) |

### Passo 3 — Ler os arquivos identificados

Use o tool de leitura de arquivo para abrir cada página relevante. Não presuma o conteúdo — leia de fato.

### Passo 4 — Implementar com o contexto absorvido

Somente após os passos anteriores, proponha código ou alterações, alinhando cada decisão ao que foi encontrado no vault.

---

## Estrutura do vault (referência rápida)

```
second-brain/
├── index.md                  ← Catálogo completo. SEMPRE leia primeiro.
├── wiki/
│   ├── overview.md           ← Visão geral de todos os projetos e domínios
│   ├── entities/             ← Projetos, pessoas, organizações (ex: guindastes-ribas.md)
│   ├── concepts/             ← Padrões reutilizáveis, design, UX (ex: laws-of-ux.md)
│   ├── sources/              ← Resumos de sessões anteriores com Claude
│   └── projects/             ← Status operacional e TODOs por projeto
└── raw/                      ← Notas brutas e artigos clippados
    ├── ui_blueprint.md       ← Design system (tokens, componentes, tipografia)
    ├── laws-of-ux-index.md   ← Índice das 30 leis de UX
    ├── project_map.md        ← Mapa técnico dos projetos
    └── [lei-individual].md   ← Ex: hicks-law.md, cognitive-load.md, chunking.md
```

---

## Regra de ouro

> O vault é a fonte de verdade para convenções, decisões de design e contexto de negócio deste projeto. O código local implementa o que o vault define. Se houver conflito entre uma suposição sua e algo escrito no vault, o vault prevalece.
