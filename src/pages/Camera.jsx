import { useState } from "react"
import { Camera as CameraIcon, X, Loader2, Trash2, Sparkles } from 'lucide-react'
import BarraNavegacao from "../components/BarraNavegacao"
import { analisarImagem } from "../services/claudeAPI"
import logo from "../assets/Text.png"

function Camera() {
    const [imagem, setImagem] = useState(null)
    const [imagemBase64, setImagemBase64] = useState(null)
    const [mediaType, setMediaType] = useState(null)
    const [analisando, setAnalisando] = useState(false)
    const [resultado, setResultado] = useState(null)
    const [erro, setErro] = useState(null)

    function handleImagemSelecionada(evento) {
        const arquivo = evento.target.files[0]
        if (!arquivo) return

        const url = URL.createObjectURL(arquivo)
        setImagem(url)
        setMediaType(arquivo.type)
        setResultado(null)
        setErro(null)

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]
            setImagemBase64(base64)
        }
        reader.readAsDataURL(arquivo)
    }

    function limparImagem() {
        setImagem(null)
        setImagemBase64(null)
        setMediaType(null)
        setResultado(null)
        setErro(null)
    }

    async function analisar() {
        if (!imagemBase64) return

        setAnalisando(true)
        setErro(null)

        try {
            const resposta = await analisarImagem(imagemBase64, mediaType)
            setResultado(resposta)
        } catch (err) {
            console.error(err)
            setErro('Erro ao analisar imagem. Tente novamente.')
        } finally {
            setAnalisando(false)
        }
    }

    // Cor da lixeira (mantido pra usar nos cards de resultado)
    const coresLixeira = {
        'Azul': 'bg-blue-500',
        'Vermelha': 'bg-red-500',
        'Verde': 'bg-green-500',
        'Amarela': 'bg-yellow-500',
        'Marrom': 'bg-amber-800',
        'Cinza': 'bg-gray-500'
    }

    // === ESTADO 3: RESULTADO (foto de fundo + cards sobrepostos) ===
    if (resultado && imagem) {
        return (
            <div className="min-h-screen pb-24 relative">

                {/* Foto como background fixo, com filtro escuro por cima */}
                <div
                    className="fixed inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imagem})` }}
                />
                <div className="fixed inset-0 bg-black/60" />

                {/* Conteúdo scrollável por cima da foto */}
                <div className="relative z-10">

                    {/* Header com gradiente AZUL */}
                    <div className="bg-gradient-to-tr from-blue-950/90 to-blue-700/90 backdrop-blur-sm px-8 pt-12 pb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-white text-2xl font-bold">Resultado</h1>
                            <p className="text-blue-100 text-sm mt-1">Análise da IA concluída</p>
                        </div>
                        <button
                            onClick={limparImagem}
                            className="bg-blue-800/80 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                        >
                            <X size={22} className="text-white" />
                        </button>
                    </div>

                    {/* Cards de informação — efeito vidro fosco */}
                    <div className="px-6 mt-6 flex flex-col gap-4">

                        {/* Tipo de resíduo */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tipo de resíduo</p>
                            <p className="text-2xl font-bold text-blue-900">{resultado.tipoResiduo}</p>
                        </div>

                        {/* Lixeira correta */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Lixeira correta</p>
                            <div className={`${coresLixeira[resultado.lixeira] || 'bg-gray-500'} text-white px-4 py-3 rounded-2xl font-bold text-lg flex items-center gap-2`}>
                                <Trash2 size={20} />
                                Lixeira {resultado.lixeira}
                            </div>
                        </div>

                        {/* Explicação */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Por quê?</p>
                            <p className="text-gray-800 leading-relaxed">{resultado.explicacao}</p>
                        </div>

                        {/* Dica */}
                        <div className="bg-blue-900/95 backdrop-blur-md rounded-3xl p-5 shadow-xl">
                            <div className="flex items-start gap-3">
                                <Sparkles size={20} className="text-blue-200 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Dica</p>
                                    <p className="text-white leading-relaxed">{resultado.dica}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botão analisar outra */}
                        <button
                            onClick={limparImagem}
                            className="w-full bg-white text-blue-900 py-4 rounded-2xl mt-2 font-bold cursor-pointer hover:bg-gray-100 transition shadow-xl"
                        >
                            Analisar Outra Imagem
                        </button>

                    </div>
                </div>

                <BarraNavegacao />
            </div>
        )
    }

    // === ESTADO 2: FOTO TIRADA (aguardando análise) ===
    if (imagem) {
        return (
            <div className="min-h-screen bg-black relative pb-24">

                {/* Foto fullscreen */}
                <img
                    src={imagem}
                    alt="Foto capturada"
                    className="fixed inset-0 w-full h-full object-cover"
                />

                {/* Botão X pra remover foto */}
                <button
                    onClick={limparImagem}
                    className="fixed top-12 right-6 bg-black/60 backdrop-blur-md p-3 rounded-full cursor-pointer hover:bg-black/80 transition z-20"
                >
                    <X size={22} className="text-white" />
                </button>

                {/* Botão "Analisar com IA" sobreposto na parte de baixo */}
                <div className="fixed bottom-28 left-0 right-0 px-6 z-20">
                    <button
                        onClick={analisar}
                        disabled={analisando}
                        className="w-full bg-blue-700/80 backdrop-blur-md text-white py-5 rounded-3xl font-bold text-lg cursor-pointer hover:bg-blue-700/95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl border border-white/20"
                    >
                        {analisando ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Analisando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={22} />
                                Analisar com IA
                            </>
                        )}
                    </button>
                </div>

                {/* Mensagem de erro flutuante */}
                {erro && (
                    <div className="fixed bottom-44 left-6 right-6 bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl z-20">
                        {erro}
                    </div>
                )}

                <BarraNavegacao />
            </div>
        )
    }

    // === ESTADO 1: INICIAL (área pontilhada gigante) ===
    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center">

                <h1 className="text-white text-2xl font-bold tracking-wide">
                    Escanear Descarte
                </h1>

                <div className="mt-2 flex items-center gap-2 opacity-80">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200">
                        Powered by
                    </span>

                    <img
                        src={logo}
                        alt="ReciclAI"
                        className="h-4 object-contain"
                    />
                </div>

            </div>

            {/* Área que ocupa TODO o restante da tela */}
            <div className="flex-1 px-4 pt-4 pb-32">
                <label className="block h-full">
                    <div className="h-full border-2 border-dashed border-blue-700 rounded-3xl bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition">

                        <div className="bg-blue-100 rounded-full p-6 mb-4">
                            <CameraIcon
                                size={56}
                                className="text-blue-700"
                            />
                        </div>

                        <p className="text-blue-900 font-bold text-xl">
                            Toque para tirar foto
                        </p>

                        <p className="text-gray-500 text-sm mt-2">
                            ou enviar uma imagem da galeria
                        </p>

                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImagemSelecionada}
                        className="hidden"
                    />
                </label>
            </div>

            <BarraNavegacao />
        </div>
    )
}

export default Camera