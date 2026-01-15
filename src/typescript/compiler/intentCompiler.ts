/**
 * Compilador de Intenção Holístico (PEG)
 * Fluxo canônico do Protocolo Entropia Zero para Mapas, Atores e Itens
 */

import { generateBspTree, flattenToSectors } from "../core/bsp/bsp";
import {
  ConfigBSP,
  ConfigWFC,
  Intencao,
  MapaGerado,
  PlanoDeGeracao,
  Regra,
  Tile,
  ProceduralEntity,
  ItemInstance,
  ActorInstance,
  MarketplaceMetadata,
} from "../core/models/types";
import { runToCompletion } from "../core/wfc/wfc";
import { globalLogger } from "../infra/logging/logger";
import { IEngineAdapter } from "../adapters";
import { globalLLM } from "./llmAdapter";
import { intentDataStore } from "../data/intentDataStore";

/**
 * Mapeamento de Intenção → Regras base
 */
function mapearIntencaoParaRegras(intencao: Intencao): Regra[] {
  const regras: Regra[] = [];

  if (intencao.categoria === "Mapa") {
    const params = intencao.parametros as any;
    regras.push({
      id: `regra_mapa_base_${intencao.id}`,
      categoria: "Mapa",
      condicoes: { ...params },
      acoes: { criarBSP: true, criarWFC: true },
      prioridade: 100,
    });
  } else if (intencao.categoria === "Item") {
    const params = intencao.parametros as any;
    regras.push({
      id: `regra_item_base_${intencao.id}`,
      categoria: "Item",
      condicoes: { tipo: params.tipo || "arma" },
      acoes: { gerarAtributos: true, calcularRaridade: true },
    });
  } else if (intencao.categoria === "Actor") {
    regras.push({
      id: `regra_actor_base_${intencao.id}`,
      categoria: "Actor",
      condicoes: { classe: "basica" },
      acoes: { gerarAnatomia: true, configurarIA: true },
    });
  }

  return regras;
}

/**
 * Configurações de Engines Core (BSP, WFC) baseadas em regras
 */
function configurarBSP(regras: Regra[], dim: { largura: number; altura: number; profundidade: number }): ConfigBSP {
  return {
    largura: dim.largura,
    altura: dim.altura,
    profundidade: dim.profundidade,
    profundidadeMaxima: 6,
    tamanhoMinimoSala: 8,
  };
}

function configurarWFC(regras: Regra[], tiles: Tile[], dim: { largura: number; altura: number; profundidade: number }): ConfigWFC {
  return {
    largura: dim.largura,
    altura: dim.altura,
    profundidade: dim.profundidade,
    tiles,
    distribuicao: "ponderada",
    maxTentativas: 1000,
  };
}

/**
 * Compila uma intenção completa (Holística)
 */
export function compilarIntencao(
  intencao: Intencao,
  tiles: Tile[],
  adapter: IEngineAdapter,
  seed?: string,
  studentId?: string
): PlanoDeGeracao {
  const startTime = Date.now();
  const seedUsado = seed || Math.random().toString(36).substring(7);
  const rng = criarRNG(seedUsado);
  const metadataBase: MarketplaceMetadata = {
    autorId: studentId || "anonymous",
    seed: seedUsado,
    criadoEm: new Date().toISOString(),
    hashGeracao: `ezhash_${seedUsado}_${Date.now()}`,
    tags: [intencao.categoria],
    versaoMotor: "2.3.0-AI",
  };

  try {
    const regras = mapearIntencaoParaRegras(intencao);
    let resultado: ProceduralEntity;

    if (intencao.categoria === "Mapa") {
      const dim = { largura: 64, altura: 64, profundidade: 8 }; // Standard 3D labels
      const configBSP = configurarBSP(regras, dim);
      const bspTree = generateBspTree(configBSP, rng);
      const setores = flattenToSectors(bspTree);

      const configWFC = configurarWFC(regras, tiles, dim);
      const { mapaParcialOuCompleto } = runToCompletion(configWFC, rng);

      resultado = {
        id: `mapa_${intencao.id}_${Date.now()}`,
        seed: seedUsado,
        dimensoes: dim,
        setores,
        tiles: mapaParcialOuCompleto,
        metadados: {
          ...metadataBase,
          stats: {
            numSetores: setores.length,
            numTiles: mapaParcialOuCompleto.length,
            tempoGeracaoMs: Date.now() - startTime,
          },
        },
      } as MapaGerado;
    } else if (intencao.categoria === "Item") {
      resultado = {
        id: `item_${intencao.id}_${Date.now()}`,
        blueprintId: "bp_sword_base",
        tipo: "arma",
        raridade: "lendario",
        stats: { dano: 50 + Math.floor(rng() * 50), durabilidade: 100 },
        efeitos: ["Fogo"],
        metadados: metadataBase,
      } as ItemInstance;
    } else {
      resultado = {
        id: `actor_${intencao.id}_${Date.now()}`,
        blueprintId: "bp_npc_base",
        nome: "Guardião Procedural",
        stats: { vida: 100, dano: 10, velocidade: 5, inteligencia: 8 },
        visual: { modeloBase: "rbx_humanoid", escala: 1, cores: {}, acessorios: [] },
        IA: { comportamento: "neutro", percepcao: 10 },
        metadados: metadataBase,
      } as ActorInstance;
    }

    // Log para Treinamento (Fase 36)
    intentDataStore.logIntent(intencao.descricaoNatural || "", intencao, "global-llm");

    const codigoGerado = adapter.generateCode(resultado as any);

    globalLogger.registrarSucesso(
      intencao.id,
      intencao.categoria,
      seedUsado,
      adapter.engineName,
      adapter.getBuildStats(resultado as any),
      Date.now() - startTime,
      studentId
    );

    return {
      intencao,
      regras,
      resultado,
      codigoGerado,
      logs: globalLogger.obterLogsEstruturados(),
    };
  } catch (error) {
    globalLogger.registrarErro(
      intencao.id,
      intencao.categoria,
      seedUsado,
      adapter.engineName,
      error instanceof Error ? error.name : "UnknownError",
      error instanceof Error ? error.message : String(error),
      studentId,
      Date.now() - startTime
    );
    throw error;
  }
}

