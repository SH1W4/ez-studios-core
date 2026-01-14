import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Save,
  Play,
  Share2,
  Settings,
  Layers,
  Box,
  Undo,
  Redo,
  Upload,
  Download,
  Terminal as TerminalIcon,
  Cpu,
  Grid,
  Maximize,
  Minimize,
  Codesandbox,
  Brain,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import { globalLogger } from "../infra/logging/logger";
import { generateBspTree, flattenToSectors } from "../core/bsp/bsp";
import { runToCompletion } from "../core/wfc/wfc";
import { parsePrompt, compilarIntencao } from "../compiler/intentCompiler";
import { RobloxAdapter } from "../adapters/robloxAdapter";
import { ConfigBSP, ConfigWFC, TileInstance, MapaGerado, Tile, Intencao } from "../core/models/types";

// --- Components ---
const Tooltip = ({ label }: { label: string }) => (
  <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10 uppercase tracking-widest">
    {label}
  </div>
);

const IconButton = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`group relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center
      ${active
        ? "bg-primary text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]"
        : "text-muted-foreground hover:text-white hover:bg-white/10"
      }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <Tooltip label={label} />
  </button>
);

const Panel = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`flex flex-col bg-[#0A0F1E]/90 backdrop-blur-xl border-r border-white/5 ${className}`}>
    <div className="h-12 border-b border-white/5 flex items-center px-4">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        <Cpu size={12} className="text-primary" />
        {title}
      </h3>
    </div>
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {children}
    </div>
  </div>
);

// --- Defaults ---
const DEFAULT_TILES: Tile[] = [
  { id: "chao", tipo: "chao", tags: ["walkable"], conexoesPermitidas: [] },
  { id: "parede", tipo: "parede", tags: ["blocker"], conexoesPermitidas: [] },
  { id: "porta", tipo: "porta", tags: ["connector"], conexoesPermitidas: [] },
];

// --- Main Editor ---

