import { useState, useRef, useEffect } from "react"
import { X, Loader2, Trash2, Sparkles, ZapOff, Maximize2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analisarImagem } from "../services/claudeAPI"
import logo from "../assets/Text.png"

// Tipos que existem no banco de lixeiras — usados para filtrar o mapa
const TIPOS_VALIDOS_MAPA = ['Orgânico', 'Vidro', 'Papel', 'Plástico', 'Metal']

function Camera() {
    const navigate = useNavigate()

    const [imagem, setImagem]             = useState(null)
    const [imagemBase64, setImagemBase64] = useState(null)
    const [mediaType, setMediaType]       = useState('image/jpeg')
    const [streamAtivo, setStreamAtivo]   = useState(false)
    const [erroCamera, setErroCamera]     = useState(null)
    const [fullscreen, setFullscreen]     = useState(false)
    const [analisando, setAnalisando]     = useState(false)
    const [resultado, setResultado]       = useState(null)
    const [erro, setErro]                 = useState(null)

    const videoRef  = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    useEffect(() => {
        iniciarCamera()
        return () => pararStream()
    }, [])

    async function iniciarCamera() {
        setErroCamera(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            })
            streamRef.current = stream
            if (videoRef.current) videoRef.current.srcObject = stream
            setStreamAtivo(true)
        } catch (err) {
            if (err.name === 'NotAllowedError')   setErroCamera('Permissão de câmera negada. Libere nas configurações do navegador.')
            else if (err.name === 'NotFoundError') setErroCamera('Nenhuma câmera encontrada neste dispositivo.')
            else setErroCamera('Não foi possível acessar a câmera. Certifique-se de usar HTTPS.')
        }
    }

    function pararStream() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setStreamAtivo(false)
    }

    function handleVideoRef(el) {
        videoRef.current = el
        if (el && streamRef.current) el.srcObject = streamRef.current
    }

    function capturar() {
        const video  = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        const MAX_WIDTH = 800
        const escala = Math.min(1, MAX_WIDTH / video.videoWidth)
        canvas.width  = Math.round(video.videoWidth  * escala)
        canvas.height = Math.round(video.videoHeight * escala)
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.80)
        setImagem(dataUrl)
        setImagemBase64(dataUrl.split(',')[1])
        setMediaType('image/jpeg')
        pararStream()
        setFullscreen(false)
    }

    function limparImagem() {
        setImagem(null)
        setImagemBase64(null)
        setResultado(null)
        setErro(null)
        iniciarCamera()
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

    function irParaMapa() {
        // Só passa o filtro se o tipo retornado pela IA existir no banco
        const tipoParaMapa = TIPOS_VALIDOS_MAPA.includes(resultado.tipoResiduo)
            ? resultado.tipoResiduo
            : null
        navigate('/mapa', { state: { filtroTipo: tipoParaMapa } })
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
            <h1 className="text-white text-2xl font-bold tracking-wide">Escanear Descarte</h1>
            <div className="mt-2 flex items-center gap-2 opacity-80">
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200">Powered by</span>
                <img src={logo} alt="ReciclAI" className="h-5 w-auto object-contain" />
            </div>
        </div>
    )

    // === ESTADO 3: RESULTADO ===
    if (resultado && imagem) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 px-4 pt-4 pb-24 relative">
                    <div className="h-full rounded-3xl overflow-hidden relative">
                        <img src={imagem} alt="Foto capturada" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60" />
                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 top-[38%] p-4 z-10 flex flex-col justify-end">
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
                                <p className="text-gray-700 text-sm leading-snug mb-3">{resultado.explicacao}</p>
                                <div className="flex items-start gap-2 mb-4">
                                    <Sparkles size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-blue-800 text-xs leading-snug">{resultado.dica}</p>
                                </div>
                                <button
                                    onClick={irParaMapa}
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
            </div>
        )
    }

    // === ESTADO 2: FOTO CAPTURADA ===
    if (imagem) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-3 min-h-0">
                    <div className="rounded-3xl overflow-hidden relative min-h-0 flex-1">
                        <img src={imagem} alt="Foto capturada" className="w-full h-full object-cover" />
                        <button
                            onClick={limparImagem}
                            className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                    <button
                        onClick={analisar}
                        disabled={analisando}
                        className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg cursor-pointer hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg flex-shrink-0"
                    >
                        {analisando
                            ? <><Loader2 size={22} className="animate-spin" />Analisando...</>
                            : <><Sparkles size={22} />Analisar com IA</>
                        }
                    </button>
                    {erro && (
                        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-2xl text-sm text-center flex-shrink-0">
                            {erro}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // === ESTADO 1: VISOR NORMAL ===
    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <Header />
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex-1 px-4 pt-4 pb-24 min-h-0">
                <div className="h-full rounded-3xl overflow-hidden relative bg-black">
                    {erroCamera ? (
                        <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4">
                            <div className="bg-red-900/40 rounded-full p-6">
                                <ZapOff size={48} className="text-red-400" />
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
                            <video
                                ref={handleVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            <div
                                onClick={() => setFullscreen(true)}
                                className="absolute inset-0 bg-black/10 hover:bg-black/20 transition cursor-pointer flex items-end justify-center pb-5"
                            >
                                <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-5 py-2.5 flex items-center gap-2">
                                    <Maximize2 size={16} className="text-white" />
                                    <span className="text-white text-sm font-semibold">Toque para fotografar</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {fullscreen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <video
                        ref={el => { if (el && streamRef.current) el.srcObject = streamRef.current }}
                        autoPlay
                        playsInline
                        muted
                        className="flex-1 w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl" />
                    </div>
                    <button
                        onClick={() => setFullscreen(false)}
                        className="absolute top-14 left-5 bg-black/50 backdrop-blur-md p-3 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
                    >
                        <X size={22} className="text-white" />
                    </button>
                    <div className="absolute bottom-14 left-0 right-0 flex justify-center z-10">
                        <button
                            onClick={capturar}
                            disabled={!streamAtivo}
                            className="w-20 h-20 rounded-full bg-white border-4 border-blue-700 cursor-pointer hover:scale-95 transition-transform active:scale-90 disabled:opacity-40 flex items-center justify-center shadow-2xl"
                            aria-label="Capturar foto"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-700" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Camera
