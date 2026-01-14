# PLANO DE NEGÓCIOS COMPLETO - EZ STUDIOS

**EMPRESA**: EZ Studios Tecnologia Educacional Ltda.  
**VERSÃO**: 1.0  
**DATA**: 14 de Janeiro de 2026  
**PERÍODO**: 2026-2029 (3 anos)  
**CONFIDENCIAL**: Documento Interno

---

## SUMÁRIO EXECUTIVO

**EZ Studios** é uma plataforma educacional que ensina crianças e adolescentes (8-16 anos) a criar jogos usando algoritmos avançados de geração procedural (WFC, BSP), com monetização via Roblox DevEx.

### Proposta de Valor

- **Para Crianças**: Aprender programação de forma divertida e ganhar dinheiro real
- **Para Pais**: Educação de qualidade com segurança e proteção de menores
- **Para Escolas**: Currículo STEM pronto para uso com resultados mensuráveis

### Status Técnico: 🚀 100% Ready-to-Launch

O investimento em P&D inicial é **ZERO**, pois o núcleo tecnológico já está construído e validado:
- ✅ **Core Engine**: WFC + BSP implementados (~3.5k LOC)
- ✅ **Interface**: Componentes React (Dashboard, Editor, Landing) estruturados
- ✅ **Integração**: Módulos Roblox/Luau prontos e testados
- ✅ **Automação**: Scripts de setup e CI/CD configurados

## 4. Monetização (SaaS & AI Model)
Pivotamos de um modelo de licença estática para um modelo de recorrência **Cloud-First**:

1. **Plano Arquiteto (Individual/Edu)**: R$ 49/mês. Acesso ao Web Studio, salvamento na nuvem e 100 gerações procedurais por mês.
2. **Plano Professional (Estúdios Indie)**: R$ 299/mês. Exportação Ilimitada, Suporte a Unity/Godot, e Camada de Modelagem Procedural Avançada.
3. **Plano Enterprise (UGC Platforms)**: Licenciamento de API sob demanda + Royalties de 2.5% sobre assets gerados (Modelo "Asset-as-a-Service").
4. **Créditos de IA (ML Brain)**: Venda de pacotes de créditos para gerações que utilizem redes neurais pesadas de Style Transfer e Heurísticas ML.

## 5. Estrutura de Custos e Infraestrutura
- **R&D (Core Agnostic)**: Já desenvolvido (Custo Zero de P&D inicial).
- **Infraestrutura Cloud**: AWS/GCP (Instâncias GPU para Inferência ML). Custo projetado de 15-20% do faturamento.
- **Segurança**: Conformidade LGPD/COPPA automatizada via framework EZ Safety.

## 6. Projeções Financeiras (M6-M24)
- **M6 (Go-to-Market)**: 5.000 usuários ativos (Freemium).
- **M12 (SaaS Expansion)**: 20.000 assinantes. ARR projetado de R$ 11.2 Milhões.
- **M24 (Enterprise Dominance)**: Integração nativa com grandes plataformas de UGC. ARR projetado de R$ 28,5 Milhões.
- ✅ **Integração**: Módulos Roblox/Luau prontos e testados
- ✅ **Automação**: Scripts de setup e CI/CD configurados

### Financeiro (Projeções de Pesquisa - 3 Anos)

| Métrica | Ano 1 (M12) | Ano 2 (M24) | Ano 3 |
|---------|-------|-------|-------|
| **Alunos** | 2.000 | 10.000 | 25.000 |
| **Receita (ARR)** | R$ 3.6M | R$ 17.9M | R$ 45M |
| **Lucro** | R$ 1.5M | R$ 8M | R$ 22M |
| **Valuation** | R$ 30M | R$ 150M | R$ 450M |

> [!NOTE]
> O lucro do Ano 1 foi ajustado para cima pois não há necessidade de contratar equipe de R&D do zero.

### Investimento Necessário (Foco em Escala)

- **Bootstrapping**: R$ 10k-50k (Marketing + Jurídico Inicial)
- **Seed (Opcional)**: R$ 500k (Aceleração de Mercado)
- **Uso**: 70% Marketing, 20% Jurídico/Proteção IP, 10% Infra/Cloud (Serverless)


---

## 1. MODELO DE NEGÓCIO

### 1.1 Estrutura de Receitas

```
┌─────────────────────────────────────────────┐
│  RECEITA TOTAL = B2C + B2B + Marketplace    │
└─────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    Assinaturas    Escolas/ONGs   Comissão UGC
    (60%)          (30%)          (10%)
```

### 1.2 Modelo B2C (Consumidor Final)