export default function Editor() {
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "erase">("select");
  const [showGrid, setShowGrid] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "> EZ Engine v2.2.0 initialized...",
    "> Core Systems: ONLINE",
    "> Intent Compiler: READY",
    "> Waiting for input..."
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildTime, setBuildTime] = useState(0);
  const [algorithm, setAlgorithm] = useState<"BSP" | "WFC" | "INTENT">("BSP");

  // Data
  const [lastGeneratedMap, setLastGeneratedMap] = useState<{
    sectors?: any[],
    tiles?: TileInstance[],
    type: "BSP" | "WFC"
  } | null>(null);

  // Configs
  const [bspConfig, setBspConfig] = useState<ConfigBSP>({
    largura: 50, altura: 50, profundidade: 1, profundidadeMaxima: 4, tamanhoMinimoSala: 5,
  });

  const [wfcConfig, setWfcConfig] = useState<ConfigWFC>({
    largura: 20, altura: 20, profundidade: 1, tiles: DEFAULT_TILES, distribuicao: "uniforme"
  });

  const [prompt, setPrompt] = useState("Dungeon sombria com corredores estreitos");
  const [lastIntent, setLastIntent] = useState<Intencao | null>(null);

  // --- Helpers ---
  const log = (msg: string) => {
    setConsoleOutput(prev => [...prev.slice(-9), msg]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const start = performance.now();

    // Yield to let UI update
    await new Promise(r => setTimeout(r, 100));

    try {
      if (algorithm === "INTENT") {
        log(`> Analisando intenção: "${prompt}"...`);
        const intent = parsePrompt(prompt);
        setLastIntent(intent);
        log(`> Intenção compilada: [${intent.categoria}] Tags: ${intent.parametros.tags.join(", ")}`);

        // Compile (Execute the intent via holistic compiler)
        const plano = compilarIntencao(intent, DEFAULT_TILES, new RobloxAdapter()); // Using dummy adapter for simulation

        // Render Result (Adapt outcome to UI)
        if (plano.resultado && "tiles" in plano.resultado) {
          const map = plano.resultado as MapaGerado;
          setLastGeneratedMap({ tiles: map.tiles, type: "WFC" }); // Treat as WFC/Tile map for rendering
          drawPreview({ tiles: map.tiles, type: "WFC" });
          log(`> Geração concluída via Intenção.`);
        } else {
          log(`> Resultado não visualizável (Item/Actor).`);
        }

      } else if (algorithm === "BSP") {
        log(`> Iniciando BSP...`);
        const tree = generateBspTree(bspConfig, () => Math.random());
        const sectors = flattenToSectors(tree);
        setLastGeneratedMap({ sectors, type: "BSP" });
        drawPreview({ sectors, type: "BSP" });
        log(`> BSP concluído: ${sectors.length} setores.`);
      } else {
        log(`> Iniciando WFC...`);
        const result = runToCompletion(wfcConfig, () => Math.random());
        if (result.status === "contradiction") throw new Error("WFC Contradiction.");
        setLastGeneratedMap({ tiles: result.mapaParcialOuCompleto, type: "WFC" });
        drawPreview({ tiles: result.mapaParcialOuCompleto, type: "WFC" });
        log(`> WFC concluído: ${result.mapaParcialOuCompleto.length} tiles.`);
      }

      const end = performance.now();
      const time = ((end - start) / 1000).toFixed(2);
      setBuildTime(Number(time));

      globalLogger.registrarSucesso(
        "gen_" + Date.now(),
        algorithm === "INTENT" ? "Intent" : "Mapa",
        "seed_" + Date.now(),
        "Editor",
        {
          estetica: "Quantum",
          numSetores: lastGeneratedMap?.sectors?.length || 0,
          numTiles: lastGeneratedMap?.tiles?.length || 0
        },
        Number(time)
      );

    } catch (e: any) {
      log(`> FALHA NA GERAÇÃO: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!lastGeneratedMap) {
      log("> Nenhum mapa gerado para exportar.");
      return;
    }

    try {
      log("> Exportando para Roblox...");

      let tilesToExport: TileInstance[] = [];

      if (lastGeneratedMap.type === "WFC" && lastGeneratedMap.tiles) {
        tilesToExport = lastGeneratedMap.tiles;
      } else if (lastGeneratedMap.type === "BSP" && lastGeneratedMap.sectors) {
        lastGeneratedMap.sectors.forEach(sem => {
          for (let x = sem.bounds.x; x < sem.bounds.x + sem.bounds.largura; x++) {
            for (let y = sem.bounds.y; y < sem.bounds.y + sem.bounds.altura; y++) {
              tilesToExport.push({ tileId: "chao", x, y, z: sem.bounds.z || 0 });
            }
          }
        });
      }

      const mapaStub: MapaGerado = {
        id: "export_" + Date.now(),
        seed: "manual_export",
        dimensoes: { largura: 100, altura: 100, profundidade: 1 },
        setores: [],
        tiles: tilesToExport,
        metadados: {
          autorId: "user",
          seed: "manual",
          criadoEm: new Date().toISOString(),
          hashGeracao: "hash",
          versaoMotor: "2.2.0",
          estetica: "Quantum",
          tags: ["export"]
        }
      };

      const adapter = new RobloxAdapter();
      const code = adapter.generateCode(mapaStub, { blockSize: 4 });

      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EZ_Map_${algorithm}_${Date.now()}.lua`;
      a.click();
      URL.revokeObjectURL(url);

      log("> Download iniciado.");

    } catch (e: any) {
      log(`> ERRO DE EXPORTAÇÃO: ${e.message}`);
    }
  };

  const drawPreview = (data: { sectors?: any[], tiles?: TileInstance[], type: "BSP" | "WFC" }) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = "#050a14";
    ctx.fillRect(0, 0, 800, 600);

    if (showGrid) {
      ctx.strokeStyle = "rgba(0, 217, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 10;
      for (let x = 0; x <= 800; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
      }
      for (let y = 0; y <= 600; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
      }
    }

    const scale = 8;

    if (data.type === "BSP" && data.sectors) {
      data.sectors.forEach((s, i) => {
        const x = s.bounds.x * scale + 50; // Offset check
        const y = s.bounds.y * scale + 50;
        const w = s.bounds.largura * scale;
        const h = s.bounds.altura * scale;

        ctx.fillStyle = i % 2 === 0 ? "rgba(0, 217, 255, 0.2)" : "rgba(255, 0, 110, 0.2)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "#00D9FF";
        ctx.strokeRect(x, y, w, h);
      });
    } else if (data.type === "WFC" && data.tiles) {
      data.tiles.forEach(t => {
        const x = t.x * scale + 50;
        const y = t.y * scale + 50;

        ctx.fillStyle = t.tileId === "parede" ? "#FF006E" : "rgba(0, 217, 255, 0.3)";
        ctx.fillRect(x, y, scale, scale);
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#050a14] text-foreground font-sans overflow-hidden">

      {/* 1. Sidebar Tools */}
      <aside className="w-16 flex flex-col items-center py-4 border-r border-white/5 bg-[#050a14] z-20">
        <div className="mb-6">
          <div onClick={() => navigate("/dashboard")} className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform text-black font-bold font-mono">
            EZ
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full px-2">
          <IconButton icon={Box} label="Manual (BSP)" active={algorithm === "BSP"} onClick={() => setAlgorithm("BSP")} />
          <IconButton icon={Grid} label="WFC Solver" active={algorithm === "WFC"} onClick={() => setAlgorithm("WFC")} />
          <IconButton icon={Brain} label="AI Intent" active={algorithm === "INTENT"} onClick={() => setAlgorithm("INTENT")} />
        </div>

        <div className="mt-auto flex flex-col gap-2 w-full px-2">
          <IconButton icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* 2. Left Panel: Config */}
      <Panel title="Configuração Neural" className="w-80 hidden lg:flex">
        <div className="space-y-6">

          <div className="bg-white/5 p-1 rounded-lg flex gap-1">
            <button className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${algorithm === "INTENT" ? "bg-primary text-black" : "text-muted-foreground"}`} onClick={() => setAlgorithm("INTENT")}>AI Mode</button>
            <button className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${algorithm !== "INTENT" ? "bg-white/10 text-white" : "text-muted-foreground"}`} onClick={() => setAlgorithm("BSP")}>Manual</button>
          </div>

          {algorithm === "INTENT" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <h4 className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                  <Sparkles size={14} /> Natural Language
                </h4>
                <textarea
                  className="w-full h-32 bg-black/20 text-white text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary border border-white/5 resize-none placeholder:text-white/20"
                  placeholder="Ex: Uma masmorra medieval com corredores estreitos e poções mágicas..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {prompt.length} chars
                  </span>
                </div>
              </div>

              {lastIntent && (
                <div className="p-3 rounded bg-white/5 border-l-2 border-secondary overflow-hidden">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Intent Parsed</div>
                  <div className="text-xs font-mono text-secondary truncate">Category: {lastIntent.categoria}</div>
                  <div className="text-xs font-mono text-white/50 truncate">Tags: {lastIntent.parametros.tags.join(", ")}</div>
                </div>
              )}
            </div>
          ) : algorithm === "BSP" ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <h4 className="text-xs font-bold text-primary border-l-2 border-primary pl-2 uppercase">BSP Volumétrico</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded">
                  <label className="text-[10px] text-muted-foreground uppercase">Dimensão X</label>
                  <input type="number" value={bspConfig.largura} onChange={e => setBspConfig({ ...bspConfig, largura: +e.target.value })} className="w-full bg-transparent text-white font-mono text-sm border-b border-white/10 focus:outline-none" />
                </div>
                <div className="bg-white/5 p-2 rounded">
                  <label className="text-[10px] text-muted-foreground uppercase">Dimensão Y</label>
                  <input type="number" value={bspConfig.altura} onChange={e => setBspConfig({ ...bspConfig, altura: +e.target.value })} className="w-full bg-transparent text-white font-mono text-sm border-b border-white/10 focus:outline-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <h4 className="text-xs font-bold text-secondary border-l-2 border-secondary pl-2 uppercase">WFC Tiling</h4>
              <div className="bg-white/5 p-2 rounded">
                <label className="text-[10px] text-muted-foreground uppercase">Grid Size</label>
                <input type="number" value={wfcConfig.largura} onChange={e => setWfcConfig({ ...wfcConfig, largura: +e.target.value, altura: +e.target.value })} className="w-full bg-transparent text-white font-mono text-sm border-b border-white/10 focus:outline-none" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-6 font-bold uppercase tracking-widest transition-all duration-300
                ${isGenerating
                  ? "bg-primary/20 text-primary animate-pulse border border-primary"
                  : algorithm === "INTENT" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white" : "bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] text-black"
                }`}
            >
              {isGenerating ? "Processando..." : algorithm === "INTENT" ? "Compilar Intenção" : "Gerar"}
            </Button>

            <Button
              onClick={handleExport}
              disabled={!lastGeneratedMap || isGenerating}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10 uppercase text-xs"
            >
              <Upload size={14} className="mr-2" /> Export to Roblox
            </Button>
          </div>

        </div>
      </Panel>

      {/* 3. Center: Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-[#020408] bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Top Bar */}
        <div className="h-12 border-b border-white/5 flex justify-between items-center px-6 bg-[#050a14]/80 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isGenerating ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
              <span className="text-xs font-mono text-muted-foreground">{algorithm === "INTENT" ? "AI KERNEL" : "LOGIC CORE"}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-bold text-primary">MODO: {algorithm === "INTENT" ? "NATURAL LANGUAGE" : "MANUAL BUILDER"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-mono text-muted-foreground self-center">
              {buildTime > 0 && `COMPILE TIME: ${buildTime}s`}
            </span>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-8 relative">
          <div className="relative shadow-2xl border border-white/10 rounded-sm">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="bg-[#050a14]"
            />

            {/* Overlay Loader */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4 shadow-[0_0_15px_#00d9ff]" />
                  <span className="text-primary font-mono text-sm animate-pulse tracking-[0.2em]">INTENT ANALYZER...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!lastGeneratedMap && !isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div className="text-center">
                  <Grid size={48} className="mx-auto mb-2 text-white" />
                  <p className="text-sm font-mono text-white">READY FOR INPUT</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Console */}
        <div className="h-48 border-t border-primary/20 bg-[#050a14]/95 backdrop-blur flex flex-col">
          <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold text-primary flex items-center gap-2">
              <TerminalIcon size={12} /> NEURAL LINK
            </h3>
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
            {consoleOutput.map((line, i) => (
              <div key={i} className={`mb-1 ${line.includes("ERRO") ? "text-red-500" : line.includes("SUCESSO") ? "text-green-400" : line.includes("Intenção") ? "text-purple-400" : "text-muted-foreground"}`}>
                <span className="opacity-30 mr-2">{new Date().toLocaleTimeString()}</span>
                {line}
              </div>
            ))}
            <div className="animate-pulse text-primary">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
