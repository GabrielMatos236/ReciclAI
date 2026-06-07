import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'
import { supabase } from '../services/supabase'

function Recompensas() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [meuPerfil, setMeuPerfil] = useState(null)
  const [minhaPos, setMinhaPos] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()

      // Top 20 por pontos
      const { data: top } = await supabase
        .from('perfis')
        .select('id, nome, pontos')
        .eq('tipo', 'usuario')
        .order('pontos', { ascending: false })
        .limit(20)

      setRanking(top || [])

      if (user && top) {
        const pos = top.findIndex(p => p.id === user.id)
        setMinhaPos(pos !== -1 ? pos + 1 : null)
        setMeuPerfil(top.find(p => p.id === user.id) || null)

        // Se o usuário não está no top 20, busca separado
        if (pos === -1) {
          const { data: eu } = await supabase
            .from('perfis')
            .select('id, nome, pontos')
            .eq('id', user.id)
            .single()
          setMeuPerfil(eu)
        }
      }

      setCarregando(false)
    }

    carregar()
  }, [])

  function iconePos(pos) {
    if (pos === 1) return <Trophy size={20} className="text-yellow-500" />
    if (pos === 2) return <Medal  size={20} className="text-gray-400"   />
    if (pos === 3) return <Medal  size={20} className="text-amber-700"  />
    return <span className="text-gray-400 font-bold text-sm w-5 text-center">{pos}</span>
  }

  function bgPos(pos, ehEu) {
    if (ehEu) return 'bg-emerald-100 border border-emerald-300'
    if (pos === 1) return 'bg-yellow-50 border border-yellow-200'
    if (pos === 2) return 'bg-gray-50 border border-gray-200'
    if (pos === 3) return 'bg-amber-50 border border-amber-200'
    return 'bg-white border border-gray-100'
  }

  const NIVEIS = [
    { nome: 'Iniciante',   min: 0,   max: 49,  cor: 'bg-gray-200',   texto: 'text-gray-700' },
    { nome: 'Reciclador',  min: 50,  max: 149, cor: 'bg-green-200',  texto: 'text-green-800' },
    { nome: 'Guardião',    min: 150, max: 349, cor: 'bg-blue-200',   texto: 'text-blue-800' },
    { nome: 'Eco-Herói',   min: 350, max: 699, cor: 'bg-purple-200', texto: 'text-purple-800' },
    { nome: 'Lenda Verde', min: 700, max: Infinity, cor: 'bg-emerald-300', texto: 'text-emerald-900' },
  ]

  function nivelAtual(pontos) {
    return NIVEIS.find(n => pontos >= n.min && pontos <= n.max) || NIVEIS[0]
  }

  function proximoNivel(pontos) {
    const idx = NIVEIS.findIndex(n => pontos >= n.min && pontos <= n.max)
    return idx < NIVEIS.length - 1 ? NIVEIS[idx + 1] : null
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center relative">
        <button
          onClick={() => navigate('/home')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-800/60 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold tracking-wide">Recompensas</h1>
        <p className="text-blue-200 text-xs mt-1 opacity-80">Ranking de recicladores</p>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center pt-16">
          <p className="text-blue-900 font-semibold">Carregando ranking...</p>
        </div>
      ) : (
        <div className="px-4 pt-5 flex flex-col gap-4">

          {/* Card do meu nível */}
          {meuPerfil && (() => {
            const nivel = nivelAtual(meuPerfil.pontos || 0)
            const proximo = proximoNivel(meuPerfil.pontos || 0)
            const progresso = proximo
              ? Math.min(100, Math.round(((meuPerfil.pontos - nivel.min) / (proximo.min - nivel.min)) * 100))
              : 100

            return (
              <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">Seu nível</p>
                    <p className="text-blue-900 font-bold text-xl">{meuPerfil.pontos || 0} pontos</p>
                  </div>
                  <span className={`${nivel.cor} ${nivel.texto} px-3 py-1.5 rounded-2xl text-sm font-bold flex items-center gap-1.5`}>
                    <Star size={14} />
                    {nivel.nome}
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1.5">
                  {proximo
                    ? `${proximo.min - (meuPerfil.pontos || 0)} pontos para ${proximo.nome}`
                    : 'Nível máximo atingido! 🎉'}
                </p>

                {minhaPos && (
                  <p className="text-blue-700 text-xs font-semibold mt-2">
                    Você está em {minhaPos}º lugar no ranking
                  </p>
                )}
              </div>
            )
          })()}

          {/* Tabela de níveis */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200">
            <p className="text-blue-900 font-bold text-sm mb-3">Tabela de níveis</p>
            <div className="flex flex-col gap-2">
              {NIVEIS.map((n) => (
                <div key={n.nome} className="flex items-center justify-between">
                  <span className={`${n.cor} ${n.texto} px-3 py-1 rounded-full text-xs font-bold`}>{n.nome}</span>
                  <span className="text-gray-500 text-xs">
                    {n.max === Infinity ? `${n.min}+ pts` : `${n.min}–${n.max} pts`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div>
            <p className="text-blue-900 font-bold text-base mb-2 px-1">🏆 Top Recicladores</p>
            <div className="flex flex-col gap-2">
              {ranking.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-6">Nenhum usuário no ranking ainda.</p>
              )}
              {ranking.map((usuario, idx) => {
                const pos  = idx + 1
                const ehEu = usuario.id === meuPerfil?.id
                return (
                  <div
                    key={usuario.id}
                    className={`${bgPos(pos, ehEu)} rounded-2xl px-4 py-3 flex items-center gap-3`}
                  >
                    <div className="w-7 flex items-center justify-center flex-shrink-0">
                      {iconePos(pos)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-blue-900 font-semibold text-sm truncate">
                        {usuario.nome} {ehEu && <span className="text-emerald-600 text-xs">(você)</span>}
                      </p>
                    </div>
                    <p className="text-blue-900 font-bold text-sm flex-shrink-0">
                      {usuario.pontos || 0} pts
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      <BarraNavegacao />
    </div>
  )
}

export default Recompensas
