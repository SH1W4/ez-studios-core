/**
 * Adaptador Roblox Oficial Holístico (v1.5)
 * Gera código Luau para Mapas, Atores e Itens procedurais
 */

import { IEngineAdapter, RobloxAdapterOptions } from "./index";
import { ProceduralEntity, MapaGerado, ActorInstance, ItemInstance } from "../core/models/types";

export class RobloxAdapter implements IEngineAdapter {
    readonly engineName = "Roblox";
    readonly fileExtension = "lua";

    private defaults: Required<RobloxAdapterOptions> = {
        maxParts: 10000,
        blockSize: 4,
        baseFolderName: "EZ_Holistic_Entity",
        colorScheme: {
            chao_1: "Color3.fromRGB(120, 120, 120)",
            parede_1: "Color3.fromRGB(60, 60, 60)",
            porta_1: "Color3.fromRGB(139, 69, 19)",
            spawn: "Color3.fromRGB(0, 255, 0)",
            boss: "Color3.fromRGB(255, 0, 0)",
            loja: "Color3.fromRGB(0, 0, 255)",
        },
    };

    generateCode(entidade: ProceduralEntity, options?: RobloxAdapterOptions): string {
        const opt = { ...this.defaults, ...options };

        if ("tiles" in entidade) {
            return this.generateMapCode(entidade as MapaGerado, opt);
        } else if ("raridade" in entidade) {
            return this.generateItemCode(entidade as ItemInstance, opt);
        } else if ("IA" in entidade) {
            return this.generateActorCode(entidade as ActorInstance, opt);
        }

        throw new Error("Tipo de entidade procedural não suportado pelo adaptador Roblox.");
    }

    private generateMapCode(mapa: MapaGerado, opt: Required<RobloxAdapterOptions>): string {
        const numTiles = mapa.tiles.length;
        let script = `-- EZ STUDIOS - Mapa Volumétrico 3D
-- ID: ${mapa.id} | Hash: ${mapa.metadados.hashGeracao}

local MapBuilder = {}
local BLOCK_SIZE = ${opt.blockSize}
local FLOOR_HEIGHT = ${opt.blockSize}

function MapBuilder.CreateTile(parent, tileId, x, y, z)
    local part = Instance.new("Part")
    part.Size = Vector3.new(BLOCK_SIZE, string.find(tileId, "parede") and FLOOR_HEIGHT or 1, BLOCK_SIZE)
    part.Position = Vector3.new(x * BLOCK_SIZE, (z * FLOOR_HEIGHT) + (part.Size.Y / 2), y * BLOCK_SIZE)
    part.Anchored = true
    part.Parent = parent
    return part
end

function MapBuilder.Build(workspace)
    local folder = Instance.new("Folder", workspace)
    folder.Name = "Map_" .. "${mapa.id}"
`;

        const batchSize = 100;
        for (let i = 0; i < mapa.tiles.length; i += batchSize) {
            const batch = mapa.tiles.slice(i, i + batchSize);
            for (const tile of batch) {
                script += `    MapBuilder.CreateTile(folder, "${tile.tileId}", ${tile.x}, ${tile.y}, ${tile.z})\n`;
            }
            script += `    task.wait(0.01)\n`;
        }

        script += `    return folder\nend\nMapBuilder.Build(workspace)\nreturn MapBuilder`;
        return script;
    }

    private generateItemCode(item: ItemInstance, opt: Required<RobloxAdapterOptions>): string {
        return `-- EZ STUDIOS - Item Factory
-- ID: ${item.id} | Raridade: ${item.raridade} | Hash: ${item.metadados.hashGeracao}

local ItemFactory = {}

function ItemFactory.Create()
    local tool = Instance.new("Tool")
    tool.Name = "${item.tipo.toUpperCase()}_${item.id}"
    
    local handle = Instance.new("Part", tool)
    handle.Name = "Handle"
    handle.Size = Vector3.new(1, 1, 4)
    
    -- Injetar Stats no Tool
    local stats = Instance.new("Configuration", tool)
    stats.Name = "Attributes"
    
    ${Object.entries(item.stats).map(([k, v]) => `local val_${k} = Instance.new("NumberValue", stats); val_${k}.Name = "${k}"; val_${k}.Value = ${v}`).join("\n    ")}
    
    print("[EZ Studios] Item ${item.id} instanciado com sucesso.")
    return tool
end

return ItemFactory.Create()
`;
    }

    private generateActorCode(actor: ActorInstance, opt: Required<RobloxAdapterOptions>): string {
        return `-- EZ STUDIOS - Actor Engine
-- ID: ${actor.id} | Nome: ${actor.nome} | Hash: ${actor.metadados.hashGeracao}

local ActorEngine = {}

function ActorEngine.Spawn(position)
    local npc = Instance.new("Model")
    npc.Name = "${actor.nome}"
    
    local hum = Instance.new("Humanoid", npc)
    local hrp = Instance.new("Part", npc)
    hrp.Name = "HumanoidRootPart"
    hrp.Position = position
    
    -- Configurar IA
    local config = Instance.new("Configuration", npc)
    config.Name = "AI_Config"
    
    local behavior = Instance.new("StringValue", config)
    behavior.Name = "Behavior"
    behavior.Value = "${actor.IA.comportamento}"
    
    print("[EZ Studios] Ator ${actor.nome} spawnado.")
    return npc
end

return ActorEngine
`;
    }

    getBuildStats(entidade: ProceduralEntity) {
        return {
            engine: this.engineName,
            id: entidade.id,
            hash: entidade.metadados.hashGeracao
        };
    }
}
