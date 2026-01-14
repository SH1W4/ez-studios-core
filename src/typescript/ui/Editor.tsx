import { motion } from "framer-motion";
import { Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { compilarIntencao } from "../compiler/intentCompiler";
import { RobloxAdapter } from "../adapters/robloxAdapter";
import { ThreeJsAdapter } from "../adapters/threejsAdapter";
import { Tile as EngineTile, Intencao } from "../core/models/types";
import { globalLogger } from "../infra/logging/logger";

interface Tile {
  id: string;
  nome: string;
  cor: string;
}

interface Regra {
  id: string;
  tile1: string;
  tile2: string;
  adjacencia: "horizontal" | "vertical" | "ambos";
}

export default function Editor() {
  const [, navigate] = useLocation();
  const [tiles, setTiles] = useState<Tile[]>([
    { id: "chao", nome: "Grama", cor: "#00D9FF" },
    { id: "parede", nome: "Muro", cor: "#4A4A4A" },
    { id: "agua", nome: "Água", cor: "#FF006E" },
  ]);

  const [regras, setRegras] = useState<Regra[]>([
    { id: "r1", tile1: "chao", tile2: "chao", adjacencia: "ambos" },
    { id: "r2", tile1: "chao", tile2: "parede", adjacencia: "ambos" },
  ]);

  const [estetica, setEstetica] = useState<string>("Quantum");
  const [novoTile, setNovoTile] = useState("");
  const [gerando, setGerando] = useState(false);
  const [mapaPreview, setMapaPreview] = useState<any[]>([]);

  const robloxAdapter = new RobloxAdapter();
  const threeAdapter = new ThreeJsAdapter();

  const adicionarTile = () => {
    if (novoTile.trim()) {
      const id = novoTile.toLowerCase().replace(/\s+/g, "_");
      setTiles([
        ...tiles,
        {
          id,
          nome: novoTile,
          cor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        },
      ]);
      setNovoTile("");
    }
  };

  const removerTile = (id: string) => {
    setTiles(tiles.filter((t) => t.id !== id));
    setRegras(regras.filter((r) => r.tile1 !== id && r.tile2 !== id));
  };

  const gerar = async () => {
    setGerando(true);
    try {
      // 1. Converter estados da UI para formato do Motor
      const engineTiles: EngineTile[] = tiles.map((t: Tile) => {
        const conexoes: any[] = [];

        // Mapear regras de adjacência
        regras.filter((r: Regra) => r.tile1 === t.id || r.tile2 === t.id).forEach((r: Regra) => {
          const compatible = r.tile1 === t.id ? r.tile2 : r.tile1;
          const dirs: ("norte" | "sul" | "leste" | "oeste")[] = [];
          if (r.adjacencia === "horizontal" || r.adjacencia === "ambos") dirs.push("leste", "oeste");
          if (r.adjacencia === "vertical" || r.adjacencia === "ambos") dirs.push("norte", "sul");

          dirs.forEach((d: "norte" | "sul" | "leste" | "oeste") => {
            const existing = conexoes.find((c: any) => c.direcao === d);
            if (existing) {
              if (!existing.tilesCompatíveis.includes(compatible)) {
                existing.tilesCompatíveis.push(compatible);
              }
            } else {
              conexoes.push({ direcao: d, tilesCompatíveis: [compatible] });
            }
          });
        });

        return {
          id: t.id,
          tipo: t.nome.toLowerCase(),
          tags: [],
          conexoesPermitidas: conexoes,
          peso: 1
        };
      });

      const intencao: Intencao = {
        id: "ui_intent_" + Date.now(),
        categoria: "Mapa",
        descricaoNatural: `Mapa gerado via UI Editor com estética ${estetica}`,
        parametros: { largura: 8, altura: 8, quantidadeAreas: 1 },
        metadados: {
          autorId: "user_dev",
          seed: "seed_" + Date.now(),
          criadoEm: new Date().toISOString(),
          hashGeracao: "pending",
          tags: ["ui-generated"],
          versaoMotor: "2.2.0",
          estetica: estetica
        } as any
      };

      // 2. Executar Motor com Adaptador de Preview (ThreeJS)
      const resultado = compilarIntencao(intencao, engineTiles, threeAdapter);
      const data = JSON.parse(resultado.codigoGerado);

      setMapaPreview(data.tiles);

      // 3. Registrar Sucesso no Logger
      globalLogger.registrarSucesso(
        intencao.id,
        intencao.categoria,
        "seed_" + Date.now(),
        threeAdapter.engineName,
        { numSetores: 1, numTiles: data.tiles.length, estetica: estetica || "Quantum" },
        "COMPLETO"
      );
    } catch (error: any) {
      console.error("Erro na geração:", error);
      alert("Contradição de Entropia! Suas regras impedem o colapso do mapa.");
    } finally {
      setGerando(false);
    }
  };

  const exportarEngine = (engine: "Roblox" | "Unity" | "Godot") => {
    try {
      const engineTiles: EngineTile[] = tiles.map((t: Tile) => ({
        id: t.id,
        tipo: t.nome.toLowerCase(),
        tags: [],
        conexoesPermitidas: [],
        peso: 1
      }));

      const intencao: Intencao = {
        id: `export_${engine}_` + Date.now(),
        categoria: "Mapa",
        descricaoNatural: `Exportação para ${engine}`,
        parametros: { largura: 16, altura: 16 },
        metadados: {
          autorId: "user_dev",
          seed: "seed_" + Date.now(),
          criadoEm: new Date().toISOString(),
          hashGeracao: "pending",
          tags: ["export"],
          versaoMotor: "2.2.0",
          estetica: estetica
        } as any
      };

      const adapter = engine === "Roblox" ? robloxAdapter : threeAdapter; // Fallback for Godot/Unity demo
      const resultado = compilarIntencao(intencao, engineTiles, adapter as any);

      // Download do arquivo
      const ext = engine === "Roblox" ? "lua" : "json";
      const blob = new Blob([resultado.codigoGerado], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EZ_${engine}_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erro ao exportar: " + e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-primary/20 backdrop-blur-md bg-background/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            EZ STUDIOS
          </motion.div>
          <nav className="flex gap-2 md:gap-4 text-sm md:text-base">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-text-secondary hover:text-primary"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/editor")}
              className="text-primary"
            >
              Editor
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplace")}
              className="text-text-secondary hover:text-primary"
            >
              Marketplace
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Universal Visual Studio (v2.2.0)</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel - Tiles & Aesthetics */}
          <motion.div
            className="md:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tiles */}
            <div className="p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl h-fit">
              <h2 className="text-xl font-bold mb-6">Tiles</h2>

              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={novoTile}
                  onChange={(e) => setNovoTile(e.target.value)}
                  placeholder="Nome do tile..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-text-secondary focus:outline-none focus:border-primary"
                  onKeyPress={(e: any) => e.key === "Enter" && adicionarTile()}
                />
                <Button
                  onClick={adicionarTile}
                  className="bg-primary hover:bg-primary/80 text-background"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {tiles.map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: tile.cor }}
                        />
                        <span className="font-medium">{tile.nome}</span>
                      </div>
                      <button
                        onClick={() => removerTile(tile.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Estética Selector */}
            <div className="p-8 rounded-2xl bg-surface border border-accent/20 backdrop-blur-xl h-fit">
              <h2 className="text-xl font-bold mb-6">Intenção Artística</h2>
              <div className="grid grid-cols-2 gap-2">
                {["Quantum", "Cybernetic", "Realistic", "LowPoly"].map((est) => (
                  <Button
                    key={est}
                    variant={estetica === est ? "default" : "outline"}
                    onClick={() => setEstetica(est)}
                    className={`text-xs ${estetica === est ? "bg-accent text-background" : "border-accent/30 text-accent"}`}
                  >
                    {est}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Canvas */}
          <motion.div
            className="md:col-span-1 p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-6">Real-time Preview</h2>

            {/* Canvas (Placeholder for Three.js Viewport) */}
            <div className={`w-full aspect-square bg-white/5 border border-primary/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden transition-all ${estetica === "Quantum" ? "shadow-[0_0_20px_rgba(0,217,255,0.3)]" : ""}`}>
              <div className="grid grid-cols-8 gap-1 p-4">
                {mapaPreview.length > 0 ? (
                  mapaPreview.map((cell, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-sm"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                      style={{
                        backgroundColor: cell.color,
                        boxShadow: estetica === "Quantum" ? `0 0 5px ${cell.color}` : "none",
                        opacity: cell.opacity || 1
                      }}
                    />
                  ))
                ) : (
                  <div className="text-text-secondary text-sm text-center">
                    Defina regras e clique em <br /><strong>Gerar Preview</strong>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={gerar}
              disabled={gerando}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold py-6 flex items-center justify-center gap-2"
            >
              {gerando ? "Colapsando..." : "Atualizar Preview 3D"}
            </Button>
          </motion.div>

          {/* Right Panel - Regras & Export */}
          <motion.div
            className="md:col-span-1 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Regras */}
            <div className="p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl h-fit">
              <h2 className="text-xl font-bold mb-6">Regras de Adjacência</h2>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {regras.map((regra, i) => {
                  const tile1 = tiles.find((t) => t.id === regra.tile1);
                  const tile2 = tiles.find((t) => t.id === regra.tile2);

                  return (
                    <motion.div
                      key={regra.id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tile1 && <div className="w-4 h-4 rounded" style={{ backgroundColor: tile1.cor }} />}
                          <span className="text-xs">{tile1?.nome}</span>
                          <span className="text-xs text-text-secondary">↔</span>
                          {tile2 && <div className="w-4 h-4 rounded" style={{ backgroundColor: tile2.cor }} />}
                          <span className="text-xs">{tile2?.nome}</span>
                        </div>
                        <button
                          onClick={() => setRegras(regras.filter((r: any) => r.id !== regra.id))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {regra.adjacencia}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Universal Export */}
            <div className="p-8 rounded-2xl bg-surface border border-accent/20 backdrop-blur-xl h-fit">
              <h2 className="text-xl font-bold mb-6">Universal Export</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => exportarEngine("Roblox")}
                  className="w-full bg-[#00A2FF] hover:bg-[#00A2FF]/80 text-white font-bold py-4 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export to Roblox (.LUA)
                </Button>
                <Button
                  onClick={() => exportarEngine("Unity")}
                  className="w-full bg-[#222C37] hover:bg-[#222C37]/80 text-white font-bold py-4 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export to Unity (.JSON)
                </Button>
                <Button
                  onClick={() => exportarEngine("Godot")}
                  className="w-full bg-[#478CBF] hover:bg-[#478CBF]/80 text-white font-bold py-4 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export to Godot (.JSON)
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
