/**
 * Web API Interface for EZ Studios SaaS
 * Defines the contract between the Universal Web Hub and the Agnostic Core.
 */

import { Intencao, ProceduralEntity, MarketplaceMetadata } from "../core/models/types";

export interface GenerateRequest {
    intent: Intencao;
    adapterName: "Roblox" | "Unity" | "Godot" | "ThreeJS";
    aesthetic?: MarketplaceMetadata["estetica"];
    detailLevel?: number;
}

export interface GenerateResponse {
    entity: ProceduralEntity;
    generatedCode: string;
    stats: {
        timeMs: number;
        hash: string;
    };
}

export interface ExportRequest {
    entityId: string;
    targetEngine: "Roblox" | "Unity" | "Godot";
}

export interface ExportResponse {
    downloadUrl: string;
    rawCode: string;
}

/**
 * Service placeholder for the SaaS Web Hub
 */
export class EZApiService {
    static async handleGenerate(_req: GenerateRequest): Promise<GenerateResponse> {
        // Implementation will call the local compiler and chosen adapter
        throw new Error("Not implemented in CLI context");
    }

    static async handleExport(_req: ExportRequest): Promise<ExportResponse> {
        // Implementation will package the entity for the target engine
        throw new Error("Not implemented in CLI context");
    }
}
