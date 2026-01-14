import { motion } from "framer-motion";
import { Settings, LogOut, Copy, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";

/**
 * DESIGN PHILOSOPHY: Cyberpunk Educacional + Glassmorphism
 * Perfil de aluno com estatísticas
 */

export default function Profile() {
  const [, navigate] = useLocation();

  const stats = [
    { label: "Mapas Criados", valor: 24, icon: "🗺️" },
    { label: "Mapas Vendidos", valor: 12, icon: "💰" },
    { label: "Total de Downloads", valor: 3250, icon: "⬇️" },
    { label: "Receita Total", valor: "R$ 2.450", icon: "💵" },
  ];

  const historico = [
    { data: "10 jan", acao: "Vendeu 'Dungeon Medieval'", xp: "+50" },
    { data: "09 jan", acao: "Completou Trilha Luau Pro", xp: "+100" },
    { data: "08 jan", acao: "Criou novo mapa", xp: "+50" },
    { data: "07 jan", acao: "Desbloqueou badge 'Speed Runner'", xp: "+200" },
  ];

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
              onClick={() => navigate("/profile")}
              className="text-primary"
            >
              Perfil
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
              👨‍💻
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Desenvolvedor Elite</h1>
              <p className="text-text-secondary mb-4">ID: dev_elite_001</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copiar ID
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 flex items-center gap-2"
              >
                <Settings size={16} />
                Configurações
              </Button>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary">{stat.valor}</div>
                <div className="text-xs text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Histórico */}
          <motion.div
            className="md:col-span-2 p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Histórico Recente</h2>
            <div className="space-y-4">
              {historico.map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div>
                    <div className="text-sm text-text-secondary">{item.data}</div>
                    <div className="font-medium">{item.acao}</div>
                  </div>
                  <div className="text-primary font-bold">{item.xp}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            className="p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Badges</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: "🗺️", nome: "First Map" },
                { emoji: "🚀", nome: "Speed Runner" },
                { emoji: "💎", nome: "Master" },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-lg bg-primary/20 border border-primary/50 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <div className="text-xs font-bold">{badge.nome}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Próximos Passos */}
        <motion.div
          className="mt-12 p-12 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Próximos Passos</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Você está no caminho certo! Complete mais trilhas e venda mapas para subir no ranking.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/80 text-background font-bold px-8 py-4"
            >
              Continuar Aprendendo
            </Button>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-secondary hover:bg-secondary/80 text-background font-bold px-8 py-4"
            >
              Ver Marketplace
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
