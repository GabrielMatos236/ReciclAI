import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardList, MapPin, LogOut, CheckCircle2, Clock } from "lucide-react"
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

          <button
            onClick={handleLogout}
            className="bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
            title="Sair"
          >
            <LogOut size={22} className="text-white" />
          </button>
        </div>

        <h2 className="text-white text-lg font-semibold ml-4">
          olá, {perfil?.nome || "Funcionário"}!
        </h2>

        <p className="text-blue-100 text-sm ml-4 mt-1">
          Painel do funcionário
        </p>
      </div>

      {/* Card resumo */}
      <div className="px-6 -mt-14">
        <div className="bg-[#4AE273] border-2 border-[#015929] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={30} className="text-[#015929]" strokeWidth={2.5} />
            <div className="flex-1 h-px bg-blue-900 opacity-40"></div>
          </div>

          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Clock size={22} className="text-[#015929]" />
              </div>
              <p className="text-blue-900 text-xs">Pendentes</p>
              <p className="text-blue-900 text-2xl font-bold">{pendentes}</p>
            </div>

            <div className="w-px h-9 bg-blue-900 opacity-30"></div>

            <div className="text-center">
              <div className="flex justify-center mb-1">
                <CheckCircle2 size={22} className="text-[#015929]" />
              </div>
              <p className="text-blue-900 text-xs">Encerrados</p>
              <p className="text-blue-900 text-2xl font-bold">{encerrados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões principais */}
      <div className="px-6 mt-5 flex justify-between gap-3">
        <button
          onClick={() => navigate("/funcionario/chamados")}
          className="flex flex-col items-center gap-1.5 cursor-pointer flex-1"
        >
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <ClipboardList size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">
            Chamados
          </span>
        </button>

        <button
          onClick={() => navigate("/funcionario/mapa")}
          className="flex flex-col items-center gap-1.5 cursor-pointer flex-1"
        >
          <div className="bg-[#4AE273] border-2 border-[#015929] rounded-xl p-3 w-14 h-14 flex items-center justify-center hover:opacity-90 transition">
            <MapPin size={24} className="text-[#015929]" />
          </div>
          <span className="text-black text-[10px] font-semibold text-center leading-tight">
            Pontos de Descarte
          </span>
        </button>
      </div>

      {/* Card explicativo */}
      <div className="px-6 mt-5">
        <button
          onClick={() => navigate("/funcionario/chamados")}
          className="w-full bg-white border-2 border-gray-300 rounded-3xl py-8 px-6 cursor-pointer hover:border-blue-700 transition flex flex-col items-center gap-2"
        >
          <ClipboardList size={36} className="text-blue-900" strokeWidth={1.5} />
          <span className="text-black text-base font-bold tracking-wide">
            GERENCIAR CHAMADOS
          </span>
          <span className="text-gray-500 text-xs text-center">
            Aceite, rejeite ou finalize solicitações abertas pelos usuários.
          </span>
        </button>
      </div>
    </div>
  )
}

export default FuncionarioHome