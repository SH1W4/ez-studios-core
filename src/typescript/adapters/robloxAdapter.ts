/**
 * Adaptador Roblox Oficial 3D (Evolução Entropia Zero)
 * Gera código Luau otimizado para construções volumétricas e multi-andares
 */

import { IEngineAdapter, RobloxAdapterOptions } from "./index";
import { MapaGerado } from "../core/models/types";

export class RobloxAdapter implements IEngineAdapter {
    readonly engineName = "Roblox";
    readonly fileExtension = "lua";

    private defaults: Required<RobloxAdapterOptions> = {
        maxParts: 10000,
        blockSize: 4,
        baseFolderName: "EZ_Volumetric_Map",
        colorScheme: {
            chao_1: "Color3.fromRGB(120, 120, 120)",
            parede_1: "Color3.fromRGB(60, 60, 60)",
            porta_1: "Color3.fromRGB(139, 69, 19)",
            spawn: "Color3.fromRGB(0, 255, 0)",
            boss: "Color3.fromRGB(255, 0, 0)",
            loja: "Color3.fromRGB(0, 0, 255)",
        },
    };

    generateCode(mapa: MapaGerado, options?: RobloxAdapterOptions): string {
        const opt = { ...this.defaults, ...options };
        const numTiles = mapa.tiles.length;

        if (numTiles > opt.maxParts) {
            throw new Error(`Limite de partes excedido: ${numTiles} > ${opt.maxParts}`);
        }

        let script = `-- EZ STUDIOS - Protocolo Entropia Zero - Módulo 3D
-- ID: ${mapa.id}
-- Seed: ${mapa.seed}
-- Volume: ${mapa.dimensoes.largura}x${mapa.dimensoes.altura}x${mapa.dimensoes.profundidade}
-- Tiles: ${numTiles}
-- Gerado em: ${new Date().toISOString()}

local MapBuilder = {}

-- Configurações
local BLOCK_SIZE = ${opt.blockSize}
local FLOOR_HEIGHT = ${opt.blockSize} -- Altura de cada andar (Z-axis)
local TILE_COLORS = {
`;

        // Injetar esquema de cores
        for (const [id, color] of Object.entries(opt.colorScheme)) {
            script += `    ["${id}"] = ${color},\n`;
        }

        script += `}

local TILE_MATERIALS = {
    chao_1 = Enum.Material.SmoothPlastic,
    parede_1 = Enum.Material.Concrete,
    porta_1 = Enum.Material.Wood
}

-- Função para criar um tile 3D (Otimizado)
-- Nota: EZ-Z mapeado para Roblox-Y (vertical)
function MapBuilder.CreateTile(parent, tileId, x, y, z)
    local part = Instance.new("Part")
    part.Name = string.format("Tile_%s_%d_%d_%d", tileId, x, y, z)
    
    -- Se for parede, damos altura total do bloco
    local isWall = string.find(tileId, "parede")
    local sizeY = isWall and FLOOR_HEIGHT or 1
    local posY = (z * FLOOR_HEIGHT) + (sizeY / 2)

    part.Size = Vector3.new(BLOCK_SIZE, sizeY, BLOCK_SIZE)
    -- X -> X, Z -> Y (Vertical), Y -> Z (Profundidade)
    part.Position = Vector3.new(x * BLOCK_SIZE, posY, y * BLOCK_SIZE)
    part.Anchored = true
    part.Color = TILE_COLORS[tileId] or Color3.new(1, 1, 1)
    part.Material = TILE_MATERIALS[tileId] or Enum.Material.Plastic
    part.Parent = parent
    
    return part
end

-- Dados dos Setores Volumétricos
local SETORES = {
`;

        for (const setor of mapa.setores) {
            script += `    { id = "${setor.id}", tipo = "${setor.tipo}", x = ${setor.bounds.x}, y = ${setor.bounds.y}, z = ${setor.bounds.z}, w = ${setor.bounds.largura}, h = ${setor.bounds.altura}, d = ${setor.bounds.profundidade} },\n`;
        }

        script += `}

-- Construção progressiva para evitar lag
function MapBuilder.BuildMap(workspace)
    local mapFolder = Instance.new("Folder")
    mapFolder.Name = "${opt.baseFolderName}_" .. "${mapa.id}"
    mapFolder.Parent = workspace

    print("[EZ Studios 3D] Iniciando construção volumétrica...")
    local tilesBuilt = 0
`;

        // Processamento em batches
        const batchSize = 100;
        for (let i = 0; i < mapa.tiles.length; i += batchSize) {
            const batch = mapa.tiles.slice(i, i + batchSize);
            script += `\n    -- Batch ${Math.floor(i / batchSize) + 1}\n`;
            for (const tile of batch) {
                script += `    MapBuilder.CreateTile(mapFolder, "${tile.tileId}", ${tile.x}, ${tile.y}, ${tile.z})\n`;
            }
            script += `    tilesBuilt = tilesBuilt + ${batch.length}\n`;
            script += `    task.wait(0.02) -- Throttle ultra-fast\n`;
        }

        script += `
    print("[EZ Studios 3D] Construção concluída: " .. tilesBuilt .. " voxels")
    return mapFolder
end

-- Marcação visual de andares e setores
function MapBuilder.MarkSectors(mapFolder)
    for _, s in ipairs(SETORES) do
        if TILE_COLORS[s.tipo] then
            local marker = Instance.new("Part")
            marker.Name = "AREA_" .. s.id
            marker.Size = Vector3.new(s.w * BLOCK_SIZE, s.d * FLOOR_HEIGHT, s.h * BLOCK_SIZE)
            marker.Position = Vector3.new(
                (s.x + s.w/2) * BLOCK_SIZE, 
                (s.z + s.d/2) * FLOOR_HEIGHT, 
                (s.y + s.h/2) * BLOCK_SIZE
            )
            marker.Anchored = true
            marker.CanCollide = false
            marker.Transparency = 0.8
            marker.Color = TILE_COLORS[s.tipo]
            marker.Parent = mapFolder
            
            -- Adicionar Label 3D
            local billboard = Instance.new("BillboardGui")
            billboard.Size = UDim2.new(0, 100, 0, 50)
            billboard.AlwaysOnTop = true
            billboard.Parent = marker
            
            local text = Instance.new("TextLabel")
            text.Size = UDim2.new(1, 0, 1, 0)
            text.BackgroundTransparency = 1
            text.TextColor3 = Color3.new(1, 1, 1)
            text.Text = s.tipo:upper()
            text.Font = Enum.Font.GothamBold
            text.Parent = billboard
        end
    end
end

-- Fluxo Principal
local folder = MapBuilder.BuildMap(workspace)
MapBuilder.MarkSectors(folder)

return MapBuilder
`;

        return script;
    }

    getBuildStats(mapa: MapaGerado) {
        return {
            engine: this.engineName,
            tiles: mapa.tiles.length,
            setores: mapa.setores.length,
            volumetricDensity: mapa.tiles.length / (mapa.dimensoes.largura * mapa.dimensoes.altura * mapa.dimensoes.profundidade)
        };
    }
}
