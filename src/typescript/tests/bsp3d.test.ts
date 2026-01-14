/**
 * Teste de Integração: BSP 3D
 * Verifica o particionamento volumétrico e multicamadas
 */

import { describe, it, expect } from "vitest";
import { generateBspTree, flattenToSectors, validarSetores } from "../core/bsp/bsp";
import { ConfigBSP } from "../core/models/types";

describe("BSP 3D Integration", () => {
    it("should generate a valid 3D BSP tree and sectors", () => {
        const config: ConfigBSP = {
            largura: 32,
            altura: 32,
            profundidade: 12, // 3 andares de 4 unidades cada
            profundidadeMaxima: 5,
            tamanhoMinimoSala: 4,
        };

        const seed = 12345;
        const rng = () => {
            // Simple PRNG para consistência nos testes
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const tree = generateBspTree(config, rng);
        const setores = flattenToSectors(tree);

        // Validar que setores foram gerados
        expect(setores.length).toBeGreaterThan(0);

        // Validar tamanhos mínimos
        const valido = validarSetores(setores, config.tamanhoMinimoSala);
        expect(valido).toBe(true);

        // Verificar se há divisões no eixo Z (profundidade)
        const temZ = setores.some(s => s.bounds.z > 0);
        expect(temZ).toBe(true);

        // Calcular volume total
        const volumeTotal = setores.reduce((acc, s) => {
            return acc + (s.bounds.largura * s.bounds.altura * s.bounds.profundidade);
        }, 0);

        const volumeEsperado = config.largura * config.altura * config.profundidade;
        expect(volumeTotal).toBe(volumeEsperado);
    });
});
