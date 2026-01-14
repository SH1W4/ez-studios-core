/**
 * API Educacional de Alto Nível
 * Funções amigáveis para alunos e professores
 */

import { compilarIntencao } from "../../compiler/intentCompiler";
import { Intencao, PlanoDeGeracao, Tile } from "../../core/models/types";
import { globalLogger } from "../../infra/logging/logger";

/**
 * Tiles padrão pré-configurados
 */
const TILES_PADRAO: Tile[] = [
  {
    id: "chao_normal",
    tipo: "chao",
    tags: ["walkable", "default"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao_normal", "porta"] },
      { direcao: "sul", tilesCompatíveis: ["chao_normal", "porta"] },
      { direcao: "leste", tilesCompatíveis: ["chao_normal", "porta"] },
      { direcao: "oeste", tilesCompatíveis: ["chao_normal", "porta"] },
    ],
    peso: 2,
  },
  {
    id: "parede_pedra",
    tipo: "parede",
    tags: ["solid", "blocking"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["parede_pedra", "porta"] },
      { direcao: "sul", tilesCompatíveis: ["parede_pedra", "porta"] },
      { direcao: "leste", tilesCompatíveis: ["parede_pedra", "porta"] },
      { direcao: "oeste", tilesCompatíveis: ["parede_pedra", "porta"] },
    ],
    peso: 1.5,
  },
  {
    id: "porta_madeira",
    tipo: "porta",
    tags: ["transition", "walkable"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao_normal", "parede_pedra"] },
      { direcao: "sul", tilesCompatíveis: ["chao_normal", "parede_pedra"] },
      { direcao: "leste", tilesCompatíveis: ["chao_normal", "parede_pedra"] },
      { direcao: "oeste", tilesCompatíveis: ["chao_normal", "parede_pedra"] },
    ],
    peso: 0.5,
  },
];

import { RobloxAdapter } from "../../adapters/robloxAdapter";

const robloxAdapter = new RobloxAdapter();

/**
 * Gera uma dungeon para um aluno
 */
export function generateDungeonForStudent(
  studentId: string,
  intencaoCustom?: Intencao,
  seed?: string
): PlanoDeGeracao {
  const intencao: Intencao = intencaoCustom || {
    id: `intent_dungeon_${studentId}_${Date.now()}`,
    categoria: "Mapa",
    descricaoNatural: "Gerar dungeon procedural com boss",
    parametros: {
      temBossRoom: true,
      quantidadeAreas: 4,
      dificuldade: "normal",
    },
    metadados: {
      autorId: studentId,
      seed: seed || "default_seed",
      criadoEm: new Date().toISOString(),
      hashGeracao: "pending",
      tags: ["edu", "dungeon"],
      versaoMotor: "2.2.0",
      estetica: "Quantum" // Default para alunos
    } as any
  };

  return compilarIntencao(intencao, TILES_PADRAO, robloxAdapter, seed, studentId);
}

/**
 * Gera uma arena para um aluno
 */
export function generateArenaForStudent(
  studentId: string,
  seed?: string
): PlanoDeGeracao {
  const intencao: Intencao = {
    id: `intent_arena_${studentId}_${Date.now()}`,
    categoria: "Mapa",
    descricaoNatural: "Gerar arena de combate simétrica",
    parametros: {
      temBossRoom: false,
      quantidadeAreas: 2,
      dificuldade: "hard",
    },
  };

  return compilarIntencao(intencao, TILES_PADRAO, robloxAdapter, seed, studentId);
}

/**
 * Função wrapper que registra intenção e constrói
 */
export function logIntentAndBuild(
  studentId: string,
  intencao: Intencao
): PlanoDeGeracao {
  console.log(`[${new Date().toISOString()}] Aluno ${studentId} iniciando build`);
  console.log(`Intenção: ${intencao.descricaoNatural}`);

  const resultado = compilarIntencao(intencao, TILES_PADRAO, robloxAdapter, undefined, studentId);

  const stats = (resultado.resultado as any).metadados?.stats;
  console.log(
    `Build concluído: ${stats?.numTiles || 0} tiles em ${stats?.tempoGeracaoMs || 0}ms`
  );

  return resultado;
}

/**
 * Retorna logs de um aluno específico
 */
export function obterLogsDoAluno(studentId: string): string {
  const logs = globalLogger.filtrarPorEstudante(studentId);
  return JSON.stringify(logs, null, 2);
}

/**
 * Retorna estatísticas gerais
 */
export function obterEstatisticas(): {
  totalBuilds: number;
  sucessos: number;
  erros: number;
  tempoMedioMs: number;
} {
  const logs = globalLogger.obterLogsEstruturados();
  const sucessos = logs.filter((l) => l.buildStatus === "success").length;
  const erros = logs.filter((l) => l.buildStatus === "error").length;
  const tempoMedio =
    logs.reduce((sum, l) => sum + (Number(l.duracao) || 0), 0) / Math.max(logs.length, 1);

  return {
    totalBuilds: logs.length,
    sucessos,
    erros,
    tempoMedioMs: tempoMedio,
  };
}
