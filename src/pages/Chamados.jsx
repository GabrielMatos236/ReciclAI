import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Send, ClipboardList, QrCode, X, MapPin } from "lucide-react"
import { supabase } from "../services/supabase"
import QrScanner from "../components/QrScanner"
import Text from "../assets/Text.png"

// Formato esperado dentro do QR Code impresso nas lixeiras
const REGEX_QR_LIXEIRA = /^RECICLAI-LIXEIRA-(\d+)$/

function Chamados() {
  const navigate = useNavigate()

  const [aba, setAba] = useState("abrir")
  const [tipo, setTipo] = useState("Lixeira cheia")
  const [descricao, setDescricao] = useState("")
  const [meusChamados, setMeusChamados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)

  // Lixeira vinculada via QR Code (opcional)
  const [lixeiraId, setLixeiraId]     = useState(null)
  const [lixeiraInfo, setLixeiraInfo] = useState(null)
  const [scannerAberto, setScannerAberto] = useState(false)
  const [erroScan, setErroScan]       = useState(null)

  // Recarrega ao trocar de aba
  useEffect(() => {
    if (aba !== "abrir") {
      carregarMeusChamados()
    }
  }, [aba])

  // Recarrega quando o app volta do background (iOS) ou de outra aba
  useEffect(() => {
    const handleVisibilidade = () => {
      if (document.visibilityState === 'visible' && aba !== 'abrir') {
        carregarMeusChamados()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilidade)
    return () => document.removeEventListener('visibilitychange', handleVisibilidade)
  }, [aba])

  async function carregarMeusChamados() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    let query = supabase
      .from("chamados")
      .select("*")
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false })

    if (aba === "pendentes") {
      query = query.in("status", ["pendente", "aceito"])
    }

    if (aba === "encerrados") {
      query = query.in("status", ["encerrado", "rejeitado"])
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      setMeusChamados([])
      return
    }

    const chamados = data || []

    // Busca os dados das lixeiras vinculadas (se houver) pra exibir na lista
    const idsLixeiras = [...new Set(chamados.filter(c => c.lixeira_id).map(c => c.lixeira_id))]

    if (idsLixeiras.length > 0) {
      const { data: lixeiras } = await supabase
        .from("lixeiras")
        .select("id, nome, predio")
        .in("id", idsLixeiras)

      const mapaLixeiras = Object.fromEntries((lixeiras || []).map(l => [l.id, l]))

      setMeusChamados(chamados.map(c => ({
        ...c,
        lixeira: c.lixeira_id ? mapaLixeiras[c.lixeira_id] : null
      })))
    } else {
      setMeusChamados(chamados)
    }
  }

  // Trata o resultado do scanner de QR Code
  async function handleScan(codigo) {
    setScannerAberto(false)
    setErroScan(null)

    const match = codigo.match(REGEX_QR_LIXEIRA)

    if (!match) {
      setErroScan("QR Code inválido. Aponte para um QR Code de lixeira do ReciclAI.")
      return
    }

    const id = parseInt(match[1], 10)

    const { data, error } = await supabase
      .from("lixeiras")
      .select("id, nome, predio, tipo, cor")
      .eq("id", id)
      .single()

    if (error || !data) {
      setErroScan("Lixeira não encontrada no sistema.")
      return
    }

    setLixeiraId(data.id)
    setLixeiraInfo(data)
  }

  function removerLixeira() {
    setLixeiraId(null)
    setLixeiraInfo(null)
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
          foto_url: null,
          lixeira_id: lixeiraId
        })

      if (error) throw error

      setTipo("Lixeira cheia")
      setDescricao("")
      removerLixeira()
      setSucesso("Chamado aberto com sucesso!")
      setAba("pendentes")
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
    if (status === "encerrado") return "bg-emerald-100 text-emerald-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-tr from-blue-950 to-blue-700 px-6 pt-12 pb-20">
        <div className="flex justify-between items-center mb-8">
          <img src={Text} alt="ReciclAI" className="h-10" />

          <button
            onClick={() => navigate("/home")}
            className="bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
            title="Voltar"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
        </div>

        <h2 className="text-white text-lg font-semibold ml-4">
          Manutenção de Lixeiras
        </h2>

        <p className="text-blue-100 text-sm ml-4 mt-1">
          Abra e acompanhe chamados de manutenção
        </p>
      </div>

      {/* Abas principais */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-full p-1 flex shadow-lg">
          <button
            onClick={() => {
              setErro(null)
              setSucesso(null)
              setAba("abrir")
            }}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer text-sm ${
              aba === "abrir"
                ? "bg-blue-900 text-white"
                : "text-gray-500"
            }`}
          >
            Abrir
          </button>

          <button
            onClick={() => {
              setErro(null)
              setSucesso(null)
              setAba("pendentes")
            }}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer text-sm ${
              aba === "pendentes"
                ? "bg-blue-900 text-white"
                : "text-gray-500"
            }`}
          >
            Pendentes
          </button>

          <button
            onClick={() => {
              setErro(null)
              setSucesso(null)
              setAba("encerrados")
            }}
            className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer text-sm ${
              aba === "encerrados"
                ? "bg-blue-900 text-white"
                : "text-gray-500"
            }`}
          >
            Encerrados
          </button>
        </div>
      </div>

      {/* Aba Abrir */}
      {aba === "abrir" && (
        <div className="px-6 mt-5">
          <form
            onSubmit={abrirChamado}
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <h3 className="text-blue-900 text-xl font-bold mb-1">
              Abrir chamado
            </h3>

            <p className="text-gray-500 text-sm mb-5">
              Informe uma lixeira cheia, quebrada ou sem identificação.
            </p>

            <label className="block text-blue-900 font-semibold mb-2">
              Tipo do chamado
            </label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-700 bg-white text-black"
            >
              <option value="Lixeira cheia">Lixeira cheia</option>
              <option value="Lixeira quebrada">Lixeira quebrada</option>
              <option value="Lixeira sem identificação">Lixeira sem identificação</option>
              <option value="Lixeira suja">Lixeira suja</option>
              <option value="Outro problema">Outro problema</option>
            </select>

            <label className="block text-blue-900 font-semibold mb-2">
              Descrição
            </label>

            <textarea
              placeholder="Descreva onde está a lixeira e qual problema foi encontrado"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-700 resize-none text-black"
            />

            <label className="block text-blue-900 font-semibold mb-2">
              Lixeira (opcional)
            </label>

            {lixeiraInfo ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-700 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-800 font-semibold text-sm">{lixeiraInfo.nome}</p>
                    <p className="text-emerald-600 text-xs">{lixeiraInfo.predio} · {lixeiraInfo.tipo}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removerLixeira}
                  className="text-emerald-600 hover:text-emerald-800 cursor-pointer flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setErroScan(null); setScannerAberto(true) }}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-xl mb-4 cursor-pointer hover:border-blue-700 hover:text-blue-700 transition text-sm font-semibold"
              >
                <QrCode size={18} />
                Escanear QR da lixeira
              </button>
            )}

            {erroScan && (
              <div className="bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-xl mb-4 text-sm">
                {erroScan}
              </div>
            )}

            {erro && (
              <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-4 text-sm">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-xl mb-4 text-sm">
                {sucesso}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Send size={18} />
              {carregando ? "Enviando..." : "Enviar chamado"}
            </button>
          </form>
        </div>
      )}

      {/* Abas Pendentes e Encerrados */}
      {aba !== "abrir" && (
        <div className="px-6 mt-5">
          <h2 className="text-blue-900 text-xl font-bold mb-4">
            {aba === "pendentes"
              ? "Chamados pendentes"
              : "Chamados encerrados"}
          </h2>

          {meusChamados.length === 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <ClipboardList size={42} className="text-blue-900 mx-auto mb-3" />

              <h3 className="text-blue-900 font-bold">
                Nenhum chamado encontrado
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {aba === "pendentes"
                  ? "Você não possui chamados pendentes no momento."
                  : "Você não possui chamados encerrados no momento."}
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
                    <h3 className="text-blue-900 text-lg font-bold">
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

                {chamado.lixeira && (
                  <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold mt-3">
                    <MapPin size={14} />
                    {chamado.lixeira.nome} — {chamado.lixeira.predio}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {scannerAberto && (
        <QrScanner
          onScan={handleScan}
          onClose={() => setScannerAberto(false)}
        />
      )}

    </div>
  )
}

export default Chamados
