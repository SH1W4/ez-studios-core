import { Intencao, Tile } from "../../core/models/types";
import { compilarComPrompt } from "../../compiler/intentCompiler";
import { RobloxAdapter } from "../../adapters/robloxAdapter";

/**
 * ServerlessAdapter
 * 
 * Manages the transition between local and cloud intent execution.
 * In a "Black-Box" production environment, the intent logic is gated
 * behind a secure AWS Lambda endpoint to protect EZ Studios IP.
 */
export class ServerlessAdapter {
    private static isCloudEnabled = process.env.VITE_ENVIRONMENT === "production";
    private static apiEndpoint = process.env.VITE_AWS_API_ENDPOINT;

    /**
     * Executes the intent compilation flow.
     */
    static async compileIntent(prompt: string, tiles: Tile[]): Promise<any> {
        if (this.isCloudEnabled && this.apiEndpoint) {
            console.log(`☁️ Routing Intent to Black-Box Cloud: ${this.apiEndpoint}`);
            
            try {
                const response = await fetch(`${this.apiEndpoint}/compile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, tiles })
                });

                if (!response.ok) throw new Error("Cloud Compilation Failed");
                return await response.json();
            } catch (error) {
                console.error("❌ Cloud Link Failure, falling back to local core...", error);
                return this.localFallback(prompt, tiles);
            }
        }

        return this.localFallback(prompt, tiles);
    }

    private static async localFallback(prompt: string, tiles: Tile[]) {
        console.log("💳 [MOCK] Checking Neural Credits (ENC)... 1000 available.");
        console.log("💳 [MOCK] Deducting 3 ENC for Intent Compilation...");
        
        console.log("🏠 Executing via Local Sovereign Core...");
        return await compilarComPrompt(prompt, tiles, new RobloxAdapter());
    }
}
