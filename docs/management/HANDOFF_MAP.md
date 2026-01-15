# EZ Studios Master Blueprint & Handoff Map (v2.4.0) 🗺️🛡️

Este documento serve como a "Ponte de Consciência" entre máquinas. Ele resume a arquitetura, o estado atual e a visão técnica do EZ Studios para que o desenvolvimento no **v15** continue sem atrito.

---

## 🏗️ Mapa da Arquitetura Holística

```mermaid
graph TD
    User[Usuário / Arquiteto] -->|Prompt Lang| UI[Editor UI & Dashboard]
    UI -->|Intent| IC[Intent Compiler AI-Powered]
    IC -->|Semantic Parse| LLM[LLM Adapter & DataStore]
    IC -->|Procedural Logic| Core[WFC / BSP Engines]
    Core -->|Asset Sync| Registry[Polyglot Asset Registry]
    Registry -->|Real IDs| Marketplace[Roblox Marketplace / Unity Store]
    Core -->|Code Gen| Adapters[Roblox/Unity Adapters]
    Adapters -->|Luau/C#| Final[Mundo / Item Gerado]

    %% Telemetria
    IC -->|Logs| Logger[Global Logger]
    Logger -->|Aggregation| Analytics[Analytics Engine]
    Analytics -->|Metrics| UI
    
    %% Camada de Agente
    AI[AI Agentes / Externo] -->|JSON-RPC| MCP[MCP Server]
    MCP --> IC
    MCP --> Registry
    MCP --> Analytics
```

---

## 🚀 Estado Atual: Consolidação v2.4.0
Acabamos de completar um ciclo massivo de evolução:

1.  **Cérebro (Brain)**: O [Intent Compiler](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/compiler/intentCompiler.ts) agora é assíncrono e integrado ao [LLMAdapter](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/compiler/llmAdapter.ts). Ele coleta dados de treino via [IntentDataStore](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/data/intentDataStore.ts).
2.  **Corpo (Body)**: Criamos o [Asset Registry](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/data/assetRegistry.ts) poliglota que sincroniza assets reais do Roblox (`rbxassetid`).
3.  **Córtex (Analytics)**: O [Analytics Engine](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/infra/logging/analyticsEngine.ts) agora rastreia **múltiplas fontes de receita** (Marketplace, Comissões, Premium) e calcula o ROI por hora.
4.  **Interface (UI)**: O [Dashboard](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/ui/Dashboard.tsx) possui um **Revenue Hub** e o [Editor](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/ui/Editor.tsx) possui feedback RLHF.
5.  **Ponte Agentica (Connectivity)**: O [MCP Server](file:///Users/jx/Desktop/ROBLOX_$$$/src/typescript/mcp/server.ts) está operacional, permitindo que IAs controlem a engine.

---

## 📂 Diretório de Poder (Arquivos Chave)

| Componente | Caminho | Função |
|------------|---------|--------|
| **AI Server** | `src/typescript/mcp/server.ts` | Porta de entrada para IAs Agentes. |
| **IA Compiler** | `src/typescript/compiler/intentCompiler.ts` | Coração da tradução Prompt -> Código. |
| **Analytics** | `src/typescript/infra/logging/analyticsEngine.ts` | Calculadora de XP, ROI e Receitas. |
| **Registry** | `src/typescript/data/assetRegistry.ts` | Catálogo de assets profissionais e comportamentos. |
| **Roblox** | `src/typescript/adapters/robloxAdapter.ts` | Gerador final de código Luau híbrido. |

---

## 🛠️ Tech Stack Atual
- **Linguagens**: TypeScript (Core), Luau (Roblox Output), JSONL (Dataset).
- **Frontend**: React 18, Vite, Framer Motion (Animações Premium), Lucide React.
- **Protocolos**: MCP (Model Context Protocol), Protocolo Entropia Zero (Design).
- **Gestão**: Git (Sincronização main branch), pnpm (Pacotes).

---

## ⏩ Próximos Passos (v15 e além)
1.  **Expansão Unity**: Implementar o `UnityAdapter` real seguindo o padrão do `RobloxAdapter`.
2.  **Fine-Tuning**: Usar o JSONL do `IntentDataStore` para treinar um modelo Gemma/Llama focado no EZ Studios.
3.  **App Mobile**: Começar o planejamento do app para tablets (Dashboard Parental).

---

## 📝 Instruções para a IA no v15
> *"Olá! Você está assumindo o projeto EZ Studios. O sistema está em um estado de v2.4.0 Consolidade. Leia o `HANDOFF_MAP.md` e o `walkthrough.md`. O servidor MCP (`pnpm mcp`) é sua ferramenta principal para interagir com a engine. Siga as fases descritas no `task.md`."* 🛡️🤖

**Finalizada a sessão por Antigravity.** 🛡️🌍💎
