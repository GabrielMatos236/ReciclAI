import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Recycle, MapPin, Trophy, Camera as CameraIcon, LogOut, CheckCircle2, User, ChevronDown } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'
import { Avatar } from '../components/Avatar'
import { supabase } from '../services/supabase'
import Text from '../assets/Text.png'

function Home() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [totalChamados, setTotalChamados] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setCarregando(false); return }

      const [{ data: perfilData }, { count }] = await Promise.all([
        supabase.from('perfis').select('*').eq('id', user.id).single(),
        supabase.from('chamados').select('*', { count: 'exact', head: true }).eq('usuario_id', user.id)
      ])

      if (perfilData) setPerfil(perfilData)
      setTotalChamados(count || 0)
      setCarregando(false)
    }
    carregarDados()
  }, [])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-blue-900 font-semibold">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 px-6 pt-12 pb-24">
        <div className="flex justify-between items-center mb-8">
          <img src={Text} alt="ReciclAI" className="h-10" />

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownAberto(p => !p)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Avatar nome={perfil?.nome} avatarUrl={perfil?.avatar_url} tamanho={38} />
              <ChevronDown
                size={14}
                className="text-white/70 transition-transform"
                style={{ transform: dropdownAberto ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownAberto && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[160px] border border-gray-100">
                <button
                  onClick={() => { setDropdownAberto(false); navigate('/perfil') }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                >
                  <User size={16} className="text-blue-700" />
                  <span className="text-blue-900 text-sm font-semibold">Meu Perfil</span>
                </button>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={16} className="text-red-500" />
                  <span className="text-red-500 text-sm font-semibold">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-white text-lg font-semibold ml-4">
          olá, {perfil?.nome?.split(' ')[0] || 'Usuário'}!
        </h2>
      </div>

      {/* Card de stats */}
      <div className="px-6 -mt-14">
        <div className="bg-emerald-200 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={30} className="text-blue-900" strokeWidth={2.5} />
            <div className="flex-1 h-px bg-blue-900 opacity-40"></div>
          </div>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p className="text-blue-900 text-xs">Chamados</p>
              <p className="text-blue-900 text-2xl font-bold">{totalChamados}</p>
            </div>
            <div className="w-px h-9 bg-blue-900 opacity-30"></div>
            <div className="text-center">
              <p className="text-blue-900 text-xs">Pontos</p>
              <p className="text-blue-900 text-2xl font-bold">{perfil?.pontos || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de funcionalidades */}
      <div className="px-6 mt-5 flex justify-between gap-3">
        <button onClick={() => navigate('/chamados')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-emerald-200 rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:bg-emerald-300 transition">
            <Trash2 size={24} className="text-black" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Abrir Chamado</span>
        </button>

        <button onClick={() => navigate('/aprenda')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-emerald-200 rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:bg-emerald-300 transition">
            <Recycle size={24} className="text-black" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Aprenda a Reciclar</span>
        </button>

        <button onClick={() => navigate('/mapa')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-emerald-200 rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:bg-emerald-300 transition">
            <MapPin size={24} className="text-black" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Pontos de Descarte</span>
        </button>

        <button onClick={() => navigate('/recompensas')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-emerald-200 rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:bg-emerald-300 transition">
            <Trophy size={24} className="text-black" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Recompensas</span>
        </button>
      </div>

      {/* Card SCAN IT */}
      <div className="px-6 mt-5">
        <button
          onClick={() => navigate('/camera')}
          className="w-full bg-white border-2 border-gray-300 rounded-3xl py-8 cursor-pointer hover:border-blue-700 transition flex flex-col items-center gap-2"
        >
          <CameraIcon size={36} className="text-black" strokeWidth={1.5} />
          <span className="text-black text-base font-bold tracking-wide">ESCANEAR DESCARTE</span>
        </button>
      </div>

      <BarraNavegacao />
    </div>
  )
}

export default Home
