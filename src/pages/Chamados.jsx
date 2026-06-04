import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, AlertTriangle, Send, ClipboardList } from "lucide-react"
import { supabase } from "../services/supabase"
import BarraNavegacao from "../components/BarraNavegacao"

function Chamados() {
  const navigate = useNavigate()

  const [tipo, setTipo] = useState("Lixeira cheia")
  const [descricao, setDescricao] = useState("")
  const [meusChamados, setMeusChamados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)

  useEffect(() => {
    carregarMeusChamados()
  }, [])

  async function carregarMeusChamados() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("chamados")
      .select("*")
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setMeusChamados([])
      return
    }

    setMeusChamados(data || [])
  }

  async function abrirChamado(e) {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    setSucesso(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado.")
      }

      const { error } = await supabase
        .from("chamados")
        .insert({
          usuario_id: user.id,
          tipo,
          descricao,
          status: "pendente",
          foto_url: null
        })

      if (error) throw error

      setTipo("Lixeira cheia")
      setDescricao("")
      setSucesso("Chamado aberto com sucesso!")

      carregarMeusChamados()
    } catch (err) {
      console.error(err)
      setErro(err.message || "Erro ao abrir chamado")
    } finally {
      setCarregando(false)
    }
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
    <div className="min-h-screen bg-gray-100 pb-24">

      <div className="bg-purple-900 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="bg-purple-700 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>

          <div>
            <h1 className="text-white text-2xl font-bold">
              Chamados
            </h1>
            <p className="text-purple-100 text-sm">
              Reporte problemas nas lixeiras do campus
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-green-300 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={28} className="text-purple-900" />
            <h2 className="text-purple-900 text-xl font-bold">
              Abrir chamado
            </h2>
          </div>

          <p className="text-purple-900 text-sm">
            Informe o problema encontrado em uma lixeira.
          </p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <form
          onSubmit={abrirChamado}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <label className="block text-purple-900 font-semibold mb-2">
            Tipo do chamado
          </label>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 bg-white"
          >
            <option value="Lixeira cheia">Lixeira cheia</option>
            <option value="Lixeira quebrada">Lixeira quebrada</option>
            <option value="Lixeira sem identificação">Lixeira sem identificação</option>
            <option value="Lixeira suja">Lixeira suja</option>
            <option value="Outro problema">Outro problema</option>
          </select>

          <label className="block text-purple-900 font-semibold mb-2">
            Descrição
          </label>

          <textarea
            placeholder="Descreva onde está a lixeira e qual problema foi encontrado"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 resize-none"
          />

          {erro && (
            <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-4 text-sm">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-xl mb-4 text-sm">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-purple-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-800 transition disabled:opacity-50"
          >
            <Send size={18} />
            {carregando ? "Enviando..." : "Enviar chamado"}
          </button>
        </form>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-purple-900 text-xl font-bold mb-4">
          Meus chamados
        </h2>

        {meusChamados.length === 0 && (
          <div className="bg-white rounded-3xl p-6 shadow text-center">
            <ClipboardList size={42} className="text-purple-900 mx-auto mb-3" />

            <h3 className="text-purple-900 font-bold">
              Nenhum chamado aberto
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Seus chamados aparecerão aqui.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {meusChamados.map((chamado) => (
            <div
              key={chamado.id}
              className="bg-white rounded-3xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <h3 className="text-purple-900 text-lg font-bold">
                    {chamado.tipo}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {new Date(chamado.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${corStatus(chamado.status)}`}>
                  {textoStatus(chamado.status)}
                </span>
              </div>

              <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
                <p className="text-gray-700">
                  <strong className="text-purple-900">Descrição:</strong>{" "}
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
            </div>
          ))}
        </div>
      </div>

      <BarraNavegacao />
    </div>
  )
}

export default Chamados