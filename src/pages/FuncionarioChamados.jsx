import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, XCircle, ClipboardCheck, Clock } from "lucide-react"
import { supabase } from "../services/supabase"
import Text from "../assets/Text.png"

function FuncionarioChamados() {
  const navigate = useNavigate()

  const [aba, setAba] = useState("pendentes")
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    carregarChamados()
  }, [aba])

  async function carregarChamados() {
    setCarregando(true)
    setErro(null)

    let query = supabase
      .from("chamados")
      .select("*")
      .order("created_at", { ascending: false })

    if (aba === "pendentes") {
      query = query.in("status", ["pendente", "aceito"])
    } else {
      query = query.in("status", ["encerrado", "rejeitado"])
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      setErro("Erro ao carregar chamados")
      setChamados([])
    } else {
      setChamados(data || [])
    }

    setCarregando(false)
  }

  async function atualizarStatus(id, novoStatus) {
    const { error } = await supabase
      .from("chamados")
      .update({ status: novoStatus })
      .eq("id", id)

    if (error) {
      console.error(error)
      setErro("Erro ao atualizar chamado")
      return
    }

    carregarChamados()
  }

  function textoStatus(status) {
    if (status === "pendente") return "Pendente"
    if (status === "aceito") return "Aceito"
    if (status === "rejeitado") return "Rejeitado"
    if (status === "encerrado") return "Encerrado"
    return status
  }

  function corStatus(status) {
    if (status === "pendente") return "bg-yellow-100 text-yellow-800"
    if (status === "aceito") return "bg-blue-100 text-blue-800"
    if (status === "rejeitado") return "bg-red-100 text-red-800"
    if (status === "encerrado") return "bg-emerald-100 text-emerald-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 px-6 pt-12 pb-24">
        <div className="flex justify-between items-center mb-8">
          <img src={Text} alt="ReciclAI" className="h-10" />

          <button
            onClick={() => navigate("/funcionario/home")}
            className="bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
            title="Voltar"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
        </div>

        <h2 className="text-white text-lg font-semibold ml-4">
          Chamados
        </h2>

        <p className="text-blue-100 text-sm ml-4 mt-1">
          Gerencie as solicitações dos usuários
        </p>
      </div>

      {/* Card de destaque */}
      <div className="px-6 -mt-14">
        <div className="bg-[#4AE273] border-2 border-[#015929] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardCheck size={30} className="text-[#015929]" strokeWidth={2.5} />
            <div className="flex-1 h-px bg-blue-900 opacity-40"></div>
          </div>

          <h3 className="text-blue-900 text-xl font-bold">
            Solicitações de manutenção
          </h3>

          <p className="text-blue-900 text-sm mt-1">
            Acompanhe chamados pendentes e encerrados.
          </p>
        </div>
      </div>

      {/* Abas */}
      <div className="px-6 mt-5">
        <div className="bg-white rounded-full p-1 flex shadow-lg">
          <button
            onClick={() => setAba("pendentes")}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer ${
              aba === "pendentes"
                ? "bg-blue-900 text-white"
                : "text-gray-500"
            }`}
          >
            Pendentes
          </button>

          <button
            onClick={() => setAba("encerrados")}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer ${
              aba === "encerrados"
                ? "bg-blue-900 text-white"
                : "text-gray-500"
            }`}
          >
            Encerrados
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 mt-5">
        {erro && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-4 text-sm">
            {erro}
          </div>
        )}

        {carregando && (
          <p className="text-blue-900 font-semibold text-center">
            Carregando chamados...
          </p>
        )}

        {!carregando && chamados.length === 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
            <ClipboardCheck size={42} className="text-blue-900 mx-auto mb-3" />

            <h2 className="text-blue-900 font-bold text-lg">
              Nenhum chamado encontrado
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Não há chamados nesta aba no momento.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              className="bg-white rounded-3xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <h2 className="text-blue-900 text-lg font-bold">
                    {chamado.tipo}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Criado em{" "}
                    {new Date(chamado.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${corStatus(chamado.status)}`}>
                  {textoStatus(chamado.status)}
                </span>
              </div>

              <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
                <p className="text-gray-700">
                  <strong className="text-blue-900">Descrição:</strong>{" "}
                  {chamado.descricao}
                </p>

                {chamado.foto_url && (
                  <img
                    src={chamado.foto_url}
                    alt="Foto do chamado"
                    className="w-full rounded-xl mt-3"
                  />
                )}
              </div>

              {aba === "pendentes" && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => atualizarStatus(chamado.id, "aceito")}
                    className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-800 transition"
                  >
                    <Clock size={18} />
                    Aceitar
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => atualizarStatus(chamado.id, "rejeitado")}
                      className="bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-red-700 transition"
                    >
                      <XCircle size={18} />
                      Rejeitar
                    </button>

                    <button
                      onClick={() => atualizarStatus(chamado.id, "encerrado")}
                      className="bg-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-600 transition"
                    >
                      <CheckCircle size={18} />
                      Realizado
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FuncionarioChamados