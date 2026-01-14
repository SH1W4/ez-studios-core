# Holistic Generation Framework (PEG)
> **Procedural Experience Generation** | Entropia Zero v1.5 Specification

## 🌌 Visão Geral

O **Holistic Generation Framework** (HGF) estende a capacidade do motor EZ Studios para além do espaço geográfico. Ele permite a criação de universos coerentes onde Personagens, Itens e Desafios compartilham o mesmo DNA matemático dos mundos onde residem.

## 🏗️ Pilares do Framework

### 1. Actor Engine (Anatomia Procedural)
NPCs e Criaturas são montados via **WFC Anatômico**.
- **Slots**: Cabeça, Tronco, Membros, Intelecto.
- **DNA**: Uma string de sementes (seeds) que define o colapso de cada módulo.
- **Consistência**: Garante que o comportamento (IA) seja compatível com a forma física.

### 2. Item Factory (Loot & Economia)
Itens são gerados através de **Subdivisão de Atributos (Stat-BSP)**.
- **Budget de Poder**: O valor total de um item é particionado entre dano, defesa, utilidade e estética.
- **Procedência**: Cada item carrega o ID da intenção que o gerou, criando linhagens de itens "lendários".

### 3. Experience Layer (Missões & Quests)
A "Intenção de Jogo" é traduzida em grafos de eventos.
- **Fluxo**: Desafio → Recompensa → Progressão.
- **Dificuldade Adaptativa**: A entropia da missão é ajustada em real-time baseada no log de performance do jogador.

## 💰 Marketplace & NFT Readiness

O HGF foi desenhado para economias digitais modernas:
- **Proof of Generation**: O metadado de colapso serve como prova de raridade.
- **Interoperabilidade**: Um item gerado no EZ Studios pode ser exportado para Roblox como um `Folder` de instâncias ou para a Web como metadados JSON para mintagem NFT.
- **Royalties Pedagógicos**: O sistema rastreia o autor da intenção original para distribuição de méritos.

---
**EZ Studios - Geração Total, Entropia Zero.**
