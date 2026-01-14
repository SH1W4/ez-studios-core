import { motion } from "framer-motion";
import { Trophy, TrendingUp, Plus, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { globalLogger } from "../infra/logging/logger";

interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  progresso: number;
  xp: number;
  nivelAtual: number;
  nivelMaximo: number;
  color: string;
}

interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  desbloqueado: boolean;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [logs, setLogs] = useState(globalLogger.obterLogsEstruturados());

  useEffect(() => {
    // Em um app real, isso seria um listener ou polling
    setLogs(globalLogger.obterLogsEstruturados());
  }, []);

  const successLogs = logs.filter((l: any) => l.buildStatus === "success");
  const buildXP = successLogs.length * 50;

  const [trilhas] = useState<Trilha[]>([
    {
      id: "luau-pro",
      nome: "Luau Pro",
      descricao: "Dominar linguagem Luau",
      progresso: 10 + (successLogs.length * 5),
      xp: 100 + buildXP,
      nivelAtual: 1,
      nivelMaximo: 5,
      color: "from-primary to-secondary",
    },
    {
      id: "mundos",
      nome: "Mundos",
      descricao: "Criar mundos com WFC",
      progresso: Math.min(100, successLogs.filter((l: any) => l.categoria === "Mapa").length * 20),
      xp: buildXP,
      nivelAtual: 1,
      nivelMaximo: 5,
      color: "from-secondary to-accent",
    },
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: "first-map",
      nome: "First Map",
      descricao: "Criar primeiro mapa",
      icon: "🗺️",
      desbloqueado: successLogs.length > 0,
    },
    {
      id: "speed-runner",
      nome: "Speed Runner",
      descricao: "Completar trilha em <20h",
      icon: "🚀",
      desbloqueado: false,
    },
  ]);

  const totalXP = trilhas.reduce((acc: number, t: Trilha) => acc + t.xp, 0);
  const nivel = Math.floor(totalXP / 500) + 1;
  const xpProxNivel = (nivel * 500) - totalXP;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-primary/20 backdrop-blur-md bg-background/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            EZ STUDIOS
          </motion.div>
          <nav className="flex gap-2 md:gap-4 text-sm md:text-base">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-primary"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/editor")}
              className="text-text-secondary hover:text-primary"
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
            <Button
              variant="ghost"
              onClick={() => navigate("/leaderboard")}
              className="text-text-secondary hover:text-primary"
            >
              Ranking
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Profile Card */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Bem-vindo, Desenvolvedor!</h1>
              <p className="text-text-secondary">Você está no nível {nivel} 🚀</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{totalXP}</div>
              <div className="text-sm text-text-secondary">Total XP</div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Próximo Nível</span>
              <span className="text-primary">{xpProxNivel} XP restantes</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${((totalXP % 500) / 500) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Trilhas Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Suas Trilhas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {trilhas.map((trilha, i) => (
              <motion.div
                key={trilha.id}
                className={`p-8 rounded-2xl bg-gradient-to-br ${trilha.color} opacity-20 hover:opacity-30 border border-white/10 backdrop-blur-xl transition-all duration-300 cursor-pointer group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/editor")}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{trilha.nome}</h3>
                    <p className="text-sm text-text-secondary">{trilha.descricao}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{trilha.xp}</div>
                    <div className="text-xs text-text-secondary">XP</div>
                  </div>
                </div>

                {/* Nível */}
                <div className="mb-4 flex gap-2">
                  {Array.from({ length: trilha.nivelMaximo }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${j < trilha.nivelAtual
                        ? "bg-primary text-background"
                        : "bg-white/10 text-text-secondary"
                        }`}
                    >
                      {j + 1}
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${trilha.progresso}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="text-xs text-text-secondary mt-2">{trilha.progresso}% completo</div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-primary/30 hover:bg-primary/50 text-primary border border-primary/50 group-hover:border-primary transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/editor");
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Continuar
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Badges Desbloqueadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                className={`p-6 rounded-2xl border backdrop-blur-xl text-center transition-all duration-300 ${badge.desbloqueado
                  ? "bg-primary/20 border-primary/50 hover:border-primary"
                  : "bg-white/5 border-white/10 opacity-50"
                  }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={badge.desbloqueado ? { scale: 1.05 } : {}}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold mb-1">{badge.nome}</h3>
                <p className="text-xs text-text-secondary mb-3">{badge.descricao}</p>
                {!badge.desbloqueado && (
                  <div className="flex items-center justify-center gap-1 text-xs text-text-secondary">
                    <Lock size={12} />
                    Bloqueado
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/editor")}
              className="bg-primary hover:bg-primary/80 text-background font-bold py-6 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Criar Novo Mapa
            </Button>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-secondary hover:bg-secondary/80 text-background font-bold py-6 flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} />
              Ver Marketplace
            </Button>
            <Button
              onClick={() => navigate("/leaderboard")}
              className="bg-accent hover:bg-accent/80 text-background font-bold py-6 flex items-center justify-center gap-2"
            >
              <Trophy size={20} />
              Ver Ranking
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
