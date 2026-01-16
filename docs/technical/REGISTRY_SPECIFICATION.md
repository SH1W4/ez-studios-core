# 🏷️ Polyglot Registry Specification | Especificação do Registro Poliglota

[**Português**](#%EF%B8%8F-portugu%C3%AAs-o-padr%C3%A3o-dos-ativos) | [**English**](#%EF%B8%8F-english-the-asset-standard)

---

## 🇺🇸 English: The Asset Standard

### 1. Purpose
The **Polyglot Asset Registry v2.5.0** defines how static assets and algorithmic templates are unified into a single searchable source of truth for the **Intent Compiler**.

### 2. Asset Schema
Every asset must provide a `manifest.json` with the following:
- **Semantic Concepts**: An array of language-agnostic concepts (e.g., `["fire", "elemental", "heat"]`).
- **Concept Mapping**: (Legacy/Fallback) Bilingual keys (e.g., `{"pt": "Fogo", "en": "Fire"}`).
- **Template Logic**: Path to the platform-specific implementation (e.g., `.lua` for Roblox).
- **Constraint Rules**: Adjacency and compatibility data for the WFC engine.

### 3. Registry Flow
1. **Registration**: Asset is uploaded to the `/src/data/` or `/assets/` directory.
2. **Indexing**: The `AssetRegistry` indexes the semantic keys.
3. **Synthesis**: The `IntentCompiler` fetches the asset based on the natural language trigger.

---

## 🇧🇷 Português: O Padrão dos Ativos

### 1. Objetivo
O **Registro de Assets Poliglota v2.5.0** define como assets estáticos e templates algorítmicos são unificados em uma fonte única e pesquisável de verdade para o **Compilador de Intenção**.

### 2. Esquema de Ativos (Schema)
Cada asset deve fornecer um `manifest.json` contendo:
- **Conceitos Semânticos**: Um array de conceitos agnósticos à língua (ex: `["fire", "elemental", "heat"]`).
- **Mapeamento de Conceitos**: (Legado/Fallback) Chaves bilíngues (ex: `{"pt": "Fogo", "en": "Fire"}`).
- **Lógica de Template**: Caminho para a implementação específica da plataforma (ex: `.lua` para Roblox).
- **Regras de Restrição**: Dados de adjacência e compatibilidade para o motor de WFC.

### 3. Fluxo do Registro
1. **Registro**: O asset é carregado no diretório `/src/data/` ou `/assets/`.
2. **Indexação**: O `AssetRegistry` indexa as chaves semânticas.
3. **Síntese**: O `Compilador de Intenção` busca o asset com base no gatilho de linguagem natural.
