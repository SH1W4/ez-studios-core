/**
 * Tipos e interfaces principais do Motor Procedural Educacional
 * Contrato de borda: JSON serializable, agnóstico de engine
 */

/**
 * Entidade Procedural: Unificação de tudo que o motor pode gerar
 */
export type ProceduralEntity = MapaGerado | ActorInstance | ItemInstance;

/**
 * Representa um tipo de tile com suas propriedades e regras de adjacência
 */
export interface Tile {
  id: string;
  tipo: "chao" | "parede" | "porta" | "spawn" | "boss" | "loja" | string;
  tags: string[];
  /**
   * Define quais tiles podem ser adjacentes em cada direção
   * Direções: "norte", "sul", "leste", "oeste", "cima", "baixo"
   */
  conexoesPermitidas: {
    direcao: "norte" | "sul" | "leste" | "oeste" | "cima" | "baixo";
    tilesCompatíveis: string[];
  }[];
  /**
   * Probabilidade relativa de colapso (para WFC)
   */
  peso?: number;
}

/**
 * Instância de um tile em uma posição específica do mapa
 */
export interface TileInstance {
  tileId: string;
  x: number;
  y: number;
  z: number; // Coordenada vertical / andares
  /**
   * Metadados adicionais (cor, material, rotação, etc.)
   */
  metadados?: Record<string, any>;
}

/**
 * Ator: Instância de personagem ou NPC gerado proceduralmente
 */
export interface ActorInstance {
  id: string;
  blueprintId: string;
  nome?: string;
  stats: {
    vida: number;
    dano: number;
    velocidade: number;
    inteligencia: number;
  };
  visual: {
    modeloBase: string;
    escala: number;
    cores: Record<string, string>;
    acessorios: string[];
  };
  IA: {
    comportamento: "agressivo" | "passivo" | "neutro" | string;
    percepcao: number;
  };
  metadados: MarketplaceMetadata;
}

/**
 * Item: Instância de equipamento, loot ou consumível gerado
 */
export interface ItemInstance {
  id: string;
  blueprintId: string;
  tipo: "arma" | "armadura" | "consumivel" | "cosmetico" | string;
  raridade: "comum" | "raro" | "epico" | "lendario" | "mitico";
  stats: Record<string, number>;
  efeitos: string[];
  metadados: MarketplaceMetadata;
}

/**
 * Blueprint: O "genoma" ou template para geração de entidades
 */
export interface Blueprint {
  id: string;
  categoria: "Actor" | "Item" | "Quest";
  regras: Regra[];
  limites: {
    minStats: Record<string, number>;
    maxStats: Record<string, number>;
  };
}

/**
 * Metadados para Marketplace e NFT
 */
export interface MarketplaceMetadata {
  autorId: string;
  seed: string;
  criadoEm: string;
  hashGeracao: string; // Prova de autenticidade Entropia Zero
  colecao?: string;
  tags: string[];
  versaoMotor: string;
  estetica?: "Quantum" | "Realistic" | "Cybernetic" | "LowPoly" | string;
  nivelDetalhe?: number; // 1-5
}

/**
 * Setor: divisão volumétrica do espaço (cuboide, resultado de BSP 3D)
 */
export interface Setor {
  id: string;
  bounds: {
    x: number;
    y: number;
    z: number;
    largura: number;
    altura: number;
    profundidade: number;
  };
  tipo: "spawn" | "hub" | "sala" | "boss" | "loja" | string;
  /**
   * Tiles que pertencem a este setor
   */
  tileIds?: string[];
  metadados?: Record<string, any>;
}

/**
 * Regra: define comportamento procedural
 */
export interface Regra {
  id: string;
  categoria: "Mapa" | "Actor" | "Item" | "Progressao" | "Economia";
  /**
   * Condições que devem ser atendidas
   */
  condicoes: Record<string, any>;
  /**
   * Ações a executar quando condições são atendidas
   */
  acoes: Record<string, any>;
  /**
   * Prioridade de execução (maior = primeiro)
   */
  prioridade?: number;
}

/**
 * Intenção: descrição de alto nível do que o usuário quer gerar
 */
export interface Intencao {
  id: string;
  categoria: "Mapa" | "Actor" | "Item" | "Quest" | string;
  /**
   * Descrição natural da intenção (para logging e debug)
   */
  descricaoNatural: string;
  /**
   * Parâmetros específicos da categoria
   */
  parametros: Record<string, any>;
  /**
   * Metadados IA e contextuais
   */
  metadados?: MarketplaceMetadata;
}

