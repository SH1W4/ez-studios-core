/**
 * Teste de Integração: Geração Holística (PEG)
 * Verifica a criação de Mapas, Personagens e Itens via IntentCompiler
 */

import { describe, it, expect } from "vitest";
import { compilarIntencao } from "../compiler/intentCompiler";
import { Intencao, Tile, MapaGerado, ItemInstance, ActorInstance } from "../core/models/types";
import { RobloxAdapter } from "../adapters/robloxAdapter";

describe("Teste de Geração Holística", () => {
    const adapter = new RobloxAdapter();
    const dummyTiles: Tile[] = [{ id: "grass", tipo: "chao", tags: [], conexoesPermitidas: [] }];

    it("deve gerar um Mapa 3D completo", () => {
        const intentMapa: Intencao = {
            id: "int_map_001",
            categoria: "Mapa",
            descricaoNatural: "Dungeon 3D para o Boss",
            parametros: { temBossRoom: true, dificuldade: "hard" }
        };
        const resultMapa = compilarIntencao(intentMapa, dummyTiles, adapter);
        const mapa = resultMapa.resultado as MapaGerado;

        expect(mapa.id).toBeDefined();
        expect(mapa.dimensoes.largura).toBeGreaterThan(0);
        expect(mapa.dimensoes.profundidade).toBeGreaterThan(0);
        expect(mapa.metadados.hashGeracao).toBeDefined();
    });

    it("deve gerar um Item Lendário com script", () => {
        const intentItem: Intencao = {
            id: "int_item_001",
            categoria: "Item",
            descricaoNatural: "Uma espada de fogo lendária",
            parametros: { tipo: "arma", elemento: "fogo" }
        };
        const resultItem = compilarIntencao(intentItem, [], adapter);
        const item = resultItem.resultado as ItemInstance;
        const itemCode = adapter.generateCode(item);

        expect(item.id).toBeDefined();
        expect(item.raridade).toBeDefined();
        expect(item.stats.dano).toBeGreaterThan(0);
        expect(itemCode).toContain("BehaviorScript");
        expect(item.metadados.hashGeracao).toBeDefined();
    });

    it("deve gerar um Ator (NPC) com IA", () => {
        const intentActor: Intencao = {
            id: "int_actor_001",
            categoria: "Actor",
            descricaoNatural: "Guardião da floresta mágica",
            parametros: { classe: "guardiao" }
        };
        const resultActor = compilarIntencao(intentActor, [], adapter);
        const actor = resultActor.resultado as ActorInstance;
        const actorCode = adapter.generateCode(actor);

        expect(actor.nome).toBeDefined();
        expect(actor.id).toBeDefined();
        expect(actor.IA.comportamento).toBeDefined();
        expect(actorCode).toContain("AICore");
        expect(actor.metadados.hashGeracao).toBeDefined();
    });
});