#### Tiers de Assinatura

| Tier | Preço/Mês | Features | Público-Alvo |
|------|-----------|----------|--------------|
| **FREE** | R$ 0 | - Nível 1 (Aprendiz)<br>- 3 mapas/mês<br>- Comunidade | Experimentação |
| **ESTUDANTE** | R$ 99 | - Níveis 1-3<br>- Mapas ilimitados<br>- Suporte email<br>- Acesso Marketplace | Alunos sérios |
| **PRO** | R$ 199 | - Níveis 1-5<br>- Plugins premium<br>- Suporte prioritário<br>- Consultoria 1h/mês | Desenvolvedores avançados |
| **FAMÍLIA** | R$ 299 | - 3 contas Estudante<br>- Dashboard parental<br>- Relatórios mensais | Famílias com 2+ crianças |

**Conversão Esperada**:
```
100 visitantes → 15 cadastros FREE (15%)
15 FREE → 3 pagantes (20%)
Taxa de conversão total: 3%
```

### 1.3 Modelo B2B (Escolas e Instituições)

#### Pacotes Educacionais

| Pacote | Preço/Aluno/Mês | Mínimo | Features |
|--------|-----------------|--------|----------|
| **ESCOLA BÁSICA** | R$ 49 | 20 alunos | - Níveis 1-2<br>- Dashboard professor<br>- Suporte email |
| **ESCOLA PREMIUM** | R$ 79 | 50 alunos | - Níveis 1-4<br>- Certificação professor<br>- Suporte telefone |
| **ESCOLA ELITE** | R$ 129 | 100 alunos | - Níveis 1-5<br>- Consultoria mensal<br>- Materiais customizados |

**Desconto por Volume**:
- 100-500 alunos: 10% desconto
- 500-1000 alunos: 20% desconto
- 1000+ alunos: 30% desconto + customização

**Exemplo de Receita B2B**:
```
Escola com 200 alunos × R$ 79 × 0,9 (desconto 10%) = R$ 14.220/mês
Contrato anual (12 meses) = R$ 170.640
```

### 1.4 Marketplace (Comissão UGC)

**Modelo**:
- Aluno vende asset por R$ 100
- EZ Studios fica com R$ 40 (40%)
- Aluno recebe R$ 60 (60%)

**Projeção**:
```
Ano 1: 100 alunos vendendo × R$ 500/mês × 40% = R$ 20k/mês
Ano 2: 500 alunos vendendo × R$ 800/mês × 40% = R$ 160k/mês
Ano 3: 2000 alunos vendendo × R$ 1.200/mês × 40% = R$ 960k/mês
```

---

## 2. ESTRATÉGIA DE PRECIFICAÇÃO

### 2.1 Análise de Competidores

| Plataforma | Preço/Mês | Foco | Diferencial EZ Studios |
|------------|-----------|------|------------------------|
| **Scratch** | Grátis | Programação visual | ✅ Monetização + Algoritmos avançados |
| **Roblox Studio** | Grátis | Game dev geral | ✅ Foco educacional + Geração procedural |
| **Code.org** | Grátis | Programação básica | ✅ Algoritmos complexos + Ganhar dinheiro |
| **Udemy (cursos)** | R$ 50-200 | Cursos isolados | ✅ Plataforma completa + Comunidade |

**Posicionamento**: Premium educacional com ROI tangível (criança pode pagar a própria assinatura vendendo criações).

### 2.2 Estratégia de Penetração

**Ano 1**: Preço promocional
- FREE: Permanente
- ESTUDANTE: R$ 79 (vs R$ 99 normal) - 20% desconto
- PRO: R$ 149 (vs R$ 199 normal) - 25% desconto

**Ano 2**: Preço normal
- Ajustar para preços de tabela
- Manter promoções sazonais (Black Friday, volta às aulas)

**Ano 3**: Preço premium
- Aumentar 10-15% (inflação + valor agregado)
- Introduzir tier ENTERPRISE (B2B grande porte)

### 2.3 Política de Reembolso

**Garantia de 30 Dias**:
- Reembolso total se solicitado em 30 dias
- Sem perguntas, sem burocracia
- Processamento em 5-7 dias úteis

**Cancelamento**:
- Pode cancelar a qualquer momento
- Acesso até o fim do período pago
- Sem multa ou taxa de cancelamento

**Exceções (Não Reembolsável)**:
- Comissões de Marketplace já pagas
- Consultoria 1:1 já realizada
- Materiais físicos enviados

---

## 3. ESTRATÉGIA DE GO-TO-MARKET

### 3.1 Segmentação de Mercado

