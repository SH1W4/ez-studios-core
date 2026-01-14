/**
 * Adaptador Roblox Oficial Holístico (v1.5)
 * Gera código Luau para Mapas, Atores e Itens procedurais
 */

import { IEngineAdapter, RobloxAdapterOptions } from "./index";
import { ProceduralEntity, MapaGerado, ActorInstance, ItemInstance, MarketplaceMetadata } from "../core/models/types";

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

    private applyArtisticFinalization(instanceName: string, metadados: MarketplaceMetadata): string {
        const estetica = metadados.estetica || "Quantum";
        let script = "";

        if (estetica === "Quantum") {
            script += `    ${instanceName}.Material = Enum.Material.Neon\n`;
            script += `    local light = Instance.new("PointLight", ${instanceName})\n`;
            script += `    light.Color = ${instanceName}.Color\n`;
            script += `    light.Range = 10\n`;
        } else if (estetica === "Cybernetic") {
            script += `    ${instanceName}.Material = Enum.Material.Metal\n`;
            script += `    ${instanceName}.Reflectance = 0.5\n`;
            script += `    local selection = Instance.new("SelectionBox", ${instanceName})\n`;
            script += `    selection.Adornee = ${instanceName}\n`;
            script += `    selection.Color3 = Color3.fromRGB(0, 255, 255)\n`;
        } else if (estetica === "Realistic") {
            script += `    ${instanceName}.Material = Enum.Material.Pebble\n`;
        } else if (estetica === "LowPoly") {
            script += `    ${instanceName}.Material = Enum.Material.SmoothPlastic\n`;
        }

        return script;
    }

    private generateItemCode(item: ItemInstance, opt: Required<RobloxAdapterOptions>): string {
        const behaviorScript = this.getItemBehaviorTemplate(item);
        const estetica = item.metadados.estetica || "Quantum";

        return `-- EZ STUDIOS - Item Factory (v2.2.0 - Art Finalized)
-- ID: ${item.id} | Raridade: ${item.raridade} | Estética: ${estetica} | Hash: ${item.metadados.hashGeracao}

local ItemFactory = {}

function ItemFactory.Create()
    local tool = Instance.new("Tool")
    tool.Name = "${item.tipo.toUpperCase()}_${item.id}"
    tool.RequiresHandle = true
    
    local handle = Instance.new("Part", tool)
    handle.Name = "Handle"
    handle.Size = Vector3.new(1, 0.5, 4)
    handle.Color = Color3.fromHSV(math.random(), 0.8, 1)
    
    -- Aplicar Finalização Artística
${this.applyArtisticFinalization("handle", item.metadados)}
    
    -- Injetar Stats no Tool
    local stats = Instance.new("Configuration", tool)
    stats.Name = "Attributes"
    
    ${Object.entries(item.stats).map(([k, v]) => `local val_${k} = Instance.new("NumberValue", stats); val_${k}.Name = "${k}"; val_${k}.Value = ${v}`).join("\n    ")}
    
    -- Injetar Script de Comportamento Procedural
    local script = Instance.new("Script", tool)
    script.Name = "BehaviorScript"
    script.Source = [[
${behaviorScript}
    ]]
    
    print("[EZ Studios] Item ${item.id} finalizado com estética ${estetica}.")
    return tool
end

return ItemFactory.Create()
`;
    }

    private getItemBehaviorTemplate(item: ItemInstance): string {
        const tipo = item.tipo.toLowerCase();
        if (tipo.includes("espada") || tipo.includes("sword") || tipo.includes("weapon")) {
            return `local tool = script.Parent
local stats = tool:WaitForChild("Attributes")
local damage = stats:WaitForChild("dano").Value

tool.Activated:Connect(function()
    print("[EZ] Usando arma: " .. tool.Name)
    local character = tool.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    
    -- Lógica de Dano Proximidade (Exemplo)
    local handle = tool:FindFirstChild("Handle")
    handle.Touched:Connect(function(hit)
        local enemy = hit.Parent:FindFirstChild("Humanoid")
        if enemy and enemy ~= humanoid then
            enemy:TakeDamage(damage)
            print("[EZ] Dano causado: " .. damage)
        end
    end)
    task.wait(0.5)
end)`;
        }

        if (tipo.includes("pocao") || tipo.includes("potion") || tipo.includes("cura")) {
            return `local tool = script.Parent
local stats = tool:WaitForChild("Attributes")

tool.Activated:Connect(function()
    local character = tool.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    if humanoid then
        local healAmount = stats:FindFirstChild("cura") and stats.cura.Value or 20
        humanoid.Health = math.min(humanoid.MaxHealth, humanoid.Health + healAmount)
        print("[EZ] Jogador curado em: " .. healAmount)
        tool:Destroy()
    end
end)`;
        }

        return `-- Comportamento Padrão
script.Parent.Equipped:Connect(function()
    print("[EZ] Item equipado: " .. script.Parent.Name)
end)`;
    }

    private generateActorCode(actor: ActorInstance, opt: Required<RobloxAdapterOptions>): string {
        const aiScript = this.getActorAITemplate(actor);
        const estetica = actor.metadados.estetica || "Quantum";

        return `-- EZ STUDIOS - Actor Engine (v2.2.0 - Art Finalized)
-- ID: ${actor.id} | Nome: ${actor.nome} | Hash: ${actor.metadados.hashGeracao}

local ActorEngine = {}

function ActorEngine.Spawn(position)
    local npc = Instance.new("Model")
    npc.Name = "${actor.nome}"
    
    local hum = Instance.new("Humanoid", npc)
    local hrp = Instance.new("Part", npc)
    hrp.Name = "HumanoidRootPart"
    hrp.Position = position
    hrp.Size = Vector3.new(2, 2, 1)
    hrp.Parent = npc
    hrp.Color = Color3.fromRGB(0, 150, 255)
    
    -- Aplicar Estética ao NPC
${this.applyArtisticFinalization("hrp", actor.metadados)}
    
    -- Configurar IA
    local config = Instance.new("Configuration", npc)
    config.Name = "AI_Config"
    
    local behavior = Instance.new("StringValue", config)
    behavior.Name = "Behavior"
    behavior.Value = "${actor.IA.comportamento}"
    
    -- Injetar Cérebro (Script de IA)
    local brain = Instance.new("Script", npc)
    brain.Name = "AICore"
    brain.Source = [[
${aiScript}
    ]]
    
    print("[EZ Studios] Ator ${actor.nome} spawnado com estética ${estetica}.")
    return npc
end

return ActorEngine
`;
    }

    private getActorAITemplate(actor: ActorInstance): string {
        const behavior = actor.IA.comportamento.toLowerCase();

        if (behavior.includes("follow") || behavior.includes("persegue")) {
            return `local npc = script.Parent
local humanoid = npc:WaitForChild("Humanoid")
local root = npc:WaitForChild("HumanoidRootPart")

task.spawn(function()
    while task.wait(1) do
        local players = game.Players:GetPlayers()
        if #players > 0 then
            local target = players[1].Character
            if target and target:FindFirstChild("HumanoidRootPart") then
                humanoid:MoveTo(target.HumanoidRootPart.Position)
            end
        end
    end
end)`;
        }

        if (behavior.includes("dialog") || behavior.includes("npc")) {
            return `local npc = script.Parent
local root = npc:WaitForChild("HumanoidRootPart")

local prompt = Instance.new("ProximityPrompt", root)
prompt.ActionText = "Conversar"
prompt.ObjectText = npc.Name

prompt.Triggered:Connect(function(player)
    print("[EZ Agent] Olá " .. player.Name .. "! Eu sou um NPC gerado proceduralmente.")
end)`;
        }

        return `-- IA Estática
print("[EZ] NPC " .. script.Parent.Name .. " inicializado em modo passivo.")`;
    }

    getBuildStats(entidade: ProceduralEntity) {
        return {
            engine: this.engineName,
            id: entidade.id,
            hash: entidade.metadados.hashGeracao,
            estetica: entidade.metadados.estetica || "Padrão"
        };
    }
}
