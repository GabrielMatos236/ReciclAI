import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardList, MapPin, LogOut, CheckCircle, Clock } from "lucide-react"
import { supabase } from "../services/supabase"
import Text from "../assets/Text.png"

function FuncionarioHome() {
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [pendentes, setPendentes] = useState(0)
  const [encerrados, setEncerrados] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setCarregando(false)
      return
    }

    const { data: perfilData } = await supabase
      .from("perfis")
      .select("*")
      .eq("id", user.id)
      .single()

    setPerfil(perfilData)

    const { count: totalPendentes } = await supabase
      .from("chamados")
      .select("*", { count: "exact", head: true })
      .in("status", ["pendente", "aceito"])

    const { count: totalEncerrados } = await supabase
      .from("chamados")
      .select("*", { count: "exact", head: true })
      .in("status", ["encerrado", "rejeitado"])

    setPendentes(totalPendentes || 0)
    setEncerrados(totalEncerrados || 0)
    setCarregando(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/")
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
          Painel do Funcionário
        </h2>

        <p className="text-purple-100 mt-1">
          Olá, {perfil?.nome || "Funcionário"}!
        </p>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-[#4AE273] border-2 border-[#015929] rounded-3xl p-6 shadow-lg">
          <h3 className="text-purple-900 text-xl font-bold mb-4">
            Resumo dos Chamados
          </h3>

          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Clock size={24} className="text-[#015929]" />
              </div>
              <p className="text-purple-900 text-sm">Pendentes</p>
              <p className="text-purple-900 text-3xl font-bold">{pendentes}</p>
            </div>

            <div className="w-px h-14 bg-purple-900 opacity-30"></div>

            <div className="text-center">
              <div className="flex justify-center mb-1">
                <CheckCircle size={24} className="text-[#015929]" />
              </div>
              <p className="text-purple-900 text-sm">Encerrados</p>
              <p className="text-purple-900 text-3xl font-bold">{encerrados}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <button
          onClick={() => navigate("/funcionario/chamados")}
          className="w-full bg-white rounded-3xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#4AE273] border-2 border-[#015929] rounded-2xl p-4">
              <ClipboardList size={36} className="text-[#015929]" />
            </div>

            <div>
              <h3 className="text-purple-900 text-xl font-bold">
                Chamados
              </h3>
              <p className="text-gray-600 text-sm">
                Aceitar, rejeitar ou encerrar solicitações
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate("/mapa")}
          className="w-full bg-white rounded-3xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#4AE273] border-2 border-[#015929] rounded-2xl p-4">
              <MapPin size={36} className="text-[#015929]" />
            </div>

            <div>
              <h3 className="text-purple-900 text-xl font-bold">
                Mapa
              </h3>
              <p className="text-gray-600 text-sm">
                Visualizar pontos de coleta do campus
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default FuncionarioHome