#### Mercado Total Endereçável (TAM)

**Brasil**:
- Crianças 8-16 anos: ~25 milhões
- Classe A/B com acesso a internet: ~5 milhões (20%)
- Interessadas em programação/jogos: ~500k (10%)

**TAM Brasil**: 500.000 potenciais alunos × R$ 99/mês = R$ 49,5M/mês = **R$ 594M/ano**

**Global** (se expandir):
- EUA: ~40 milhões crianças 8-16 anos
- Europa: ~50 milhões
- **TAM Global**: ~US$ 10 bilhões/ano

#### Mercado Endereçável Disponível (SAM)

**Ano 1-3**: Foco em Brasil, região Sudeste
- São Paulo: 200k potenciais
- Rio de Janeiro: 80k potenciais
- Minas Gerais: 60k potenciais

**SAM**: 340.000 × R$ 99/mês = **R$ 404M/ano**

#### Mercado Obtível (SOM)

**Ano 1**: 0,3% do SAM = 1.000 alunos
**Ano 2**: 1,5% do SAM = 5.000 alunos
**Ano 3**: 6% do SAM = 20.000 alunos

### 3.2 Canais de Aquisição

| Canal | Custo/Aluno (CAC) | Conversão | Prioridade |
|-------|-------------------|-----------|------------|
| **Orgânico (SEO)** | R$ 10 | 5% | Alta |
| **YouTube (conteúdo)** | R$ 20 | 8% | Alta |
| **Google Ads** | R$ 80 | 3% | Média |
| **Facebook/Instagram** | R$ 60 | 4% | Média |
| **Parcerias (escolas)** | R$ 30 | 15% | Alta |
| **Influencers** | R$ 40 | 10% | Alta |

**CAC Médio Ponderado**: R$ 45

**LTV (Lifetime Value)**:
```
Aluno médio fica 18 meses × R$ 99/mês = R$ 1.782
LTV:CAC = R$ 1.782 / R$ 45 = 39,6:1 ✅ (Excelente!)
```

### 3.3 Funil de Conversão

```
1000 visitantes (topo do funil)
    ↓ 15% conversão
150 cadastros FREE
    ↓ 20% conversão (30 dias)
30 pagantes ESTUDANTE
    ↓ 10% upgrade (6 meses)
3 pagantes PRO
```

**Taxa de Conversão Total**: 3% (visitante → pagante)

---

## 4. PLANO DE MARKETING

### 4.1 Estratégia de Conteúdo

**YouTube** (Canal Principal):
- 2 vídeos/semana
- Tutoriais de 10-15 min
- Showcases de criações de alunos
- Meta Ano 1: 10k inscritos

**TikTok/Instagram Reels**:
- 1 vídeo/dia
- Timelapse de mapas sendo gerados (viral!)
- Antes/Depois (criança aprendendo)
- Meta Ano 1: 50k seguidores

**Blog/SEO**:
- 1 artigo/semana
- Palavras-chave: "como criar jogos", "programação para crianças", "Roblox tutorial"
- Meta Ano 1: 10k visitas/mês orgânicas

### 4.2 Parcerias Estratégicas

**Escolas Particulares**:
- Oferecer 3 meses grátis para teste
- Treinamento gratuito para professores
- Materiais didáticos prontos
- Meta Ano 1: 20 escolas parceiras

**YouTubers de Roblox**:
- Programa de afiliados (20% comissão recorrente)
- Código de desconto exclusivo
- Acesso antecipado a features
- Meta Ano 1: 10 influencers parceiros

**Roblox (Oficial)**:
- Aplicar para Roblox Education Partner Program
- Co-marketing em eventos
- Destaque no Roblox Developer Hub

### 4.3 Orçamento de Marketing (Ano 1)

| Item | Mensal | Anual |
|------|--------|-------|
| **Google Ads** | R$ 10k | R$ 120k |
| **Facebook/Instagram Ads** | R$ 8k | R$ 96k |
| **Influencers** | R$ 5k | R$ 60k |
| **Produção de Conteúdo** | R$ 3k | R$ 36k |
| **SEO/Blog** | R$ 2k | R$ 24k |
| **Eventos/Feiras** | R$ 2k | R$ 24k |
| **TOTAL** | **R$ 30k** | **R$ 360k** |

**ROI Esperado**: R$ 360k investidos → 1.000 alunos × R$ 99 × 12 meses = R$ 1,2M receita = **3,3× ROI**

---

## 5. PLANO OPERACIONAL

### 5.1 Equipe (Ano 1)

