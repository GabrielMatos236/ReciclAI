import { useState, useRef, useEffect, useCallback } from "react"
import { Camera as CameraIcon, X, Loader2, Trash2, Sparkles, ZapOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analisarImagem } from "../services/claudeAPI"
import { incrementarPontos } from "../services/pontosService"
import BarraNavegacao from "../components/BarraNavegacao"
import logo from "../assets/Text.png"

function Camera() {
    const navigate = useNavigate()

    // estados da imagem capturada
    const [imagem, setImagem]           = useState(null)  // URL para exibição
    const [imagemBase64, setImagemBase64] = useState(null)
    const [mediaType, setMediaType]     = useState('image/jpeg')

    // estados da câmera ao vivo
    const [streamAtivo, setStreamAtivo] = useState(false)
    const [erroCamera, setErroCamera]   = useState(null)

    // estados da análise
    const [analisando, setAnalisando]   = useState(false)
    const [resultado, setResultado]     = useState(null)
    const [erro, setErro]               = useState(null)

    const videoRef  = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)  // guarda o stream para parar depois

    // Inicia a câmera ao montar o componente
    useEffect(() => {
        iniciarCamera()
        return () => pararStream()  // cleanup ao sair da tela
    }, [])

    async function iniciarCamera() {
        setErroCamera(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setStreamAtivo(true)
        } catch (err) {
            console.error('Erro ao abrir câmera:', err)
            if (err.name === 'NotAllowedError') {
                setErroCamera('Permissão de câmera negada. Libere nas configurações do navegador.')
            } else if (err.name === 'NotFoundError') {
                setErroCamera('Nenhuma câmera encontrada neste dispositivo.')
            } else {
                setErroCamera('Não foi possível acessar a câmera. Certifique-se de usar HTTPS.')
            }
        }
    }

    function pararStream() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setStreamAtivo(false)
    }

    function capturar() {
        const video  = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        canvas.width  = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        const base64  = dataUrl.split(',')[1]

        setImagem(dataUrl)
        setImagemBase64(base64)
        setMediaType('image/jpeg')
        pararStream()  // para o stream após captura para economizar bateria
    }

    function limparImagem() {
        setImagem(null)
        setImagemBase64(null)
        setResultado(null)
        setErro(null)
        iniciarCamera()  // reabre a câmera para nova foto
    }

    async function analisar() {
        if (!imagemBase64) return
        setAnalisando(true)
        setErro(null)
        try {
            const resposta = await analisarImagem(imagemBase64, mediaType)
            setResultado(resposta)
            await incrementarPontos(10)  // +10 pontos por análise
        } catch (err) {
            console.error(err)
            setErro('Erro ao analisar imagem. Tente novamente.')
        } finally {
            setAnalisando(false)
        }
    }

    const coresLixeira = {
        'Azul':     'bg-blue-500',
        'Vermelha': 'bg-red-500',
        'Verde':    'bg-green-500',
        'Amarela':  'bg-yellow-500',
        'Marrom':   'bg-amber-800',
        'Cinza':    'bg-gray-500'
    }

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
                <div className="flex-1 px-4 pt-4 pb-32 relative">
                    <div className="h-full rounded-3xl overflow-hidden relative">
                        <img src={imagem} alt="Foto capturada" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60" />

                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 top-[40%] p-4 z-10 flex flex-col justify-end">
                            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl">
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

                                <div className="h-px bg-gray-200 mb-3" />

                                <p className="text-gray-700 text-sm leading-snug mb-3">
                                    {resultado.explicacao}
                                </p>

                                <div className="flex items-start gap-2 mb-4">
                                    <Sparkles size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-blue-800 text-xs leading-snug">{resultado.dica}</p>
                                </div>

                                {/* Badge de pontos ganhos */}
                                <div className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-800 rounded-2xl py-2 mb-3 text-sm font-semibold">
                                    <Sparkles size={14} />
                                    +10 pontos ganhos!
                                </div>

                                <button
                                    onClick={() => navigate('/mapa', { state: { filtroTipo: resultado.tipoResiduo } })}
                                    className="w-full bg-blue-900 text-white py-3 rounded-2xl font-bold cursor-pointer hover:bg-blue-800 transition text-sm mb-2"
                                >
                                    Ver Lixeira no Mapa
                                </button>
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

    // === ESTADO 2: FOTO CAPTURADA (aguardando análise) ===
    if (imagem) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 px-4 pt-4 pb-32 relative">
                    <div className="h-full rounded-3xl overflow-hidden relative">
                        <img src={imagem} alt="Foto capturada" className="w-full h-full object-cover" />

                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>

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

    // === ESTADO 1: VISOR DE CÂMERA AO VIVO ===
    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <Header />

            {/* Canvas escondido — só usado para capturar o frame */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex-1 px-4 pt-4 pb-32 relative">
                <div className="h-full rounded-3xl overflow-hidden relative bg-black">

                    {/* Erro de câmera */}
                    {erroCamera ? (
                        <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4">
                            <div className="bg-red-100 rounded-full p-6">
                                <ZapOff size={48} className="text-red-500" />
                            </div>
                            <p className="text-white font-semibold text-base">{erroCamera}</p>
                            <button
                                onClick={iniciarCamera}
                                className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer hover:bg-blue-600 transition"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Visor de vídeo ao vivo */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay sutil de mira */}
                            {streamAtivo && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-56 h-56 border-2 border-white/40 rounded-3xl" />
                                </div>
                            )}

                            {/* Botão de captura */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                                <button
                                    onClick={capturar}
                                    disabled={!streamAtivo}
                                    className="w-20 h-20 rounded-full bg-white border-4 border-blue-700 cursor-pointer hover:scale-95 transition-transform active:scale-90 disabled:opacity-40 flex items-center justify-center shadow-2xl"
                                    aria-label="Capturar foto"
                                >
                                    <div className="w-14 h-14 rounded-full bg-blue-700" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <BarraNavegacao />
        </div>
    )
}

export default Camera
