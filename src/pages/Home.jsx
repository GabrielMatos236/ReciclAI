import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Recycle, MapPin, Trophy, Camera as CameraIcon, LogOut, AlertTriangle } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'
import { supabase } from '../services/supabase'
import Text from '../assets/Text.png'

function Home() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarPerfil() {
      // Pega o usuário autenticado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setCarregando(false)
        return
      }

      // Busca o perfil dele na tabela 'perfis'
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil:', error)
      } else {
        setPerfil(data)
      }

      setCarregando(false)
    }

    carregarPerfil()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-purple-900 font-semibold">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      
      {/* Header roxo */}
      <div className="bg-purple-900 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <img src={Text} alt="ReciclAI" className="h-8" />
          <button 
            onClick={handleLogout}
            className="bg-purple-700 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition"
            title="Sair"
          >
            <LogOut size={24} className="text-white" />
          </button>
        </div>
        
        <h2 className="text-white text-2xl font-bold">
          Olá, {perfil?.nome || 'Usuário'}!
        </h2>
      </div>
      
      {/* Card de pontos */}
      <div className="px-6 -mt-4">
        <div className="bg-green-300 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-purple-900 text-xl font-bold">Seus Pontos</h3>
            <button className="bg-purple-900 text-white text-sm px-4 py-1 rounded-full cursor-pointer flex items-center gap-1">
              Histórico <Trophy size={14} />
            </button>
          </div>
          
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p className="text-purple-900 text-sm">Reciclados</p>
              <p className="text-purple-900 text-3xl font-bold">0</p>
            </div>
            <div className="w-px h-12 bg-purple-900 opacity-30"></div>
            <div className="text-center">
              <p className="text-purple-900 text-sm">Pontos</p>
              <p className="text-purple-900 text-3xl font-bold">{perfil?.pontos || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões de atalho */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        <button className="bg-green-300 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-green-400 transition">
          <Recycle size={28} className="text-purple-900" />
          <span className="text-purple-900 text-xs font-semibold text-center">Aprenda a Reciclar</span>
        </button>
        
        <button className="bg-green-300 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-green-400 transition">
          <MapPin size={28} className="text-purple-900" />
          <span className="text-purple-900 text-xs font-semibold text-center">Pontos de Coleta</span>
        </button>
        
        <button className="bg-green-300 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-green-400 transition">
          <Trophy size={28} className="text-purple-900" />
          <span className="text-purple-900 text-xs font-semibold text-center">Recompensas</span>
        </button>

        <button onClick={() => navigate("/chamados")} className="bg-green-300 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-green-400 transition">
          <AlertTriangle size={28} className="text-purple-900" />
          <span className="text-purple-900 text-xs font-semibold text-center">Solicitar Manutenção</span>
        </button>
      </div>
      
      {/* Card grande "Analisar descarte" */}
      <div className="px-6 mt-6">
        <button 
          onClick={() => navigate('/camera')}
          className="w-full bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 cursor-pointer hover:shadow-xl transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-4">
              <CameraIcon size={40} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Analisar Descarte</h3>
              <p className="text-green-100 text-sm">Use a câmera e descubra a lixeira certa</p>
            </div>
          </div>
        </button>
      </div>
      <BarraNavegacao />
    </div>
  )
}

export default Home