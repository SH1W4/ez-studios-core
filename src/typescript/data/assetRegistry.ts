export interface AssetBehavior {
    /**
     * Código Lua para Roblox
     */
    roblox?: string;
    /**
     * Código C# para Unity
     */
    unity?: string;
    /**
     * Código GDScript para Godot
     */
    godot?: string;
}

export interface AssetDefinition {
    id: string;
    category: "Item" | "Actor" | "Mapa";
    tags: string[];
    /**
     * IDs de assets reais na loja da engine (opcional)
     */
    modelIds?: {
        roblox?: string; // rbxassetid://...
        unity?: string;
    };
    /**
     * Comportamento programável poliglota
     */
    behavior: AssetBehavior;
    /**
     * Configuração de fallback procedural (se não houver modelId)
     */
    fallbackConfig: {
        color: string; // Hex ou RGB string
        size: [number, number, number];
        shape: "Box" | "Sphere" | "Cylinder" | "Mesh";
    };
}

/**
 * Registro central de Assets Procedurais
 */
export const ASSET_REGISTRY: AssetDefinition[] = [
    {
        id: "sword_fire",
        category: "Item",
        tags: ["espada", "fogo", "weapon", "melee"],
        behavior: {
            roblox: `local tool = script.Parent
local stats = tool:WaitForChild("Attributes")
local damage = stats:FindFirstChild("dano") and stats.dano.Value or 10

tool.Activated:Connect(function()
    print("[EZ] Espada de Fogo ativada!")
    local anim = Instance.new("Animation")
    anim.AnimationId = "rbxassetid://0" -- Placeholder
    local track = tool.Parent:FindFirstChild("Humanoid"):LoadAnimation(anim)
    track:Play()
    
    -- Partículas de Fogo
    local fire = Instance.new("Fire", tool.Handle)
    task.wait(1)
    fire:Destroy()
end)`,
            unity: `using UnityEngine;
public class FireSword : MonoBehaviour {
    public float damage = 10f;
    void OnActivate() {
        Debug.Log("[EZ] Fire Sword Activated!");
        // Unity specific logic
    }
}`,
        },
        fallbackConfig: {
            color: "#FF4500",
            size: [0.5, 4, 0.5],
            shape: "Box"
        }
    },
    {
        id: "potion_heal",
        category: "Item",
        tags: ["pocao", "cura", "health", "consumivel"],
        behavior: {
            roblox: `local tool = script.Parent
tool.Activated:Connect(function()
    local char = tool.Parent
    local hum = char:FindFirstChild("Humanoid")
    if hum then
        hum.Health = hum.Health + 50
        print("[EZ] Poção consumida. +50 HP")
        tool:Destroy()
    end
end)`
        },
        fallbackConfig: {
            color: "#00FF00",
            size: [1, 1, 1],
            shape: "Cylinder"
        }
    },
    {
        id: "npc_guard",
        category: "Actor",
        tags: ["npc", "guard", "soldado"],
        behavior: {
            roblox: `local npc = script.Parent
local hum = npc:WaitForChild("Humanoid")
local root = npc:WaitForChild("HumanoidRootPart")

while true do
    task.wait(math.random(2,5))
    local target = Vector3.new(math.random(-10,10), 0, math.random(-10,10)) + root.Position
    hum:MoveTo(target)
end`
        },
        fallbackConfig: {
            color: "#0000FF",
            size: [2, 5, 2],
            shape: "Box"
        }
    },
    {
        id: "npc_zombie",
        category: "Actor",
        tags: ["npc", "monstro", "zombie", "agressivo"],
        behavior: {
            roblox: `local npc = script.Parent
local hum = npc:WaitForChild("Humanoid")

while task.wait(0.5) do
    local players = game.Players:GetPlayers()
    for _, p in pairs(players) do
        if p.Character and (p.Character.PrimaryPart.Position - npc.PrimaryPart.Position).Magnitude < 20 then
            hum:MoveTo(p.Character.PrimaryPart.Position)
        end
    end
end`
        },
        fallbackConfig: {
            color: "#005500",
            size: [2, 5, 2],
            shape: "Box"
        }
    }
];

export function resolveAssetBehavior(category: string, tags: string[], engine: "roblox" | "unity" | "godot"): string {
    // Simple heuristic: Find first asset that matches category and at least one tag
    const asset = ASSET_REGISTRY.find(a =>
        a.category === category &&
        a.tags.some(t => tags.map(x => x.toLowerCase()).includes(t.toLowerCase())) &&
        a.behavior[engine] // Must have behavior for target engine
    );

    if (asset && asset.behavior[engine]) {
        return asset.behavior[engine]!;
    }

    return getDefaultBehavior(category, engine);
}

function getDefaultBehavior(category: string, engine: string): string {
    if (engine === "roblox") {
        return `-- Comportamento Genérico para ${category}
print("[EZ] Entidade Genérica Inicializada")`;
    }
    return "// Generic Behavior";
}
