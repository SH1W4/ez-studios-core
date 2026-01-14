import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

/**
 * DESIGN PHILOSOPHY: Cyberpunk Educacional + Glassmorphism
 * Leaderboard com ranking global
 */

interface Jogador {
  posicao: number;
  nome: string;
  xp: number;
  nivel: number;
  mapas: number;
  vendas: number;
  badge?: string;
}

export default function Leaderboard() {
  const [, navigate] = useLocation();
  const [filtro, setFiltro] = useState("global");

  const [jogadores] = useState<Jogador[]>([
    {
      posicao: 1,
      nome: "Dev Elite #1",
      xp: 5500,
      nivel: 11,
      mapas: 45,
      vendas: 1250,
      badge: "👑",
    },
    {
      posicao: 2,
      nome: "Dev Elite #2",
      xp: 5200,
      nivel: 10,
      mapas: 38,
      vendas: 980,
      badge: "🥈",
    },
    {
      posicao: 3,
      nome: "Dev Elite #3",
      xp: 4800,
      nivel: 9,
      mapas: 32,
      vendas: 750,
      badge: "🥉",
    },
    {
      posicao: 4,
      nome: "Dev Elite #4",
      xp: 4200,
      nivel: 8,
      mapas: 28,
      vendas: 620,
    },
    {
      posicao: 5,
      nome: "Dev Elite #5",
      xp: 3800,
      nivel: 7,
      mapas: 24,
      vendas: 480,
    },
    {
      posicao: 6,
      nome: "Dev Elite #6",
      xp: 3400,
      nivel: 6,
      mapas: 20,
      vendas: 350,
    },
    {
      posicao: 7,
      nome: "Dev Elite #7",
      xp: 3000,
      nivel: 6,
      mapas: 18,
      vendas: 280,
    },
    {
      posicao: 8,
      nome: "Dev Elite #8",
      xp: 2600,
      nivel: 5,
      mapas: 15,
      vendas: 200,
    },
  ]);

  const filtros = ["global", "mensal", "luau-pro", "mundos"];

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
              className="text-text-secondary hover:text-primary"
            >
              Editor
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/leaderboard")}
              className="text-primary"
            >
              Ranking
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-10 h-10 text-accent" />
            <h1 className="text-4xl font-bold">Ranking Global</h1>
          </div>
          <p className="text-text-secondary">
            Veja os desenvolvedores mais elite da comunidade EZ Studios
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold mb-4">Filtrar por</h2>
          <div className="flex flex-wrap gap-3">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${filtro === f
                  ? "bg-primary text-background"
                  : "bg-white/10 text-text-secondary hover:bg-white/20"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          className="mb-12 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {jogadores.slice(0, 3).map((jogador, i) => {
            const alturas = ["md:h-80", "h-64", "md:h-72"];
            const cores = [
              "from-accent to-secondary",
              "from-gray-400 to-gray-500",
              "from-orange-400 to-orange-500",
            ];

            return (
              <motion.div
                key={jogador.posicao}
                className={`${alturas[i]} bg-gradient-to-b ${cores[i]} opacity-20 rounded-2xl border border-white/10 backdrop-blur-xl p-8 flex flex-col justify-between`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div>
                  <div className="text-5xl font-bold text-white mb-2">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <h3 className="text-2xl font-bold">{jogador.nome}</h3>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {jogador.xp} XP
                  </div>
                  <div className="text-sm text-text-secondary">
                    Nível {jogador.nivel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabela de Ranking */}
        <motion.div
          className="rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    Posição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    XP
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    Nível
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    Mapas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">
                    Vendas
                  </th>
                </tr>
              </thead>
              <tbody>
                {jogadores.map((jogador, i) => (
                  <motion.tr
                    key={jogador.posicao}
                    className="border-b border-primary/10 hover:bg-primary/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{jogador.badge || "•"}</span>
                        <span className="font-bold text-lg">
                          #{jogador.posicao}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{jogador.nome}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" />
                        <span className="text-primary font-bold">
                          {jogador.xp}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                        {jogador.nivel}
                      </span>
                    </td>
                    <td className="px-6 py-4">{jogador.mapas}</td>
                    <td className="px-6 py-4">
                      <span className="text-secondary font-bold">
                        R$ {jogador.vendas}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 p-12 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Suba no Ranking!</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Complete trilhas, crie mapas e venda no marketplace para ganhar XP e subir de posição.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg px-12 py-6 rounded-lg"
          >
            Voltar ao Dashboard
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
