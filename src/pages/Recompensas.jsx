import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal, Star, Gift, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '../services/supabase'
import { usePerfil } from '../contexts/AuthContext'

function Recompensas() {
  const navigate = useNavigate()
  const { atualizarPerfil } = usePerfil()

  const [ranking, setRanking] = useState([])
  const [meuPerfil, setMeuPerfil] = useState(null)
  const [minhaPos, setMinhaPos] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Loja de resgate
  const [premios, setPremios] = useState([])
  const [resgatando, setResgatando] = useState(null)
  const [resgatadoId, setResgatadoId] = useState(null)
  const [erroResgate, setErroResgate] = useState(null)

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

      // Prêmios da loja, do mais barato pro mais caro
      const { data: premiosData, error: premiosError } = await supabase
        .from('premios')
        .select('*')
        .order('pontos', { ascending: true })

      if (premiosError) {
        console.error('Erro ao carregar prêmios:', premiosError)
      } else {
        setPremios(premiosData || [])
      }

      setCarregando(false)
    }

    carregar()
  }, [])

  // Resgata um prêmio: desconta os pontos do perfil no Supabase
  // e atualiza tanto o estado local quanto o AuthContext global.
  async function resgatar(premio) {
    if (!meuPerfil || (meuPerfil.pontos || 0) < premio.pontos) return

    setErroResgate(null)
    setResgatando(premio.id)

    const novosPontos = meuPerfil.pontos - premio.pontos

    const { error } = await supabase
      .from('perfis')
      .update({ pontos: novosPontos })
      .eq('id', meuPerfil.id)

    setResgatando(null)

    if (error) {
      console.error(error)
      setErroResgate('Erro ao resgatar prêmio. Tente novamente.')
      return
    }

    setMeuPerfil(prev => ({ ...prev, pontos: novosPontos }))
    atualizarPerfil({ pontos: novosPontos })

    setResgatadoId(premio.id)
    setTimeout(() => setResgatadoId(prev => prev === premio.id ? null : prev), 2000)
  }

  function iconePos(pos) {
    if (pos === 1) return <Trophy size={20} className="text-yellow-500" />
    if (pos === 2) return <Medal  size={20} className="text-gray-400"   />
    if (pos === 3) return <Medal  size={20} className="text-amber-700"  />
    return <span className="text-gray-400 font-bold text-sm w-5 text-center">{pos}</span>
  }

  function bgPos(pos, ehEu) {
    if (ehEu) return 'bg-[#4AE273] border-2 border-[#015929]'
    if (pos === 1) return 'bg-yellow-50 border border-yellow-200'
    if (pos === 2) return 'bg-gray-50 border border-gray-200'
    if (pos === 3) return 'bg-amber-50 border border-amber-200'
    return 'bg-white border border-gray-100'
  }

  const NIVEIS = [
    { nome: 'Iniciante',     min: 0,    max: 499,      cor: 'bg-amber-200',  texto: 'text-amber-900' },
    { nome: 'Consciente',    min: 500,  max: 1499,     cor: 'bg-slate-200',  texto: 'text-slate-700' },
    { nome: 'Reciclador',    min: 1500, max: 3499,     cor: 'bg-yellow-200', texto: 'text-yellow-800' },
    { nome: 'Ecologista',    min: 3500, max: 6999,     cor: 'bg-zinc-100 border border-zinc-300', texto: 'text-zinc-700' },
    { nome: 'Ambientalista', min: 7000, max: Infinity, cor: 'bg-gradient-to-r from-cyan-100 via-slate-100 to-blue-200 border border-blue-200', texto: 'text-blue-900' },
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
                    className="h-full bg-[#4AE273] rounded-full transition-all"
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

          {/* Loja de resgate */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Gift size={18} className="text-blue-900" />
              <p className="text-blue-900 font-bold text-base">Loja de Resgate</p>
            </div>

            {erroResgate && (
              <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-3 text-sm">
                {erroResgate}
              </div>
            )}

            {premios.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Nenhum prêmio disponível no momento.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {premios.map((premio) => {
                  const meusPontos   = meuPerfil?.pontos || 0
                  const podeResgatar = meusPontos >= premio.pontos
                  const estaResgatando = resgatando === premio.id
                  const foiResgatado   = resgatadoId === premio.id

                  return (
                    <div
                      key={premio.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col"
                    >
                      <div className="bg-gray-50 aspect-square flex items-center justify-center p-4">
                        <img
                          src={premio.imagem_url}
                          alt={premio.nome}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="p-3 flex flex-col gap-2 flex-1">
                        <p className="text-blue-900 font-bold text-sm leading-tight">
                          {premio.nome}
                        </p>

                        {premio.descricao && (
                          <p className="text-gray-500 text-xs leading-snug">
                            {premio.descricao}
                          </p>
                        )}

                        <span className="self-start bg-[#4AE273] text-[#015929] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} />
                          {premio.pontos} pts
                        </span>

                        <button
                          onClick={() => resgatar(premio)}
                          disabled={!podeResgatar || estaResgatando}
                          className={`mt-auto w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition ${
                            foiResgatado
                              ? 'bg-emerald-500 text-white cursor-default'
                              : !podeResgatar
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-900 text-white cursor-pointer hover:bg-blue-800'
                          }`}
                        >
                          {estaResgatando ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : foiResgatado ? (
                            <>
                              <CheckCircle2 size={16} />
                              Resgatado!
                            </>
                          ) : !podeResgatar ? (
                            'Pontos insuficientes'
                          ) : (
                            'Resgatar'
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

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
                        {usuario.nome} {ehEu && <span className="text-[#015929] text-xs">(você)</span>}
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

    </div>
  )
}

export default Recompensas
