export interface Anuncio {
  id: number;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  imagemUrl?: string;
  linkDestino?: string;
  textoBotao?: string;
  posicao: string;
  ativo: boolean;
  ordem: number;
  dataInicio?: string;
  dataFim?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateAnuncio {
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  imagemUrl?: string;
  linkDestino?: string;
  textoBotao?: string;
  posicao: string;
  ativo: boolean;
  ordem: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface AreaAtuacao {
  id: number;
  nome: string;
  descricao: string;
  icone?: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
}

export interface Depoimento {
  id: number;
  nome: string;
  texto: string;
  avaliacao: number;
  cargo?: string;
  ativo: boolean;
  ordem: number;
  criadoEm: string;
}

export interface Contato {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
  status: string;
  lido: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateContato {
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
}

export interface Orcamento {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  areaAtuacao: string;
  descricao: string;
  status: string;
  lido: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateOrcamento {
  nome: string;
  email: string;
  telefone?: string;
  areaAtuacao: string;
  descricao: string;
}

export interface Conversa {
  id: number;
  nomeCliente: string;
  emailCliente: string;
  telefone?: string;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
  totalMensagens: number;
  mensagensNaoLidas: number;
  ultimaMensagem?: MensagemChat;
}

export interface MensagemChat {
  id: number;
  conversaId: number;
  texto: string;
  remetente: string;
  lida: boolean;
  criadoEm: string;
}

export interface IniciarConversa {
  nomeCliente: string;
  emailCliente: string;
  telefone?: string;
  mensagemInicial: string;
}

export interface EnviarMensagem {
  texto: string;
  remetente: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  perfil: string;
  expiracao: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

// ============ QUEM SOMOS ============
export interface QuemSomos {
  id: number;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateQuemSomos {
  titulo: string;
  subtitulo?: string;
  descricao: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
}

// ============ SOBRE DOUTORA ============
export interface SobreDoutora {
  id: number;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateSobreDoutora {
  titulo: string;
  subtitulo?: string;
  descricao: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
}

// ============ SERVICO ============
export interface Servico {
  id: number;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  icone?: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateServico {
  titulo: string;
  subtitulo?: string;
  descricao: string;
  icone?: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
}

// ============ CONFIGURACAO SITE ============
export interface ConfiguracaoSite {
  id: number;
  chave: string;
  valor: string;
  descricao?: string;
  atualizadoEm: string;
}

export interface CreateConfiguracaoSite {
  chave: string;
  valor: string;
  descricao?: string;
}

// ============ IMAGEM HERO ============
export interface ImagemHero {
  id: number;
  imagemUrl: string;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateImagemHero {
  imagemUrl: string;
  ativo: boolean;
}

// ============ CREATE AREA ATUACAO ============
export interface CreateAreaAtuacao {
  nome: string;
  descricao: string;
  icone?: string;
  imagemUrl?: string;
  ordem: number;
  ativo: boolean;
}

// ============ CREATE DEPOIMENTO ============
export interface CreateDepoimento {
  nome: string;
  texto: string;
  avaliacao: number;
  cargo?: string;
  ativo: boolean;
  ordem: number;
}
