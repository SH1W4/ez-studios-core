/**
 * Interface Base para Adaptadores de Engine
 * Define o contrato para qualquer engine (Roblox, Unity, etc) gerar qualquer entidade
 */

import { ProceduralEntity } from "../core/models/types";

export interface IEngineAdapter {
  /** Nome identificador da engine (ex: "Roblox", "Unity") */
  readonly engineName: string;

  /** Extensão do arquivo gerado (ex: "lua", "cs") */
  readonly fileExtension: string;

  /**
   * Converte uma entidade procedural em código executável na engine alvo
   * @param entidade Mapa, Ator ou Item gerado pelo core
   * @param options Opções específicas de customização
   */
  generateCode(entidade: ProceduralEntity, options?: any): string;

  /**
   * Retorna metadados ou estatísticas da construção
   */
  getBuildStats(entidade: ProceduralEntity): any;
}

export interface RobloxAdapterOptions {
  maxParts?: number;
  blockSize?: number;
  baseFolderName?: string;
  colorScheme?: Record<string, string>;
}
