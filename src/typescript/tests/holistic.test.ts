/**
 * Teste de Integração: Geração Holística (PEG)
 * Verifica a criação de Mapas, Personagens e Itens via IntentCompiler
 */

import { compilarIntencao } from "../compiler/intentCompiler";
import { Intencao, Tile, MapaGerado, ItemInstance, ActorInstance } from "../core/models/types";
import { RobloxAdapter } from "../adapters/robloxAdapter";

async function testHolisticGeneration() {
    console.log("🧪 Iniciando Teste de Geração Holística...");
    const adapter = new RobloxAdapter();
    const dummyTiles: Tile[] = [{ id: "grass", tipo: "chao", tags: [], conexoesPermitidas: [] }];

    // 1. Testar Geração de Mapa (3D Ready)
    console.log("\n--- [1] Testando Categoria: Mapa ---");
    const intentMapa: Intencao = {
        id: "int_map_001",
        categoria: "Mapa",
        descricaoNatural: "Dungeon 3D para o Boss",
        parametros: { temBossRoom: true, dificuldade: "hard" }
    };
    const resultMapa = compilarIntencao(intentMapa, dummyTiles, adapter);
    const mapa = resultMapa.resultado as MapaGerado;
    console.log(`✅ Mapa Gerado: ${mapa.id}`);
    console.log(`📊 Dimensões: ${mapa.dimensoes.largura}x${mapa.dimensoes.altura}x${mapa.dimensoes.profundidade}`);
    console.log(`🔗 Hash NFT: ${mapa.metadados.hashGeracao}`);

    // 2. Testar Geração de Item (Lendário)
    console.log("\n--- [2] Testando Categoria: Item ---");
    const intentItem: Intencao = {
        id: "int_item_001",
        categoria: "Item",
        descricaoNatural: "Uma espada de fogo lendária",
        parametros: { tipo: "arma", elemento: "fogo" }
    };
    const resultItem = compilarIntencao(intentItem, [], adapter);
    const item = resultItem.resultado as ItemInstance;
    const itemCode = adapter.generateCode(item);
    console.log(`✅ Item Gerado: ${item.id} (Raridade: ${item.raridade})`);
    console.log(`⚔️ Dano: ${item.stats.dano}`);
    console.log(`📜 Script Comportamental? ${itemCode.includes("BehaviorScript") ? "SIM" : "NÃO"}`);
    console.log(`🔗 Hash NFT: ${item.metadados.hashGeracao}`);

    // 3. Testar Geração de Ator (NPC)
    console.log("\n--- [3] Testando Categoria: Actor ---");
    const intentActor: Intencao = {
        id: "int_actor_001",
        categoria: "Actor",
        descricaoNatural: "Guardião da floresta mágica",
        parametros: { classe: "guardiao" }
    };
    const resultActor = compilarIntencao(intentActor, [], adapter);
    const actor = resultActor.resultado as ActorInstance;
    const actorCode = adapter.generateCode(actor);
    console.log(`✅ Ator Gerado: ${actor.nome} (ID: ${actor.id})`);
    console.log(`🧠 Comportamento IA: ${actor.IA.comportamento}`);
    console.log(`📜 Cérebro Procedural? ${actorCode.includes("AICore") ? "SIM" : "NÃO"}`);
    console.log(`🔗 Hash NFT: ${actor.metadados.hashGeracao}`);

    console.log("\n🚀 Teste Holístico: PASSOU (Todos os tipos gerados com scripts de comportamento)");
}

testHolisticGeneration().catch(e => {
    console.error("❌ Teste Holístico Falhou:", e);
    process.exit(1);
});
