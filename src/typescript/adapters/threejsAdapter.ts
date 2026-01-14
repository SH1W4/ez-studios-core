/**
 * Adaptador ThreeJS / Web Preview
 * Converte o mapa gerado em uma estrutura de dados leve para visualização no Editor React
 */

import { IEngineAdapter } from "./index";
import { MapaGerado } from "../core/models/types";

export class ThreeJsAdapter implements IEngineAdapter {
    readonly engineName = "ThreeJS";
    readonly fileExtension = "json";

    /**
     * Gera um JSON estruturado para o renderer Web (v2.2.0)
     */
    generateCode(entidade: any, _options?: any): string {
        const estetica = entidade.metadados?.estetica || "Quantum";

        const data = {
            id: entidade.id,
            estetica: estetica,
            dimensions: entidade.dimensoes || { largura: 1, altura: 1, profundidade: 1 },
            // Mapeamento premium para o frontend
            tiles: (entidade.tiles || []).map((t: any) => ({
                id: t.tileId,
                x: t.x,
                y: t.y,
                z: t.z,
                color: this.getTileColor(t.tileId),
                material: this.getMaterialForAesthetic(estetica),
                opacity: estetica === "Quantum" ? 0.8 : 1.0
            })),
            sectors: (entidade.setores || []).map((s: any) => ({
                id: s.id,
                bounds: s.bounds,
            })),
        };

        return JSON.stringify(data, null, 2);
    }

    private getMaterialForAesthetic(estetica: string): string {
        switch (estetica) {
            case "Quantum": return "MeshStandardMaterial";
            case "Cybernetic": return "MeshPhongMaterial";
            case "Realistic": return "MeshPhysicalMaterial";
            case "LowPoly": return "MeshToonMaterial";
            default: return "MeshStandardMaterial";
        }
    }

    getBuildStats(mapa: MapaGerado) {
        return {
            engine: this.engineName,
            tiles: mapa.tiles.length,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Helper para cores de preview baseadas no nome do tile
     */
    private getTileColor(tileId: string): string {
        const lowerId = tileId.toLowerCase();
        if (lowerId.includes("parede")) return "#4A4A4A"; // Cinza Escuro
        if (lowerId.includes("chao") || lowerId.includes("grama")) return "#2ECC71"; // Verde
        if (lowerId.includes("agua")) return "#3498DB"; // Azul
        if (lowerId.includes("porta")) return "#E67E22"; // Laranja
        if (lowerId.includes("spawn")) return "#F1C40F"; // Amarelo
        if (lowerId.includes("boss")) return "#E74C3C"; // Vermelho
        return "#FFFFFF"; // Default
    }
}
