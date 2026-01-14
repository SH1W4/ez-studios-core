/**
 * Sistema de Logging Padronizado (Protocolo Entropia Zero)
 * Logs estruturados em JSON para observabilidade e reprodutibilidade
 */

import { LogEntrada } from "../../core/models/types";

export class Logger {
  private logs: LogEntrada[] = [];

  /**
   * Registra um evento de build/geração
   */
  registrarBuild(entrada: LogEntrada): void {
    // Validar campos obrigatórios
    if (!entrada.timestamp) {
      entrada.timestamp = new Date().toISOString();
    }
    if (!entrada.intentId) {
      throw new Error("intentId é obrigatório em LogEntrada");
    }

    this.logs.push(entrada);
  }

  /**
   * Registra sucesso de geração
   */
  registrarSucesso(
    intentId: string,
    categoria: string,
    seed: string,
    engineAlvo: string,
    mapStats?: { numSetores: number; numTiles: number; estetica?: string;[key: string]: any },
    duracao?: number | string,
    studentId?: string
  ): void {
    this.registrarBuild({
      timestamp: new Date().toISOString(),
      studentId,
      intentId,
      categoria: categoria as any,
      engineAlvo,
      seed,
      stats: mapStats,
      buildStatus: "success",
      duracao,
    });
  }

  /**
   * Registra erro de geração
   */
  registrarErro(
    intentId: string,
    categoria: string,
    seed: string,
    engineAlvo: string,
    errorType: string,
    errorMessage: string,
    studentId?: string,
    duracao?: number
  ): void {
    this.registrarBuild({
      timestamp: new Date().toISOString(),
      studentId,
      intentId,
      categoria: categoria as any,
      engineAlvo,
      seed,
      buildStatus: "error",
      errorType,
      errorMessage,
      duracao,
    });
  }

  /**
   * Retorna todos os logs como JSON
   */
  obterLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Retorna logs estruturados
   */
  obterLogsEstruturados(): LogEntrada[] {
    return [...this.logs];
  }

  /**
   * Limpa todos os logs
   */
  limpar(): void {
    this.logs = [];
  }

  /**
   * Filtra logs por status
   */
  filtrarPorStatus(status: "success" | "error" | "warning"): LogEntrada[] {
    return this.logs.filter((log) => log.buildStatus === status);
  }

  /**
   * Filtra logs por studentId
   */
  filtrarPorEstudante(studentId: string): LogEntrada[] {
    return this.logs.filter((log) => log.studentId === studentId);
  }
}

// Instância global do logger
export const globalLogger = new Logger();