/**
 * Analisa um prompt de linguagem natural e converte em uma Intenção estruturada
 */
export function parsePrompt(prompt: string): Intencao {
  const p = prompt.toLowerCase();

  // 1. Detectar Categoria
  let categoria: "Mapa" | "Item" | "Actor" = "Mapa"; // Default
  if (p.includes("item") || p.includes("espada") || p.includes("pocao") || p.includes("arma")) categoria = "Item";
  else if (p.includes("actor") || p.includes("npc") || p.includes("monstro") || p.includes("boss")) categoria = "Actor";

  // 2. Extrair Tags / Keywords
  const tags: string[] = [];
  const keywords = ["fogo", "gelo", "floresta", "dungeon", "cidade", "cyberpunk", "medieval", "futurista", "natureza", "sombrio", "radiante"];

  keywords.forEach(k => {
    if (p.includes(k)) tags.push(k);
  });

  // 3. Detectar Parâmetros Específicos
  const parametros: any = {};

  // Estética
  if (p.includes("cyber") || p.includes("quantum")) parametros.estetica = "Quantum";
  else if (p.includes("medieval") || p.includes("rpg")) parametros.estetica = "Realistic";
  else if (p.includes("lowpoly") || p.includes("simples")) parametros.estetica = "LowPoly";
  else parametros.estetica = "Quantum"; // Default system aesthetic

  // Dimensões (Simples heurística)
  if (p.includes("grande") || p.includes("enorme")) {
    parametros.largura = 64; parametros.altura = 64;
  } else if (p.includes("pequeno") || p.includes("compacto")) {
    parametros.largura = 16; parametros.altura = 16;
  } else {
    parametros.largura = 32; parametros.altura = 32;
  }

  // Item Specifics
  if (categoria === "Item") {
    if (p.includes("espada")) parametros.tipo = "espada";
    else if (p.includes("pocao")) parametros.tipo = "pocao";
  }

  return {
    id: `intent_${Date.now()}`,
    categoria,
    descricaoNatural: prompt,
    parametros: {
      ...parametros,
      tags
    }
  };
}

/**
 * Fluxo de Alto Nível: Prompt → IA → Resultado → Código
 */
export async function compilarComPrompt(
  prompt: string,
  tiles: Tile[],
  adapter: IEngineAdapter,
  seed?: string,
  studentId?: string
): Promise<PlanoDeGeracao> {
  // 1. IA Processa a intenção
  const intencao = await globalLLM.processarIntencao(prompt);

  // 2. Compila a intenção em resultado procedural
  return compilarIntencao(intencao, tiles, adapter, seed, studentId);
}

function criarRNG(seed: string): () => number {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = ((state << 5) - state) + seed.charCodeAt(i);
    state = state & state;
  }
  return function () {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export const intentCompiler = {
  compilarIntencao,
  compilarComPrompt,
};
