import { motion } from "framer-motion";
import { Trophy, TrendingUp, Plus, Play, Lock, Zap, Activity, Globe, Cpu } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { globalLogger } from "../infra/logging/logger";

// --- Types ---
interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  progresso: number;
  xp: number;
  nivelAtual: number;
  nivelMaximo: number;
  color: string;
  icon: React.ReactNode;
}

interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  desbloqueado: boolean;
  raridade: "comum" | "raro" | "lendario";
}

// --- Components ---

const HolographicGrid = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#050a14]" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
    <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-primary/10 to-transparent opacity-30" />
  </div>
);

const GlassCard = ({ children, className = "", delay = 0, hoverEffect = false }: { children: React.ReactNode, className?: string, delay?: number, hoverEffect?: boolean }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={hoverEffect ? { scale: 1.01, borderColor: "rgba(0, 217, 255, 0.4)", backgroundColor: "rgba(0, 217, 255, 0.05)" } : {}}
  >
    {/* Shine Effect */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

const ProgressBar = ({ progress, colorClass = "from-primary to-secondary" }: { progress: number, colorClass?: string }) => (
  <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
    <motion.div
      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClass} shadow-[0_0_10px_rgba(0,217,255,0.5)]`}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  </div>
);

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [logs, setLogs] = useState(globalLogger.obterLogsEstruturados());

  useEffect(() => {
    setLogs(globalLogger.obterLogsEstruturados());
  }, []);

  const successLogs = logs.filter((l: any) => l.buildStatus === "success");
  const buildXP = successLogs.length * 50;

  const [trilhas] = useState<Trilha[]>([
    {
      id: "luau-pro",
      nome: "Protocolo Luau",
      descricao: "Domine a linguagem nativa do Roblox.",
      progresso: 10 + (successLogs.length * 5),
      xp: 100 + buildXP,
      nivelAtual: 1,
      nivelMaximo: 5,
      color: "from-[#00D9FF] to-[#0066FF]",
      icon: <Cpu size={24} className="text-[#00D9FF]" />,
    },
    {
      id: "mundos",
      nome: "Arquiteto de Mundos",
      descricao: "Geração procedural de mapas complexos.",
      progresso: Math.min(100, successLogs.filter((l: any) => l.categoria === "Mapa").length * 20),
      xp: buildXP,
      nivelAtual: 1,
      nivelMaximo: 5,
      color: "from-[#FF006E] to-[#FFBE0B]",
      icon: <Globe size={24} className="text-[#FF006E]" />,
    },
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: "first-map",
      nome: "Gênesis",
      descricao: "Crie seu primeiro mapa procedural.",
      icon: "🌌",
      desbloqueado: successLogs.length > 0,
      raridade: "comum",
    },
    {
      id: "speed-runner",
      nome: "Velocista",
      descricao: "Complete uma trilha em menos de 20h.",
      icon: "⚡",
      desbloqueado: false,
      raridade: "raro",
    },
    {
      id: "architect",
      nome: "O Arquiteto",
      descricao: "Exporte 10 mundos para o Roblox.",
      icon: "🏛️",
      desbloqueado: false,
      raridade: "lendario",
    },
  ]);

  const totalXP = trilhas.reduce((acc: number, t: Trilha) => acc + t.xp, 0);
  const nivel = Math.floor(totalXP / 500) + 1;
  const xpProxNivel = (nivel * 500) - totalXP;

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-primary/30">
      <HolographicGrid />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050a14]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold tracking-tighter"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-mono text-lg">
              EZ
            </div>
            <span className="bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
              STUDIOS
            </span>
          </motion.div>

          <nav className="hidden md:flex gap-1">
            {[
              { label: "Dashboard", path: "/dashboard", active: true },
              { label: "Editor", path: "/editor", active: false },
              { label: "Marketplace", path: "/marketplace", active: false },
              { label: "Ranking", path: "/leaderboard", active: false },
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-all ${item.active
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs text-muted-foreground">Nível {nivel}</span>
              <span className="text-sm font-bold text-primary">{totalXP} XP</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 relative z-10">

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">

          {/* Welcome Card */}
          <GlassCard className="col-span-2 p-8 flex flex-col justify-between" delay={0.1}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20 uppercase tracking-widest">
                  Status: Online
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Bem-vindo ao <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00A3FF] to-secondary">
                  Nexus de Criação
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mb-8">
                Você é um Arquiteto de Nível {nivel}. Sua jornada para dominar o Metaverso continua aqui.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/editor")}
                className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-6 text-lg shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
              >
                <Plus className="mr-2" /> Criar Novo Mundo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/marketplace")}
                className="border-white/10 hover:bg-white/5 px-8 py-6 text-lg"
              >
                <Globe className="mr-2 text-secondary" /> Explorar Assets
              </Button>
            </div>
          </GlassCard>

          {/* Stats Card */}
          <GlassCard className="col-span-1 p-8" delay={0.2}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-secondary" /> Performance
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso do Nível {nivel}</span>
                  <span className="text-foreground font-mono">{totalXP % 500} / 500 XP</span>
                </div>
                <ProgressBar progress={((totalXP % 500) / 500) * 100} />
                <p className="text-xs text-right mt-1 text-primary/80">Faltam {xpProxNivel} XP para upar</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-2xl font-bold text-white mb-1">{successLogs.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Compilações</div>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-2xl font-bold text-accent mb-1">{badges.filter(b => b.desbloqueado).length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Conquistas</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Trilhas Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-accent" /> Trilhas de Maestria
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {trilhas.map((trilha, i) => (
              <GlassCard
                key={trilha.id}
                className="p-6 cursor-pointer group"
                hoverEffect={true}
                delay={0.3 + (i * 0.1)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trilha.color} flex items-center justify-center shadow-lg`}>
                      <div className="text-white drop-shadow-md">
                        {trilha.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{trilha.nome}</h3>
                      <p className="text-sm text-muted-foreground">{trilha.descricao}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded bg-white/5 text-xs font-mono border border-white/10">
                    NÍVEL {trilha.nivelAtual}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-muted-foreground">Progresso da Trilha</div>
                    <div className="text-lg font-bold text-white">{trilha.progresso}%</div>
                  </div>
                  <ProgressBar progress={trilha.progresso} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="text-[#FFBE0B]" /> Galeria de Conquistas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge, i) => (
              <GlassCard
                key={badge.id}
                className={`p-4 flex flex-col items-center text-center transition-all duration-300 ${!badge.desbloqueado && "opacity-50 grayscale"}`}
                delay={0.4 + (i * 0.05)}
                hoverEffect={badge.desbloqueado}
              >
                <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl
                  ${badge.desbloqueado
                    ? `bg-gradient-to-br from-white/10 to-transparent border border-${badge.raridade === "lendario" ? "accent" : "primary"}/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                    : "bg-white/5 border border-white/5"}
                `}>
                  {badge.icon}
                </div>
                <h4 className="font-bold text-sm mb-1">{badge.nome}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight">{badge.descricao}</p>

                {!badge.desbloqueado && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#FF006E]">
                    <Lock size={8} /> Bloqueado
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