/**
 * Mapa gerado: resultado completo da geração procedural
 */
export interface MapaGerado {
  id: string;
  seed: string;
  /**
   * Dimensões do mapa
   */
  dimensoes: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  /**
   * Setores criados por BSP
   */
  setores: Setor[];
  /**
   * Todas as instâncias de tiles no mapa
   */
  tiles: TileInstance[];
  /**
   * Metadados sobre a geração
   */
  metadados: MarketplaceMetadata & {
    stats?: {
      numSetores: number;
      numTiles: number;
      densidade?: number;
      tempoGeracaoMs?: number;
      estetica?: string;
      [key: string]: any;
    };
  };
}

/**
 * Plano de geração: resultado completo do compilador
 */
export interface PlanoDeGeracao {
  intencao: Intencao;
  regras: Regra[];
  resultado: ProceduralEntity;
  /**
   * Código gerado para a engine alvo (ex: Luau para Roblox)
   */
  codigoGerado: string;
  logs: LogEntrada[];
}

/**
 * Metadados para a geração em si (não para o marketplace)
 */
export interface MetadadosGeracao {
  hashGeracao: string;
  timestamp: number;
  versaoEngine: string;
  estetica?: "Quantum" | "Realistic" | "Cybernetic" | "LowPoly";
  nivelDetalhe?: number; // 1-5
}

/**
 * Entrada de log padronizada
 */
export interface LogEntrada {
  timestamp: string;
  studentId?: string;
  intentId: string;
  categoria: Intencao["categoria"];
  engineAlvo: "Roblox" | "Unity" | "Godot" | "Marketplace" | string;
  seed: string;
  buildStatus: "success" | "error" | "warning" | string;
  errorType?: string;
  errorMessage?: string;
  duracao?: number | string;
  stats?: { numSetores: number; numTiles: number; estetica?: string;[key: string]: any };
}

/**
 * Configuração para WFC 3D
 */
export interface ConfigWFC {
  largura: number;
  altura: number;
  profundidade: number;
  tiles: Tile[];
  /**
   * Distribuição inicial: "uniforme" ou ponderada por peso
   */
  distribuicao?: "uniforme" | "ponderada";
  /**
   * Máximo de tentativas antes de falhar
   */
  maxTentativas?: number;
}

/**
 * Configuração para BSP 3D
 */
export interface ConfigBSP {
  largura: number;
  altura: number;
  profundidade: number;
  /**
   * Profundidade máxima da árvore de recursão
   */
  profundidadeMaxima: number;
  /**
   * Tamanho mínimo de uma sala em qualquer dimensão
   */
  tamanhoMinimoSala: number;
}

/**
 * Nó da árvore BSP 3D
 */
export interface BspNode {
  id: string;
  bounds: {
    x: number;
    y: number;
    z: number;
    largura: number;
    altura: number;
    profundidade: number;
  };
  /**
   * Direção de divisão: "horizontal" (Y), "vertical" (X) ou "profundidade" (Z)
   */
  direcao?: "horizontal" | "vertical" | "profundidade";
  esquerda?: BspNode;
  direita?: BspNode;
  /**
   * Se é folha, contém o setor
   */
  setor?: Setor;
}

/**
 * Grid para WFC 3D
 */
export interface GridWFC {
  largura: number;
  altura: number;
  profundidade: number;
  /**
   * Cada célula contém um conjunto de possíveis tile IDs
   * Estrutura: [x][y][z]
   */
  celulas: Set<string>[][][];
  /**
   * Entropia de Shannon para cada célula
   */
  entropias: number[][][];
  /**
   * Se célula foi colapsada
   */
  colapsadas: boolean[][][];
}

/**
 * Resultado de uma tentativa de colapso WFC
 */
export interface ResultadoColapso {
  gridAtualizado: GridWFC;
  status: "ok" | "contradiction" | "completo";
  posicaoColapsada?: { x: number; y: number; z: number };
}

/**
 * Erro padrão de contradição WFC
 */
export class ContradictionError extends Error {
  constructor(
    public posicao: { x: number; y: number; z: number },
    public tilesImpossíveis: string[],
    message?: string
  ) {
    super(
      message ||
      `Contradição em WFC na posição (${posicao.x}, ${posicao.y}, ${posicao.z}): nenhum tile válido`
    );
    this.name = "ContradictionError";
  }
}
