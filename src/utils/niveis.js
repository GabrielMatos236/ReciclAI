// ============================================
// SINGLE SOURCE OF TRUTH — Níveis de reciclagem
// ============================================
// Usado na Home (selo de nível no card) e em Recompensas
// (card de progresso + tabela de níveis). Se um dia mudar
// faixa de pontos, nome ou cor de um nível, muda só AQUI.

export const NIVEIS = [
  { nome: 'Iniciante',     min: 0,    max: 499,      cor: 'bg-orange-300',  texto: 'text-orange-900' },
  { nome: 'Consciente',    min: 500,  max: 1499,     cor: 'bg-slate-200',  texto: 'text-slate-700' },
  { nome: 'Reciclador',    min: 1500, max: 3499,     cor: 'bg-yellow-200', texto: 'text-yellow-800' },
  { nome: 'Ecologista',    min: 3500, max: 6999,     cor: 'bg-zinc-100 border border-zinc-300', texto: 'text-zinc-700' },
  { nome: 'Ambientalista', min: 7000, max: Infinity, cor: 'bg-gradient-to-r from-cyan-100 via-slate-100 to-blue-200 border border-blue-200', texto: 'text-blue-900' },
]

// Retorna o nível atual com base na pontuação
export function nivelAtual(pontos) {
  return NIVEIS.find(n => pontos >= n.min && pontos <= n.max) || NIVEIS[0]
}

// Retorna o próximo nível (ou null se já estiver no nível máximo)
export function proximoNivel(pontos) {
  const idx = NIVEIS.findIndex(n => pontos >= n.min && pontos <= n.max)
  return idx < NIVEIS.length - 1 ? NIVEIS[idx + 1] : null
}
