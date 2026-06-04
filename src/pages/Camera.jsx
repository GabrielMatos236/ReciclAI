import { useState } from "react"
import { Camera as CameraIcon, X, Loader2, Trash2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analisarImagem } from "../services/claudeAPI"
import BarraNavegacao from "../components/BarraNavegacao"
import logo from "../assets/Text.png"

function Camera() {
    const navigate = useNavigate()
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

    const coresLixeira = {
        'Azul': 'bg-blue-500',
        'Vermelha': 'bg-red-500',
        'Verde': 'bg-green-500',
        'Amarela': 'bg-yellow-500',
        'Marrom': 'bg-amber-800',
        'Cinza': 'bg-gray-500'
    }

    // Header
    const Header = () => (
        <div className="bg-gradient-to-tr from-blue-950 to-blue-700 h-28 rounded-b-[12px] flex flex-col items-center justify-center flex-shrink-0">
            <h1 className="text-white text-2xl font-bold tracking-wide">
                Escanear Descarte
            </h1>
            <div className="mt-2 flex items-center gap-2 opacity-80">
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200">
                    Powered by
                </span>
                <img src={logo} alt="ReciclAI" className="h-5 w-auto object-contain" />
            </div>
        </div>
    )

    // === ESTADO 3: RESULTADO ===
    if (resultado && imagem) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
                <Header />

                {/* Área da foto */}
                <div className="flex-1 px-4 pt-4 pb-32 relative">
                    <div className="h-full rounded-3xl overflow-hidden relative">

                        {/* Foto de fundo */}
                        <img
                            src={imagem}
                            alt="Foto capturada"
                            className="w-full h-full object-cover"
                        />

                        {/* Filtro escuro sobre a foto */}
                        <div className="absolute inset-0 bg-black/60" />

                        {/* Botão X no canto superior direito */}
                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        {/* Card de resultado */}
                        <div className="absolute bottom-0 left-0 right-0 top-[40%] p-4 z-10 flex flex-col justify-end">
                            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl">

                                {/* Tipo e Lixeira na mesma linha */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Resíduo</p>
                                        <p className="text-blue-900 font-bold text-lg leading-tight">{resultado.tipoResiduo}</p>
                                    </div>
                                    <div className={`${coresLixeira[resultado.lixeira] || 'bg-gray-500'} text-white px-4 py-2 rounded-2xl font-bold text-base flex items-center gap-2`}>
                                        <Trash2 size={16} />
                                        {resultado.lixeira}
                                    </div>
                                </div>

                                {/* Divisor */}
                                <div className="h-px bg-gray-200 mb-3" />

                                {/* Explicação */}
                                <p className="text-gray-700 text-sm leading-snug mb-3">
                                    {resultado.explicacao}
                                </p>

                                {/* Dica */}
                                <div className="flex items-start gap-2 mb-4">
                                    <Sparkles size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-blue-800 text-xs leading-snug">
                                        {resultado.dica}
                                    </p>
                                </div>

                                {/* Botão primário — Ver no Mapa */}
                                <button
                                    onClick={() => navigate('/mapa', { state: { filtroTipo: resultado.tipoResiduo } })}
                                    className="w-full bg-blue-900 text-white py-3 rounded-2xl font-bold cursor-pointer hover:bg-blue-800 transition text-sm mb-2"
                                >
                                    Ver Lixeira no Mapa
                                </button>

                                {/* Botão secundário — Analisar outra */}
                                <button
                                    onClick={limparImagem}
                                    className="w-full bg-white border-2 border-blue-900 text-blue-900 py-3 rounded-2xl font-bold cursor-pointer hover:bg-blue-50 transition text-sm"
                                >
                                    Analisar Outra Imagem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <BarraNavegacao />
            </div>
        )
    }

    // === ESTADO 2: FOTO TIRADA (aguardando análise) ===
    if (imagem) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
                <Header />

                {/* Área da foto */}
                <div className="flex-1 px-4 pt-4 pb-32 relative">
                    <div className="h-full rounded-3xl overflow-hidden relative">

                        {/* Foto */}
                        <img
                            src={imagem}
                            alt="Foto capturada"
                            className="w-full h-full object-cover"
                        />

                        {/* Botão X */}
                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        {/* Botão Analisar */}
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                            <button
                                onClick={analisar}
                                disabled={analisando}
                                className="w-full bg-blue-700/80 backdrop-blur-md text-white py-4 rounded-2xl font-bold text-lg cursor-pointer hover:bg-blue-700/95 transition disabled:opacity-50 flex items-center justify-center gap-2 border border-white/20 shadow-2xl"
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

                            {erro && (
                                <div className="mt-2 bg-red-500/90 backdrop-blur-md text-white p-3 rounded-2xl text-sm text-center">
                                    {erro}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BarraNavegacao />
            </div>
        )
    }

    // === ESTADO 1: INICIAL ===
    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 px-4 pt-4 pb-32">
                <label className="block h-full">
                    <div className="h-full border-2 border-dashed border-blue-700 rounded-3xl bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition">
                        <div className="bg-blue-100 rounded-full p-6 mb-4">
                            <CameraIcon size={56} className="text-blue-700" />
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