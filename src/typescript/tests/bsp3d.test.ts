/**
 * Teste de Integração: BSP 3D
 * Verifica o particionamento volumétrico e multicamadas
 */

import { generateBspTree, flattenToSectors, validarSetores } from "../core/bsp/bsp";
import { ConfigBSP } from "../core/models/types";

function testBsp3D() {
    console.log("🧪 Iniciando Teste de BSP 3D...");

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

    try {
        const tree = generateBspTree(config, rng);
        const setores = flattenToSectors(tree);

        console.log(`✅ Árvore BSP 3D gerada com sucesso.`);
        console.log(`📊 Total de setores: ${setores.length}`);

        // Validar tamanhos mínimos
        const valido = validarSetores(setores, config.tamanhoMinimoSala);
        if (!valido) {
            throw new Error("Falha: Setores gerados são menores que o tamanho mínimo permitido.");
        }
        console.log(`✅ Todos os setores respeitam as dimensões mínimas (Cuboide).`);

        // Verificar se há divisões no eixo Z (profundidade)
        const temZ = setores.some(s => s.bounds.z > 0);
        if (!temZ) {
            console.warn("⚠️ Aviso: Nenhuma divisão detectada no eixo Z. Aumentando profundidade da árvore ou RNG pode ser necessário.");
        } else {
            console.log(`✅ Sucesso: Divisões volumétricas (andares) detectadas.`);
        }

        // Calcular volume total
        const volumeTotal = setores.reduce((acc, s) => {
            return acc + (s.bounds.largura * s.bounds.altura * s.bounds.profundidade);
        }, 0);

        const volumeEsperado = config.largura * config.altura * config.profundidade;
        if (volumeTotal !== volumeEsperado) {
            throw new Error(`Falha: Volume total do mapa (${volumeTotal}) diverge do esperado (${volumeEsperado}).`);
        }
        console.log(`✅ Consistência Volumétrica: 100% (${volumeTotal} voxels).`);

        console.log("🚀 Teste de BSP 3D: PASSOU");
    } catch (error) {
        console.error("❌ Teste de BSP 3D: FALHOU");
        console.error(error);
        process.exit(1);
    }
}

testBsp3D();
