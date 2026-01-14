# Scripts Directory Audit - EZ Studios v2.3.0

**Data:** 2026-01-14  
**Status:** ⚠️ DESATUALIZADO

---

## 📋 Inventário Atual

### Arquivos Existentes
- `setup_ez_studios.sh` (v3.0, Jan 10) - **OBSOLETO**
  - Estrutura de pastas antiga (engine/wfc, platform/frontend)
  - Não reflete arquitetura TypeScript atual
  - Referências a Python/Luau separados (não integrado)

---

## ❌ O Que Está Faltando

### 1. Scripts de Build & Deploy
- [ ] `build.sh` - Build production (TypeScript + Vite)
- [ ] `deploy.sh` - Deploy para Vercel/Netlify
- [ ] `test.sh` - Runner de testes consolidado

### 2. Scripts de Desenvolvimento
- [ ] `dev.sh` - Iniciar ambiente de desenvolvimento
- [ ] `lint-fix.sh` - Auto-fix de linting
- [ ] `typecheck.sh` - Verificação de tipos

### 3. Scripts de Dados
- [ ] `seed-registry.sh` - Popular AssetRegistry com dados de exemplo
- [ ] `export-lua.sh` - Exportar código Lua para Roblox Studio
- [ ] `validate-assets.sh` - Validar integridade do AssetRegistry

### 4. Scripts de CI/CD
- [ ] `ci-test.sh` - Script usado pelo GitHub Actions
- [ ] `pre-commit.sh` - Git hooks para validação

---

## ✅ O Que Deveria Ter (Baseado em v2.3.0)

### Arquitetura Atual (Real)
```
src/
├── typescript/
│   ├── core/          (WFC, BSP)
│   ├── compiler/      (Intent Compiler)
│   ├── data/          (AssetRegistry - NOVO v2.3)
│   ├── adapters/      (Roblox, Unity stubs)
│   ├── ui/            (Editor, Dashboard)
│   └── tests/
```

### Scripts Necessários
1. **`scripts/build-production.sh`**
   - `pnpm build`
   - Otimizações de bundle
   - Geração de sourcemaps

2. **`scripts/generate-demo-world.sh`**
   - Executar Intent Compiler com prompt exemplo
   - Exportar Lua para `dist/demo/`

3. **`scripts/update-version.sh`**
   - Atualizar package.json
   - Atualizar README.md
   - Git tag automático

4. **`scripts/validate-polyglot-registry.sh`**
   - Verificar que todos assets têm behavior.roblox
   - Validar sintaxe Lua/C#/GDScript

---

## 🎯 Recomendação

**Ação Imediata:**
1. Arquivar `setup_ez_studios.sh` → `scripts/legacy/`
2. Criar novos scripts alinhados com v2.3.0:
   - `build.sh`
   - `dev-all.sh` (inicia pnpm dev + abre browser)
   - `export-roblox.sh` (gera .lua de exemplo)

**Prioridade:**
- 🔴 Alta: `build.sh`, `dev-all.sh`
- 🟡 Média: `export-roblox.sh`, `validate-polyglot-registry.sh`
- 🟢 Baixa: Scripts de seed/demo

---

## 📊 Score de Completude

| Categoria | Planejado | Implementado | % |
|-----------|-----------|--------------|---|
| Build Scripts | 3 | 0 | 0% |
| Dev Scripts | 3 | 0 | 0% |
| Data Scripts | 3 | 0 | 0% |
| CI/CD Scripts | 2 | 0 | 0% |
| **TOTAL** | **11** | **0** | **0%** |

**Conclusão:** A pasta `scripts/` está **100% desatualizada** e não reflete a arquitetura v2.3.0 implementada.
