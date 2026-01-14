import { describe, it, expect } from 'vitest';
import { RobloxAdapter } from '../adapters/robloxAdapter';
import { MapaGerado } from '../core/models/types';

describe('RobloxAdapter', () => {
    it('should generate valid Lua code for a map', () => {
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

        expect(code).toContain('EZ STUDIOS - Mapa Volumétrico 3D');
        expect(code).toContain('MapBuilder.CreateTile(folder, "chao", 0, 0, 0)');
        expect(code).toContain('MapBuilder.CreateTile(folder, "parede", 1, 1, 0)');
        expect(code).toContain('return MapBuilder');
    });
});
