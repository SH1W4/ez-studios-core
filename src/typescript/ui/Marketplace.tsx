import { motion } from "framer-motion";
import { ShoppingCart, Star, Download, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

/**
 * DESIGN PHILOSOPHY: Cyberpunk Educacional + Glassmorphism
 * Marketplace de mapas UGC
 */

interface Mapa {
  id: string;
  nome: string;
  autor: string;
  preco: number;
  downloads: number;
  rating: number;
  imagem: string;
  categoria: string;
}

export default function Marketplace() {
  const [, navigate] = useLocation();
  const [filtro, setFiltro] = useState("todos");

  const [mapas] = useState<Mapa[]>([
    {
      id: "1",
      nome: "Dungeon Medieval",
      autor: "Dev Elite #1",
      preco: 49.99,
      downloads: 1250,
      rating: 4.8,
      imagem: "🏰",
      categoria: "dungeon",
    },
    {
      id: "2",
      nome: "Cidade Futurista",
      autor: "Dev Elite #2",
      preco: 79.99,
      downloads: 2100,
      rating: 4.9,
      imagem: "🌃",
      categoria: "cidade",
    },
    {
      id: "3",
      nome: "Arena de Batalha",
      autor: "Dev Elite #3",
      preco: 39.99,
      downloads: 890,
      rating: 4.7,
      imagem: "⚔️",
      categoria: "arena",
    },
    {
      id: "4",
      nome: "Floresta Mágica",
      autor: "Dev Elite #4",
      preco: 59.99,
      downloads: 1560,
      rating: 4.9,
      imagem: "🌲",
      categoria: "natureza",
    },
    {
      id: "5",
      nome: "Caverna de Tesouro",
      autor: "Dev Elite #5",
      preco: 44.99,
      downloads: 1100,
      rating: 4.6,
      imagem: "💎",
      categoria: "dungeon",
    },
    {
      id: "6",
      nome: "Laboratório Sci-Fi",
      autor: "Dev Elite #6",
      preco: 69.99,
      downloads: 1800,
      rating: 4.8,
      imagem: "🔬",
      categoria: "sci-fi",
    },
  ]);

  const categorias = ["todos", "dungeon", "cidade", "arena", "natureza", "sci-fi"];
  const mapasFiltrados =
    filtro === "todos" ? mapas : mapas.filter((m) => m.categoria === filtro);

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
              onClick={() => navigate("/marketplace")}
              className="text-primary"
            >
              Marketplace
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
          <h1 className="text-4xl font-bold mb-4">Marketplace UGC</h1>
          <p className="text-text-secondary">
            Descubra e compre mapas criados pela comunidade. Ganhe receita vendendo seus próprios mapas!
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold mb-4">Categorias</h2>
          <div className="flex flex-wrap gap-3">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${filtro === cat
                    ? "bg-primary text-background"
                    : "bg-white/10 text-text-secondary hover:bg-white/20"
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid de Mapas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mapasFiltrados.map((mapa, i) => (
            <motion.div
              key={mapa.id}
              className="group rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Imagem */}
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {mapa.imagem}
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{mapa.nome}</h3>
                <p className="text-sm text-text-secondary mb-4">por {mapa.autor}</p>

                {/* Stats */}
                <div className="flex gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Download size={14} className="text-primary" />
                    <span>{mapa.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-accent" />
                    <span>{mapa.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-secondary" />
                    <span>Trending</span>
                  </div>
                </div>

                {/* Preço e Botão */}
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    R$ {mapa.preco.toFixed(2)}
                  </div>
                  <Button className="bg-primary hover:bg-primary/80 text-background flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Comprar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA para Vender */}
        <motion.div
          className="p-12 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 backdrop-blur-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Quer Vender Seus Mapas?</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Crie mapas épicos e ganhe receita! Receba 40% de cada venda.
          </p>
          <Button
            onClick={() => navigate("/editor")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg px-12 py-6 rounded-lg"
          >
            Começar a Criar
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
