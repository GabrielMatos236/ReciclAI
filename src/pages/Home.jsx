import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Recycle, MapPin, Trophy, Camera as CameraIcon, LogOut, CheckCircle2, User, ChevronDown } from 'lucide-react'
import { Avatar } from '../components/Avatar'
import { usePerfil } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import Text from '../assets/Text.png'
import { useRef } from 'react'

function Home() {
  const navigate = useNavigate()
  const { perfil } = usePerfil()
  const [totalChamados, setTotalChamados] = useState(0)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function carregarChamados() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { count } = await supabase
        .from('chamados')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id)
      setTotalChamados(count || 0)
    }
    carregarChamados()
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-tr from-blue-950 to-blue-700 px-6 pt-12 pb-24">
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
        <div className="bg-[#4AE273] border-2 border-[#015929] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={30} className="text-[#015929]" strokeWidth={2.5} />
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

      {/* Botões */}
      <div className="px-6 mt-5 flex justify-between gap-3">
        <button onClick={() => navigate('/chamados')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <Trash2 size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Chamados e Ocorrências</span>
        </button>
        <button onClick={() => navigate('/aprenda')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <Recycle size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Aprenda a Reciclar</span>
        </button>
        <button onClick={() => navigate('/mapa')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <MapPin size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Pontos de Descarte</span>
        </button>
        <button onClick={() => navigate('/recompensas')} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1">
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <Trophy size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">Pontos e Prêmios</span>
        </button>
      </div>

      {/* Card SCAN IT */}
      <div className="px-6 mt-5">
        <button
          onClick={() => navigate('/camera')}
          className="w-full bg-white border-2 border-gray-300 rounded-3xl py-8 cursor-pointer hover:border-blue-700 transition flex flex-col items-center gap-2"
        >
          <CameraIcon size={36} className="text-blue-900" strokeWidth={1.5} />
          <span className="text-black text-base font-bold tracking-wide">ESCANEAR DESCARTE</span>
        </button>
      </div>

    </div>
  )
}

export default Home
