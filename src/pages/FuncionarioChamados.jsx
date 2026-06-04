import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, XCircle, ClipboardCheck, Clock } from "lucide-react"
import { supabase } from "../services/supabase"

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
    if (status === "encerrado") return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8">

      <div className="bg-purple-900 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/funcionario/home")}
            className="bg-purple-700 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>

          <div>
            <h1 className="text-white text-2xl font-bold">
              Chamados
            </h1>
            <p className="text-purple-100 text-sm">
              Gerencie as solicitações dos usuários
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-white rounded-full p-1 flex shadow">
          <button
            onClick={() => setAba("pendentes")}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer ${
              aba === "pendentes"
                ? "bg-purple-900 text-white"
                : "text-gray-500"
            }`}
          >
            Pendentes
          </button>

          <button
            onClick={() => setAba("encerrados")}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer ${
              aba === "encerrados"
                ? "bg-purple-900 text-white"
                : "text-gray-500"
            }`}
          >
            Encerrados
          </button>
        </div>
      </div>

      <div className="px-6 mt-6">
        {erro && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-4 text-sm">
            {erro}
          </div>
        )}

        {carregando && (
          <p className="text-purple-900 font-semibold text-center">
            Carregando chamados...
          </p>
        )}

        {!carregando && chamados.length === 0 && (
          <div className="bg-white rounded-3xl p-6 shadow text-center">
            <ClipboardCheck size={42} className="text-purple-900 mx-auto mb-3" />
            <h2 className="text-purple-900 font-bold text-lg">
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
                  <h2 className="text-purple-900 text-lg font-bold">
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
                  <strong className="text-purple-900">Lixeira:</strong>{" "}
                  {chamado.descricao}
                </p>
              </div>

              {aba === "pendentes" && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => atualizarStatus(chamado.id, "aceito")}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition"
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
                      className="bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-green-700 transition"
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