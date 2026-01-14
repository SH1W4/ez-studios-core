/**
 * Wave Function Collapse (WFC) 3D - EZ Studios v2.2.0
 * Implementação com entropia de Shannon e suporte volumétrico
 */

import {
  ConfigWFC,
  ContradictionError,
  GridWFC,
  ResultadoColapso,
  Tile,
  TileInstance,
} from "../models/types";

/**
 * Calcula entropia de Shannon para um conjunto de possibilidades
 */
function calcularEntropia(
  possibilidades: Set<string>,
  tiles: Map<string, Tile>
): number {
  if (possibilidades.size <= 1) return 0;

  let entropia = 0;
  let totalPeso = 0;

  for (const tileId of possibilidades) {
    totalPeso += tiles.get(tileId)?.peso || 1;
  }

  for (const tileId of possibilidades) {
    const peso = (tiles.get(tileId)?.peso || 1) / totalPeso;
    if (peso > 0) {
      entropia -= peso * Math.log2(peso);
    }
  }

  return entropia;
}

/**
 * Inicializa grid 3D com todas as possibilidades abertas
 */
export function initializeGrid(config: ConfigWFC): GridWFC {
  const tileMap = new Map(config.tiles.map((t) => [t.id, t]));
  const celulas: Set<string>[][][] = [];
  const entropias: number[][][] = [];
  const colapsadas: boolean[][][] = [];

  for (let x = 0; x < config.largura; x++) {
    celulas[x] = [];
    entropias[x] = [];
    colapsadas[x] = [];
    for (let y = 0; y < config.altura; y++) {
      celulas[x][y] = [];
      entropias[x][y] = [];
      colapsadas[x][y] = [];
      for (let z = 0; z < config.profundidade; z++) {
        const possibilidades = new Set(config.tiles.map((t) => t.id));
        celulas[x][y][z] = possibilidades;
        entropias[x][y][z] = calcularEntropia(possibilidades, tileMap);
        colapsadas[x][y][z] = false;
      }
    }
  }

  return {
    largura: config.largura,
    altura: config.altura,
    profundidade: config.profundidade,
    celulas,
    entropias,
    colapsadas,
  };
}

/**
 * Encontra a célula com menor entropia (maior incerteza resolvida por entropia mínima > 0)
 */
function encontrarCélulaMínimaEntropia(grid: GridWFC): { x: number; y: number; z: number } | null {
  let minEntropia = Infinity;
  let posicao: { x: number; y: number; z: number } | null = null;

  for (let x = 0; x < grid.largura; x++) {
    for (let y = 0; y < grid.altura; y++) {
      for (let z = 0; z < grid.profundidade; z++) {
        if (!grid.colapsadas[x][y][z]) {
          const e = grid.entropias[x][y][z];
          if (e > 0 && e < minEntropia) {
            minEntropia = e;
            posicao = { x, y, z };
          }
        }
      }
    }
  }

  return posicao;
}

/**
 * Obtém vizinhos em 3D
 */
function obterVizinhos3D(x: number, y: number, z: number, grid: GridWFC): Map<string, { x: number; y: number; z: number }> {
  const vizinhos = new Map<string, { x: number; y: number; z: number }>();
  if (x > 0) vizinhos.set("oeste", { x: x - 1, y, z });
  if (x < grid.largura - 1) vizinhos.set("leste", { x: x + 1, y, z });
  if (y > 0) vizinhos.set("sul", { x, y: y - 1, z });
  if (y < grid.altura - 1) vizinhos.set("norte", { x, y: y + 1, z });
  if (z > 0) vizinhos.set("baixo", { x, y, z: z - 1 });
  if (z < grid.profundidade - 1) vizinhos.set("cima", { x, y, z: z + 1 });
  return vizinhos;
}

/**
 * Propaga restrições em 3D
 */
function propagarRestricoes(grid: GridWFC, startX: number, startY: number, startZ: number, tiles: Map<string, Tile>): boolean {
  const fila: { x: number; y: number; z: number }[] = [{ x: startX, y: startY, z: startZ }];

  while (fila.length > 0) {
    const cur = fila.shift()!;
    const curPossibilidades = grid.celulas[cur.x][cur.y][cur.z];
    const vizinhos = obterVizinhos3D(cur.x, cur.y, cur.z, grid);

    for (const [direcao, viz] of vizinhos) {
      const vizPossibilidades = grid.celulas[viz.x][viz.y][viz.z];
      const validosParaVizinho = new Set<string>();

      for (const curTileId of curPossibilidades) {
        const tile = tiles.get(curTileId);
        if (!tile) continue;
        const regras = tile.conexoesPermitidas.filter(r => r.direcao === direcao);
        for (const r of regras) {
          for (const compat of r.tilesCompatíveis) {
            validosParaVizinho.add(compat);
          }
        }
      }

      const novasPossibilidades = new Set<string>();
      let mudou = false;

      for (const vizTileId of vizPossibilidades) {
        if (validosParaVizinho.has(vizTileId)) {
          novasPossibilidades.add(vizTileId);
        } else {
          mudou = true;
        }
      }

      if (novasPossibilidades.size === 0) return false;

      if (mudou) {
        grid.celulas[viz.x][viz.y][viz.z] = novasPossibilidades;
        grid.entropias[viz.x][viz.y][viz.z] = calcularEntropia(novasPossibilidades, tiles);
        fila.push(viz);
      }
    }
  }
  return true;
}

/**
 * Passo de colapso
 */
export function stepCollapse(grid: GridWFC, tiles: Map<string, Tile>, rng: () => number): ResultadoColapso {
  const pos = encontrarCélulaMínimaEntropia(grid);
  if (!pos) return { gridAtualizado: grid, status: "completo" };

  const possibilidades = Array.from(grid.celulas[pos.x][pos.y][pos.z]);
  const totalPeso = possibilidades.reduce((s, id) => s + (tiles.get(id)?.peso || 1), 0);
  let threshold = rng() * totalPeso;
  let escolhido = possibilidades[0];

  for (const id of possibilidades) {
    threshold -= (tiles.get(id)?.peso || 1);
    if (threshold <= 0) {
      escolhido = id;
      break;
    }
  }

  grid.celulas[pos.x][pos.y][pos.z] = new Set([escolhido]);
  grid.colapsadas[pos.x][pos.y][pos.z] = true;
  grid.entropias[pos.x][pos.y][pos.z] = 0;

  if (!propagarRestricoes(grid, pos.x, pos.y, pos.z, tiles)) {
    throw new ContradictionError(pos, [escolhido]);
  }

  return { gridAtualizado: grid, status: "ok", posicaoColapsada: pos };
}

export function runToCompletion(config: ConfigWFC, rng: () => number): { mapaParcialOuCompleto: TileInstance[]; status: "ok" | "contradiction" } {
  const grid = initializeGrid(config);
  const tileMap = new Map(config.tiles.map(t => [t.id, t]));

  try {
    let res: ResultadoColapso;
    do {
      res = stepCollapse(grid, tileMap, rng);
    } while (res.status === "ok");

    const instances: TileInstance[] = [];
    for (let x = 0; x < grid.largura; x++) {
      for (let y = 0; y < grid.altura; y++) {
        for (let z = 0; z < grid.profundidade; z++) {
          const id = Array.from(grid.celulas[x][y][z])[0];
          if (id) instances.push({ tileId: id, x, y, z });
        }
      }
    }
    return { mapaParcialOuCompleto: instances, status: "ok" };
  } catch (e) {
    return { mapaParcialOuCompleto: [], status: "contradiction" };
  }
}
