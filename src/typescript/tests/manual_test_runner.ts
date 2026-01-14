import assert from 'assert';
import { generateBspTree, flattenToSectors } from '../core/bsp/bsp';
import { RobloxAdapter } from '../adapters/robloxAdapter';
import { MapaGerado, ConfigBSP } from '../core/models/types';
import { globalLogger } from '../infra/logging/logger';

console.log("🛡️ INITIATING FIELD TEST SEQUENCE 🛡️");
const results = { passed: 0, failed: 0 };

function test(name: string, fn: () => void) {
    try {
        process.stdout.write(`TEST: ${name} ... `);
        fn();
        console.log("✅ PASS");
        results.passed++;
    } catch (e: any) {
        console.log("❌ FAIL");
        console.error(e.message);
        results.failed++;
    }
}

// --- SUITE 1: BSP CORE ---
test("BSP Tree Generation", () => {
    const config: ConfigBSP = {
        largura: 32,
        altura: 32,
        profundidade: 1,
        profundidadeMaxima: 5,
        tamanhoMinimoSala: 4
    };
    const tree = generateBspTree(config, () => 0.5); // Fixed seed behavior
    const sectors = flattenToSectors(tree);

    assert.ok(sectors.length > 0, "Should generate sectors");
    assert.ok(sectors.length <= Math.pow(2, 5), "Should not exceed max depth splits");

    // Check boundaries
    sectors.forEach(s => {
        assert.ok(s.bounds.largura >= 4, `Sector width ${s.bounds.largura} < min 4`);
        assert.ok(s.bounds.altura >= 4, `Sector height ${s.bounds.altura} < min 4`);
    });
});

// --- SUITE 2: ROBLOX ADAPTER ---
test("Roblox Adapter Output", () => {
    const adapter = new RobloxAdapter();
    const mockMap: MapaGerado = {
        id: 'test_map',
        seed: '123',
        dimensoes: { largura: 10, altura: 10, profundidade: 1 },
        setores: [],
        tiles: [
            { tileId: 'chao', x: 0, y: 0, z: 0 },
            { tileId: 'parede', x: 1, y: 1, z: 0 }
        ],
        metadados: {
            autorId: 'tester',
            seed: '123',
            criadoEm: '2023-01-01',
            hashGeracao: 'abc',
            versaoMotor: '2.0',
            estetica: 'Quantum',
            tags: ['test']
        }
    };

    const code = adapter.generateCode(mockMap);

    assert.ok(code.includes('EZ STUDIOS - Mapa Volumétrico 3D'), "Missing Header");
    assert.ok(code.includes('MapBuilder.CreateTile(folder, "chao", 0, 0, 0)'), "Missing Tile 1");
    assert.ok(code.includes('return MapBuilder'), "Missing Return");
});

console.log("\n---------------------------------------------------");
console.log(`RESULTS: ${results.passed} PASSED, ${results.failed} FAILED`);
if (results.failed > 0) process.exit(1);
process.exit(0);