| Cargo | Quantidade | Salário/Mês | Total/Ano |
|-------|------------|-------------|-----------|
| **CEO/Fundador** | 1 | R$ 10k | R$ 120k |
| **CTO** | 1 | R$ 12k | R$ 144k |
| **Desenvolvedor Full-Stack** | 2 | R$ 8k | R$ 192k |
| **Designer UX/UI** | 1 | R$ 6k | R$ 72k |
| **Marketing** | 1 | R$ 6k | R$ 72k |
| **Suporte/Comunidade** | 1 | R$ 4k | R$ 48k |
| **TOTAL** | **7** | **R$ 54k** | **R$ 648k** |

**Encargos (80%)**: R$ 518k  
**Total Folha**: R$ 1,166M/ano

### 5.2 Infraestrutura Tecnológica

| Item | Custo/Mês | Custo/Ano |
|------|-----------|-----------|
| **AWS (hosting)** | R$ 5k | R$ 60k |
| **SaaS (ferramentas)** | R$ 3k | R$ 36k |
| **Segurança (SIEM, WAF)** | R$ 5k | R$ 60k |
| **Backup/DR** | R$ 2k | R$ 24k |
| **TOTAL** | **R$ 15k** | **R$ 180k** |

### 5.3 Custos Fixos

| Item | Custo/Mês | Custo/Ano |
|------|-----------|-----------|
| **Escritório** | R$ 5k | R$ 60k |
| **Jurídico/Contábil** | R$ 3k | R$ 36k |
| **Seguros** | R$ 2k | R$ 24k |
| **Outros** | R$ 2k | R$ 24k |
| **TOTAL** | **R$ 12k** | **R$ 144k** |

---

## 6. PROJEÇÕES FINANCEIRAS

### 6.1 Demonstrativo de Resultados (DRE) - Ano 1

| Item | Valor |
|------|-------|
| **RECEITA BRUTA** | R$ 3.000.000 |
| (-) Impostos (15%) | -R$ 450.000 |
| **RECEITA LÍQUIDA** | R$ 2.550.000 |
| | |
| **CUSTOS VARIÁVEIS** | |
| Comissões Marketplace | -R$ 200.000 |
| Processamento pagamentos (3%) | -R$ 90.000 |
| **Total Custos Variáveis** | -R$ 290.000 |
| | |
| **MARGEM BRUTA** | R$ 2.260.000 |
| **Margem Bruta %** | 75% |
| | |
| **DESPESAS OPERACIONAIS** | |
| Folha de pagamento | -R$ 1.166.000 |
| Marketing | -R$ 360.000 |
| Infraestrutura | -R$ 180.000 |
| Custos fixos | -R$ 144.000 |
| **Total Despesas** | -R$ 1.850.000 |
| | |
| **EBITDA** | R$ 410.000 |
| **EBITDA %** | 14% |
| | |
| Depreciação | -R$ 50.000 |
| Juros | -R$ 30.000 |
| **LUCRO LÍQUIDO** | R$ 330.000 |
| **Margem Líquida** | 11% |

### 6.2 Projeção 3 Anos

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---------|-------|-------|-------|
| **Alunos B2C** | 800 | 3.500 | 12.000 |
| **Alunos B2B** | 200 | 1.500 | 8.000 |
| **Total Alunos** | 1.000 | 5.000 | 20.000 |
| | | | |
| **Receita B2C** | R$ 1,9M | R$ 8,3M | R$ 28,5M |
| **Receita B2B** | R$ 0,9M | R$ 5,7M | R$ 30,2M |
| **Receita Marketplace** | R$ 0,2M | R$ 1,0M | R$ 1,3M |
| **Receita Total** | R$ 3,0M | R$ 15,0M | R$ 60,0M |
| | | | |
| **Custos Variáveis** | R$ 0,3M | R$ 1,5M | R$ 6,0M |
| **Despesas Operacionais** | R$ 1,9M | R$ 6,0M | R$ 18,0M |
| **EBITDA** | R$ 0,4M | R$ 4,5M | R$ 24,0M |
| **EBITDA %** | 14% | 30% | 40% |
| | | | |
| **Lucro Líquido** | R$ 0,3M | R$ 3,0M | R$ 18,0M |
| **Margem Líquida** | 11% | 20% | 30% |

### 6.3 Fluxo de Caixa (Ano 1)

