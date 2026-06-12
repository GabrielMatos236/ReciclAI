import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import { X, ZapOff } from "lucide-react"

function QrScanner({ onScan, onClose }) {
    const videoRef  = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    const [erro, setErro] = useState(null)

    useEffect(() => {
        let ativo = true
        let frameId

        async function iniciar() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                })

                if (!ativo) {
                    stream.getTracks().forEach(t => t.stop())
                    return
                }

                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    await videoRef.current.play()
                }
                ler()
            } catch (err) {
                setErro('Não foi possível acessar a câmera. Libere a permissão e tente novamente.')
            }
        }

        function ler() {
            if (!ativo) return

            const video  = videoRef.current
            const canvas = canvasRef.current

            if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width  = video.videoWidth
                canvas.height = video.videoHeight

                const ctx = canvas.getContext('2d')
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                const imagem = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const codigo = jsQR(imagem.data, imagem.width, imagem.height)

                if (codigo) {
                    pararStream()
                    onScan(codigo.data)
                    return
                }
            }

            frameId = requestAnimationFrame(ler)
        }

        function pararStream() {
            ativo = false
            if (frameId) cancelAnimationFrame(frameId)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop())
                streamRef.current = null
            }
        }

        iniciar()

        return () => pararStream()
    }, [])

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <canvas ref={canvasRef} className="hidden" />

            {erro ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                    <div className="bg-red-900/40 rounded-full p-6">
                        <ZapOff size={48} className="text-red-400" />
                    </div>
                    <p className="text-white font-semibold text-base">{erro}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="flex-1 w-full object-cover"
                    />

                    {/* Mira */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-white/60 rounded-3xl" />
                    </div>

                    {/* Instrução */}
                    <div className="absolute top-24 left-0 right-0 flex justify-center px-6 pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-5 py-2.5">
                            <span className="text-white text-sm font-semibold">
                                Aponte para o QR Code da lixeira
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Botão fechar */}
            <button
                onClick={onClose}
                className="absolute top-14 left-5 bg-black/50 backdrop-blur-md p-3 rounded-full cursor-pointer hover:bg-black/70 transition z-10"
            >
                <X size={22} className="text-white" />
            </button>
        </div>
    )
}

export default QrScanner
