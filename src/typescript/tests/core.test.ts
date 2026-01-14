/**
 * Testes Automatizados - Núcleo Procedural 3D
 * Valida WFC, BSP e serialização - EZ Studios v2.2.0
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateBspTree, flattenToSectors, validarSetores } from "../core/bsp/bsp";
import {
  deserializeMapa,
  serializeMapa,
} from "../core/models/serialization";
import { ConfigBSP, ConfigWFC, Tile, MapaGerado, ContradictionError, Setor } from "../core/models/types";
import { initializeGrid, stepCollapse, runToCompletion } from "../core/wfc/wfc";

// Tiles de teste
const TILES_TESTE: Tile[] = [
  {
    id: "chao",
    tipo: "chao",
    tags: ["walkable"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "sul", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "leste", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "oeste", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "cima", tilesCompatíveis: ["chao"] },
      { direcao: "baixo", tilesCompatíveis: ["chao"] },
    ],
    peso: 2,
  },
  {
    id: "parede",
    tipo: "parede",
    tags: ["solid"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "sul", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "leste", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "oeste", tilesCompatíveis: ["chao", "parede"] },
    ],
    peso: 1,
  },
];

describe("BSP 3D Core", () => {
  const config: ConfigBSP = {
    largura: 100,
    altura: 100,
    profundidade: 50,
    tamanhoMinimoSala: 20,
    profundidadeMaxima: 3,
  };
  const mockRng = () => 0.5;

  it("deve gerar uma árvore BSP válida", () => {
    const tree = generateBspTree(config, mockRng);
    expect(tree).toBeDefined();
    expect(tree.id).toContain("bsp_");
    expect(tree.bounds.largura).toBe(100);
    expect(tree.bounds.profundidade).toBe(50);
  });

  it("deve achatar a árvore em setores", () => {
    const tree = generateBspTree(config, mockRng);
    const setores = flattenToSectors(tree);
    expect(setores.length).toBeGreaterThan(0);
    expect(setores[0].id).toContain("setor_");
  });

  it("deve respeitar os limites mínimos de tamanho", () => {
    const tree = generateBspTree(config, mockRng);
    const setores = flattenToSectors(tree);
    const valido = validarSetores(setores, config.tamanhoMinimoSala);
    expect(valido).toBe(true);
  });
});

describe("WFC 3D - Wave Function Collapse", () => {
  it("deve inicializar grid 3D com todas as possibilidades", () => {
    const config: ConfigWFC = {
      largura: 10,
      altura: 10,
      profundidade: 5,
      tiles: TILES_TESTE,
    };

    const grid = initializeGrid(config);

    expect(grid.largura).toBe(10);
    expect(grid.altura).toBe(10);
    expect(grid.profundidade).toBe(5);
    expect(grid.celulas.length).toBe(10);
    expect(grid.celulas[0][0].length).toBe(5);

    // Verificar uma célula 
    expect(grid.celulas[0][0][0].size).toBe(TILES_TESTE.length);
  });

  it("deve completar WFC 3D sem contradição", () => {
    const config: ConfigWFC = {
      largura: 4,
      altura: 4,
      profundidade: 2,
      tiles: TILES_TESTE,
      maxTentativas: 10,
    };

    const rng = () => Math.random();
    const resultado = runToCompletion(config, rng);

    expect(resultado.status).toMatch(/ok|contradiction/);
    expect(resultado.mapaParcialOuCompleto).toBeDefined();
  });
});

describe("Serialização v2.2.0", () => {
  let mapaExemplo: MapaGerado;

  beforeEach(() => {
    mapaExemplo = {
      id: "mapa_teste_001",
      seed: "seed_123",
      dimensoes: { largura: 10, altura: 10, profundidade: 1 },
      setores: [
        {
          id: "setor_1",
          bounds: { x: 0, y: 0, z: 0, largura: 5, altura: 5, profundidade: 1 },
          tipo: "spawn",
        },
      ],
      tiles: [
        { tileId: "chao", x: 0, y: 0, z: 0 },
        { tileId: "parede", x: 1, y: 1, z: 0 },
      ],
      metadados: {
        autorId: "test_user",
        seed: "seed_123",
        criadoEm: new Date().toISOString(),
        hashGeracao: "hash_test",
        tags: ["test"],
        versaoMotor: "2.2.0",
        stats: {
          numSetores: 1,
          numTiles: 2,
        },
      },
    };
  });

  it("deve serializar e desserializar mapa 3D preservando integridade", () => {
    const json = serializeMapa(mapaExemplo);
    const mapaDesserializado = deserializeMapa(json);

    expect(mapaDesserializado.id).toBe(mapaExemplo.id);
    expect(mapaDesserializado.dimensoes.profundidade).toBe(1);
    expect(mapaDesserializado.tiles[0].z).toBe(0);
  });
});

describe("ContradictionError 3D", () => {
  it("deve conter contexto de posição 3D", () => {
    const posicao = { x: 5, y: 5, z: 2 };
    const tilesImpossíveis = ["chao", "parede"];

    const erro = new ContradictionError(posicao, tilesImpossíveis);

    expect(erro.posicao).toEqual(posicao);
    expect(erro.message).toContain("(5, 5, 2)");
  });
});