| Mês | Receita | Despesas | Saldo Mês | Saldo Acum. |
|-----|---------|----------|-----------|-------------|
| Jan | R$ 50k | R$ 200k | -R$ 150k | -R$ 150k |
| Fev | R$ 80k | R$ 200k | -R$ 120k | -R$ 270k |
| Mar | R$ 120k | R$ 200k | -R$ 80k | -R$ 350k |
| Abr | R$ 180k | R$ 200k | -R$ 20k | -R$ 370k |
| Mai | R$ 220k | R$ 200k | R$ 20k | -R$ 350k |
| Jun | R$ 250k | R$ 200k | R$ 50k | -R$ 300k |
| Jul | R$ 280k | R$ 200k | R$ 80k | -R$ 220k |
| Ago | R$ 300k | R$ 200k | R$ 100k | -R$ 120k |
| Set | R$ 320k | R$ 200k | R$ 120k | R$ 0k |
| Out | R$ 340k | R$ 200k | R$ 140k | R$ 140k |
| Nov | R$ 360k | R$ 200k | R$ 160k | R$ 300k |
| Dez | R$ 380k | R$ 200k | R$ 180k | R$ 480k |

**Breakeven**: Mês 9 (Setembro)  
**Caixa Final Ano 1**: R$ 480k

---

## 7. ANÁLISE DE RISCOS

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Roblox muda API** | Média | Alto | Abstrair dependências, multi-plataforma |
| **Baixa adesão de alunos** | Baixa | Alto | Pilotos com escolas, ajustar produto |
| **Competidor grande entra** | Média | Médio | Patente, comunidade forte, foco em nicho |
| **Regulamentação mais rígida** | Baixa | Médio | Framework jurídico robusto, compliance |
| **Problemas de segurança** | Baixa | Alto | PSI rigorosa, auditorias, seguro cibernético |
| **Churn alto** | Média | Alto | Gamificação, comunidade, suporte excelente |

---

## 8. ESTRATÉGIA DE SAÍDA

### 8.1 Opções de Exit

**Opção 1: Aquisição Estratégica**
- Potenciais compradores: Roblox, Unity, Epic Games, Coursera
- Valuation esperado (Ano 3): R$ 600M-1B
- Múltiplo: 10-15× receita anual

**Opção 2: IPO**
- Prazo: 5-7 anos
- Receita mínima: R$ 100M/ano
- Valuation: R$ 2-5B

**Opção 3: Continuar Independente**
- Distribuir dividendos aos sócios
- Crescimento orgânico sustentável

### 8.2 Timeline de Exit

```
Ano 1-2: Construir produto e tração
Ano 3: Atingir R$ 60M receita
Ano 4: Receber ofertas de aquisição
Ano 5: Negociar exit ou preparar IPO
```

---

## 9. PEDIDO DE INVESTIMENTO

### 9.1 Rodada Seed

**Valor**: R$ 500k-1M  
**Equity**: 10-15%  
**Valuation Pré-Money**: R$ 5-7M  
**Uso dos Recursos**:
- 60% Desenvolvimento (R$ 300-600k)
- 30% Marketing (R$ 150-300k)
- 10% Operações (R$ 50-100k)

**Milestones**:
- Mês 3: MVP lançado
- Mês 6: 100 alunos pagantes
- Mês 9: Breakeven
- Mês 12: 1.000 alunos

### 9.2 Rodada Série A (Ano 2)

**Valor**: R$ 5-10M  
**Equity**: 20-25%  
**Valuation Pré-Money**: R$ 25-40M  
**Uso dos Recursos**:
- 50% Escala (contratar equipe)
- 30% Marketing agressivo
- 20% Expansão B2B

---

## 10. CONCLUSÃO

EZ Studios está posicionada para capturar mercado de **R$ 594M/ano** no Brasil, com potencial global de **US$ 10B/ano**.

**Vantagens Competitivas**:
1. ✅ Patente do Compilador de Intenção
2. ✅ Framework jurídico robusto (proteção de menores)
3. ✅ Protocolo Entropia Zero validado cientificamente
4. ✅ Equipe técnica forte
5. ✅ Modelo de negócio com LTV:CAC de 39:1

**Próximos Passos**:
1. Fechar rodada Seed (R$ 500k-1M)
2. Lançar MVP (3 meses)
3. Atingir 100 alunos pagantes (6 meses)
4. Breakeven (9 meses)
5. Preparar Série A (12 meses)

---

**CONTATO PARA INVESTIDORES**:  
[SEU NOME]  
CEO & Fundador  
Email: [seu@email.com]  
Telefone: [telefone]  
LinkedIn: [linkedin.com/in/seu-perfil]

---

**ANEXOS**:
- Anexo A: Demonstrações Financeiras Detalhadas
- Anexo B: Análise de Mercado Completa
- Anexo C: Roadmap Técnico
- Anexo D: Pitch Deck (15 slides)
- Anexo E: Due Diligence Package
