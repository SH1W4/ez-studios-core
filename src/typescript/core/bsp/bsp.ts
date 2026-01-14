/**
 * Binary Space Partitioning (BSP) 3D para Divisão de Espaço Volumétrico
 * Gera setores cuboidais para organização de mapas multi-andares
 */

import { BspNode, ConfigBSP, Setor } from "../models/types";

let nodeCounter = 0;

/**
 * Gera árvore BSP 3D recursivamente
 */
export function generateBspTree(config: ConfigBSP, rng: () => number): BspNode {
  nodeCounter = 0;
  return generateBspTreeRecursivo(
    {
      x: 0,
      y: 0,
      z: 0,
      largura: config.largura,
      altura: config.altura,
      profundidade: config.profundidade,
    },
    0,
    config,
    rng
  );
}

/**
 * Recursão interna para geração de BSP 3D
 */
function generateBspTreeRecursivo(
  bounds: { x: number; y: number; z: number; largura: number; altura: number; profundidade: number },
  profundidade: number,
  config: ConfigBSP,
  rng: () => number
): BspNode {
  const node: BspNode = {
    id: `bsp_${nodeCounter++}`,
    bounds,
  };

  // Critério de parada: profundidade máxima ou tamanho mínimo atingido em todas as dimensões
  if (
    profundidade >= config.profundidadeMaxima ||
    (bounds.largura <= config.tamanhoMinimoSala &&
      bounds.altura <= config.tamanhoMinimoSala &&
      bounds.profundidade <= config.tamanhoMinimoSala)
  ) {
    // Criar setor folha (cuboide)
    node.setor = {
      id: `setor_${node.id}`,
      bounds,
      tipo: profundidade === 0 ? "hub" : "sala",
    };
    return node;
  }

  // Decidir em qual eixo dividir
  const podeDividirX = bounds.largura >= config.tamanhoMinimoSala * 2;
  const podeDividirY = bounds.altura >= config.tamanhoMinimoSala * 2; // Roblox Y é vertical, mas meu tipo usa Altura para Y plano e Profundidade para Z vertical
  const podeDividirZ = bounds.profundidade >= config.tamanhoMinimoSala * 2;

  const opcoes: ("vertical" | "horizontal" | "profundidade")[] = [];
  if (podeDividirX) opcoes.push("vertical");
  if (podeDividirY) opcoes.push("horizontal");
  if (podeDividirZ) opcoes.push("profundidade");

  if (opcoes.length === 0) {
    node.setor = {
      id: `setor_${node.id}`,
      bounds,
      tipo: "sala",
    };
    return node;
  }

  // Escolher eixo aleatoriamente entre as opções válidas
  const direcao = opcoes[Math.floor(rng() * opcoes.length)];
  node.direcao = direcao;

  if (direcao === "vertical") {
    // Dividir em X
    const min = Math.ceil(config.tamanhoMinimoSala);
    const max = bounds.largura - min;
    const corte = min + Math.floor(rng() * (max - min));

    node.esquerda = generateBspTreeRecursivo(
      { ...bounds, largura: corte },
      profundidade + 1,
      config,
      rng
    );

    node.direita = generateBspTreeRecursivo(
      { ...bounds, x: bounds.x + corte, largura: bounds.largura - corte },
      profundidade + 1,
      config,
      rng
    );
  } else if (direcao === "horizontal") {
    // Dividir em Y
    const min = Math.ceil(config.tamanhoMinimoSala);
    const max = bounds.altura - min;
    const corte = min + Math.floor(rng() * (max - min));

    node.esquerda = generateBspTreeRecursivo(
      { ...bounds, altura: corte },
      profundidade + 1,
      config,
      rng
    );

    node.direita = generateBspTreeRecursivo(
      { ...bounds, y: bounds.y + corte, altura: bounds.altura - corte },
      profundidade + 1,
      config,
      rng
    );
  } else {
    // Dividir em Z (Profundidade / Andares)
    const min = Math.ceil(config.tamanhoMinimoSala);
    const max = bounds.profundidade - min;
    const corte = min + Math.floor(rng() * (max - min));

    node.esquerda = generateBspTreeRecursivo(
      { ...bounds, profundidade: corte },
      profundidade + 1,
      config,
      rng
    );

    node.direita = generateBspTreeRecursivo(
      { ...bounds, z: bounds.z + corte, profundidade: bounds.profundidade - corte },
      profundidade + 1,
      config,
      rng
    );
  }

  return node;
}

/**
 * Converte árvore BSP 3D em lista de setores (folhas)
 */
export function flattenToSectors(tree: BspNode): Setor[] {
  const setores: Setor[] = [];

  function traversar(node: BspNode) {
    if (node.setor) {
      setores.push(node.setor);
    }

    if (node.esquerda) traversar(node.esquerda);
    if (node.direita) traversar(node.direita);
  }

  traversar(tree);
  return setores;
}

/**
 * Valida que todos os setores respeitam tamanhos mínimos em todas as dimensões
 */
export function validarSetores(setores: Setor[], tamanhoMinimo: number): boolean {
  return setores.every(
    (setor) =>
      setor.bounds.largura >= tamanhoMinimo &&
      setor.bounds.altura >= tamanhoMinimo &&
      setor.bounds.profundidade >= tamanhoMinimo
  );
}
