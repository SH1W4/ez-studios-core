/**
 * Serialização e Desserialização de Mapas Gerados
 * Contrato JSON para portabilidade
 */

import { MapaGerado } from "./types";

/**
 * Serializa um mapa gerado para JSON compacto
 */
export function serializeMapa(mapa: MapaGerado): string {
  const payload = {
    id: mapa.id,
    seed: mapa.seed,
    dimensoes: mapa.dimensoes,
    setores: mapa.setores,
    tiles: mapa.tiles,
    metadados: mapa.metadados,
  };

  return JSON.stringify(payload);
}

/**
 * Desserializa um mapa a partir de JSON
 */
export function deserializeMapa(blob: string): MapaGerado {
  const payload = JSON.parse(blob);

  return {
    id: payload.id,
    seed: payload.seed,
    dimensoes: payload.dimensoes,
    setores: payload.setores || [],
    tiles: payload.tiles || [],
    metadados: payload.metadados || {
      criadoEm: new Date().toISOString(),
    },
  };
}

/**
 * Calcula tamanho aproximado do mapa serializado (em bytes)
 */
export function calcularTamanhoMapa(mapa: MapaGerado): number {
  return serializeMapa(mapa).length;
}

/**
 * Valida integridade de um mapa desserializado
 */
export function validarMapaDesserializado(mapa: MapaGerado): boolean {
  if (!mapa.id || !mapa.seed) return false;
  if (!mapa.dimensoes || mapa.dimensoes.largura <= 0 || mapa.dimensoes.altura <= 0)
    return false;
  if (!Array.isArray(mapa.setores) || !Array.isArray(mapa.tiles)) return false;

  // Validar que todos os tiles estão dentro dos bounds
  for (const tile of mapa.tiles) {
    if (
      tile.x < 0 ||
      tile.y < 0 ||
      tile.x >= mapa.dimensoes.largura ||
      tile.y >= mapa.dimensoes.altura
    ) {
      return false;
    }
  }

  return true;
}
