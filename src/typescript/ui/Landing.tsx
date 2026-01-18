import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Zap, 
  Code2, 
  Gamepad2, 
  TrendingUp, 
  Users, 
  Star,
  Sparkles,
  ChevronRight,
  X,
  Trophy,
  Lock,
  CheckCircle2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

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
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const QUESTS = [
    {
      title: "Academia de Magia (Luau)",
      levels: [
        { name: "Pergaminho Inicial", goal: "Variáveis e Tipos", icon: "scroll" },
        { name: "Cânticos de Repetição", goal: "Loops e Iterações", icon: "repeat" },
        { name: "Poções de Condição", goal: "Lógica Booleana", icon: "flask" },
        { name: "Rituais de Evento", goal: "Signals e Callbacks", icon: "zap" },
        { name: "Mestre dos Feitiços", goal: "Metatables e Otimização", icon: "crown" },
      ]
    },
    {
      title: "Poder de Criar Mundos",
      levels: [
        { name: "Primeira Peça Lego", goal: "Introdução ao WFC", icon: "box" },
        { name: "Mapa das Possibilidades", goal: "Regras de Adjacência", icon: "map" },
        { name: "Caixa de Presente Infinita", goal: "Introdução ao BSP", icon: "gift" },
        { name: "Arquiteto de Labirintos", goal: "Salas e Corredores", icon: "layout" },
        { name: "Deus Ex Machina", goal: "Cidades e Streaming", icon: "city" },
      ]
    },
    {
      title: "Cofre do Guardião",
      levels: [
        { name: "Mochila do Aventureiro", goal: "DataStore e Inventário", icon: "backpack" },
        { name: "Selo de Segurança", goal: "Validação Server-Side", icon: "shield" },
        { name: "Cadeado do Mestre", goal: "Criptografia", icon: "lock" },
        { name: "Caça ao Tesouro Maligno", goal: "Auditoria de Backdoors", icon: "search" },
        { name: "Guardião Supremo", goal: "Nuvem Distribuída", icon: "cloud" },
      ]
    },
    {
      title: "Magnata dos Games",
      levels: [
        { name: "Moeda de Troca", goal: "EZ Neural Credits (ENC)", icon: "coins" },
        { name: "Vitrine de Ouro", goal: "Marketplace UGC", icon: "shopping-bag" },
        { name: "Contrato de Aluguel", goal: "Assinaturas e Passes", icon: "file-text" },
        { name: "Império de Ativos", goal: "Economia Global", icon: "trending-up" },
        { name: "Soberano Virtual", goal: "DevEx e Gestão", icon: "landmark" },
      ]
    }
  ];

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
                ENGINE:// core.v2.7.0<br/>
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
              title: "O Enigma de Lego",
              desc: "Mundos criados como quebra-cabeças que se encaixam sozinhos, guiados pelo seu gênio criativo.",
            },
            {
              icon: Gamepad2,
              title: "O Cérebro do Herói",
              desc: "Transforme seus pensamentos e comandos de voz em realidade digital instantaneamente.",
            },
            {
              icon: TrendingUp,
              title: "Academia de Magia Decodificada",
              desc: "Um caminho de aprendizado baseado na ciência, onde programar vira diversão pura e poder real.",
            },
            {
              icon: Users,
              title: "Comunidade de Criadores",
              desc: "Ganhe XP, conquiste badges e suba no rank enquanto constrói seu império digital.",
            },
            {
              icon: Star,
              title: "Jornada do Magnata Digital",
              desc: "Aprenda, crie e lucre. O EZ Studios é o primeiro passo para sua soberania no metaverso.",
            },
            {
              icon: Zap,
              title: "Velocidade do Pensamento",
              desc: "Geração de mundos em segundos, otimizada para ser leve, fluida e instantânea.",
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
              title: "Academia de Magia (Luau)",
              levels: 5,
              color: "from-primary to-secondary",
              desc: "Aprenda feitiços de código para dar vida aos objetos e dominar o metaverso.",
              image: "/assets/track-luau.png"
            },
            {
              title: "Poder de Criar Mundos",
              levels: 5,
              color: "from-secondary to-accent",
              desc: "Construa labirintos e cidades épicas usando lógica procedural de elite.",
              image: "/assets/track-worlds.png"
            },
            {
              title: "Cofre do Guardião",
              levels: 5,
              color: "from-accent to-tertiary",
              desc: "Serialização → DataStore → Compressão → Distribuído → Mega",
              image: "/assets/track-data.png"
            },
            {
              title: "Magnata dos Games",
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTrack(i)}
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
              features: ["Acesso à Trilha Luau Pro", "Editor Básico", "100 Neural Credits (ENC)", "Suporte da Comunidade"],
              highlight: false,
              color: "border-white/10"
            },
            {
              name: "Architect",
              price: "99,90",
              desc: "O padrão para criadores sérios",
              features: ["Acesso Total (4 Trilhas)", "Motor WFC + BSP Completo", "1.000 Neural Credits (ENC)", "Hosting & Marketplace Global"],
              highlight: true,
              color: "border-primary shadow-[0_0_30px_rgba(0,255,157,0.3)] bg-primary/5"
            },
            {
              name: "Sovereign",
              price: "299,90",
              desc: "Elite com infraestrutura dedicada",
              features: ["Tudo do Architect", "5.000 Neural Credits (ENC)", "Cloud Build Serverless", "Mentorias & Taxa Zero"],
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

      {/* Quest Preview Modal */}
      <AnimatePresence>
        {selectedTrack !== null && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-blue/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-2xl glass rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="relative h-32 flex items-center px-8 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r opacity-20 ${
                  selectedTrack === 0 ? "from-primary to-secondary" :
                  selectedTrack === 1 ? "from-secondary to-accent" :
                  selectedTrack === 2 ? "from-accent to-tertiary" :
                  "from-tertiary to-primary"
                }`} />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold text-core-green uppercase tracking-[0.3em] mb-2 block">Visualização de Jornada</span>
                  <h3 className="text-2xl font-bold">{QUESTS[selectedTrack].title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTrack(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content - The Quest Tree */}
              <div className="p-8 space-y-6">
                <div className="relative">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/10" />
                  
                  <div className="space-y-8">
                    {QUESTS[selectedTrack].levels.map((level, idx) => (
                      <motion.div 
                        key={idx}
                        className="relative flex items-center gap-6 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {/* Node */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${idx === 0 
                            ? "bg-core-green border-core-green text-void-blue shadow-[0_0_15px_rgba(0,255,157,0.5)]" 
                            : "bg-void-blue border-white/10 text-white/30"
                          }`}
                        >
                          {idx === 0 ? <Sparkles size={16} /> : <Lock size={14} />}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <div className={`text-[10px] font-bold uppercase tracking-widest mb-0.5
                            ${idx === 0 ? "text-core-green" : "text-white/20"}`}
                          >
                            Nível {idx + 1}
                          </div>
                          <div className={`text-sm font-bold ${idx === 0 ? "text-white" : "text-white/40"}`}>
                            {level.name}
                          </div>
                          <div className="text-xs text-muted-foreground/60 italic">
                            {level.goal}
                          </div>
                        </div>

                        {/* Reward tag for the last level */}
                        {idx === 4 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[9px] font-bold text-yellow-500 uppercase tracking-widest">
                            <Trophy size={10} /> Recompensa Mestre
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <Button 
                    className="flex-1 h-12 bg-core-green text-void-blue font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]"
                    onClick={() => navigate("/dashboard")}
                  >
                    Começar Jornada
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-white/10 text-white/50 hover:text-white"
                    onClick={() => setSelectedTrack(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
