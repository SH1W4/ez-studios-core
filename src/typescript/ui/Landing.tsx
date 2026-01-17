import { motion } from "framer-motion";
import { ArrowRight, Zap, Code2, Gamepad2, TrendingUp, Users, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";

/**
 * DESIGN PHILOSOPHY: Cyberpunk Educacional + Glassmorphism
 * - Neon vibrante (cyan, magenta, amarelo)
 * - Glassmorphic panels com backdrop blur
 * - Movimento contínuo (partículas, linhas animadas)
 * - Tipografia ousada (Space Mono, JetBrains Mono)
 * - Asymmetric layout com diagonal cuts
 */

export default function Landing() {
  const [, navigate] = useLocation();

  // Partículas animadas (representam tiles WFC)
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Partículas de fundo */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
            style={{ left: `${p.left}%` }}
            animate={{ y: [0, -400], opacity: [0, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Linhas de conexão (representam BSP) */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-10">
        <motion.line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="url(#gradient)"
          strokeWidth="2"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#FF006E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 backdrop-blur-md bg-background/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            EZ STUDIOS
          </motion.div>
          <nav className="hidden md:flex gap-8 text-sm">
            {["Features", "Trilhas", "Preços", "Docs"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-text-secondary hover:text-primary transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/80 text-background font-bold"
            >
              Entrar
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight uppercase tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Arquitetando o Futuro:{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Da Intenção à Realidade
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-text-secondary mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Soberania intelectual via Motor Procedural Soberano (WFC + BSP). 
              Transforme lógica pura em arquitetura física instantaneamente. 
              Pedagogia científica para a nova elite dev.
            </motion.p>

            <motion.div
              className="flex gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg px-8 py-6 rounded-lg flex items-center gap-2"
              >
                Começar Agora <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-bold text-lg px-8 py-6 rounded-lg"
              >
                Ver Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-12 pt-8 border-t border-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {[
                { label: "Sistema de Rank", value: "Global" },
                { label: "Conquistas (Badges)", value: "50+" },
                { label: "Economia DevEx", value: "Real" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual 3D (Neural Architect Concept) */}
          <motion.div
            className="relative h-96 md:h-full min-h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
            <img 
              src="/assets/hero-architect.png" 
              alt="Neural Architect"
              className="relative z-10 w-full h-full object-contain rounded-3xl shadow-2xl border border-primary/20 hero-mask"
            />
            {/* Overlay de dados flutuantes */}
            <motion.div 
              className="absolute -top-10 -right-10 p-6 glass rounded-2xl hidden lg:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <code className="text-[10px] text-primary">
                PROMPT:// generate.sovereign.city<br/>
                ENGINE:// core.v2.6.0<br/>
                STATUS:// architecture_crystallized
              </code>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Por Que EZ Studios?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Code2,
              title: "Motor Procedural Elite",
              desc: "WFC com Entropia de Shannon + BSP com otimização de streaming",
            },
            {
              icon: Gamepad2,
              title: "Compilador de Intenção",
              desc: "Transforma regras visuais em código Luau automaticamente",
            },
            {
              icon: TrendingUp,
              title: "Pedagogia Científica",
              desc: "Meta-análise 2020-2025 com g=0.46 em cognição",
            },
            {
              icon: Users,
              title: "Comunidade Gamificada",
              desc: "XP, Badges, Leaderboard, Marketplace UGC integrado",
            },
            {
              icon: Star,
              title: "Monetização Integrada",
              desc: "Educação → Motor → UGC → DevEx (4 streams de receita)",
            },
            {
              icon: Zap,
              title: "Performance Extrema",
              desc: "Geração de mapas em <5 segundos, streaming de 4MB chunks",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative p-8 rounded-2xl bg-surface border border-primary/20 hover:border-primary/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:text-secondary transition-colors" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trilhas Section */}
      <section id="trilhas" className="relative z-10 container mx-auto px-4 py-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          4 Trilhas de Aprendizado
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Luau Pro",
              levels: 5,
              color: "from-primary to-secondary",
              desc: "Blocos visuais → Sintaxe → Opcodes → Multithreading → Produção",
              image: "/assets/track-luau.png"
            },
            {
              title: "Mundos",
              levels: 5,
              color: "from-secondary to-accent",
              desc: "WFC visual → Tilesets → WFC Luau → WFC 3D → Monetização",
              image: "/assets/track-worlds.png"
            },
            {
              title: "Dados",
              levels: 5,
              color: "from-accent to-tertiary",
              desc: "Serialização → DataStore → Compressão → Distribuído → Mega",
              image: "/assets/track-data.png"
            },
            {
              title: "Business",
              levels: 5,
              color: "from-tertiary to-primary",
              desc: "UGC básico → 3 itens → Produção em massa → Marketing → CEO",
              image: "/assets/track-business.png"
            },
          ].map((trilha, i) => (
            <motion.div
              key={i}
              className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-300 cursor-pointer group overflow-hidden h-64 flex flex-col justify-end shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={trilha.image} 
                  alt={trilha.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${trilha.color} opacity-80 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors flex items-center gap-2">
                  {trilha.title}
                </h3>
                <p className="text-sm text-gray-200 mb-4 font-medium">{trilha.desc}</p>
                <div className="flex gap-2">
                  {Array.from({ length: trilha.levels }).map((_, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                    >
                      {j + 1}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="preços" className="relative z-10 container mx-auto px-4 py-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Investimento em Soberania
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {[
            {
              name: "Explorer",
              price: "49,90",
              desc: "Para iniciantes na jornada",
              features: ["Acesso à Trilha Luau Pro", "Editor Básico", "10 Gerações/dia", "Suporte da Comunidade"],
              highlight: false,
              color: "border-white/10"
            },
            {
              name: "Architect",
              price: "99,90",
              desc: "O padrão para criadores sérios",
              features: ["Acesso Total (4 Trilhas)", "Motor WFC + BSP Completo", "Hosting Ilimitado", "Acesso ao Marketplace"],
              highlight: true,
              color: "border-primary shadow-[0_0_30px_rgba(0,255,157,0.3)] bg-primary/5"
            },
            {
              name: "Sovereign",
              price: "299,90",
              desc: "Elite com infraestrutura dedicada",
              features: ["Tudo do Architect", "Mentorias Semanais", "Cloud Build Serverless", "Taxa Zero no Marketplace"],
              highlight: false,
              color: "border-accent/50"
            }
          ].map((tier, i) => (
            <motion.div
              key={i}
              className={`relative p-8 rounded-2xl border backdrop-blur-xl ${tier.color} ${tier.highlight ? 'scale-105 z-10' : 'bg-surface/50'} transition-all duration-300 hover:scale-[1.02]`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Recomendado
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl text-text-secondary">R$</span>
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-text-secondary">/mês</span>
              </div>
              <p className="text-sm text-text-secondary mb-8">{tier.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${tier.highlight ? 'bg-primary' : 'bg-white/40'}`} />
                    {feat}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-bold py-6 ${tier.highlight ? 'bg-primary text-background hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                onClick={() => navigate("/dashboard")}
              >
                Escolher {tier.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="p-12 md:p-20 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Junte-se a 1.000+ alunos que já estão aprendendo desenvolvimento de elite no Roblox.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg px-12 py-6 rounded-lg"
          >
            Acessar Dashboard <ArrowRight size={20} />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 backdrop-blur-md bg-background/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-text-secondary text-sm">
          <p>© 2026 EZ Studios. Transformando crianças em desenvolvedoras de elite.</p>
        </div>
      </footer>
    </div>
  );
}
