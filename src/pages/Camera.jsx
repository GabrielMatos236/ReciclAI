import { useState } from "react"
import { Camera as CameraIcon, X, Loader2, Trash2 } from 'lucide-react'
import BarraNavegacao from "../components/BarraNavegacao"
import { analisarImagem } from "../services/claudeAPI"

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

        // Salvar preview
        const url = URL.createObjectURL(arquivo)
        setImagem(url)
        setMediaType(arquivo.type)
        setResultado(null)
        setErro(null)

        // Converter pra base64
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

    // Mapeamento das cores das lixeiras
    const coresLixeira = {
        'Azul': 'bg-blue-500',
        'Vermelha': 'bg-red-500',
        'Verde': 'bg-green-500',
        'Amarela': 'bg-yellow-500',
        'Marrom': 'bg-amber-800',
        'Cinza': 'bg-gray-500'
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-24">
            {/* Header */}
            <div className="bg-purple-900 px-6 pt-12 pb-6 rounded-b-3xl">
                <h1 className="text-white text-2xl font-bold">Analisar Descarte</h1>
                <p className="text-purple-200 text-sm mt-1">
                    Tire uma foto ou envie da galeria
                </p>
            </div>

            {/* Conteúdo */}
            <div className="px-6 mt-6">
                {!imagem ? (
                    <label className="block">
                        <div className="bg-white border-2 border-dashed border-purple-400 rounded-3xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:bg-purple-50 transition">
                            <div className="bg-purple-100 rounded-full p-6">
                                <CameraIcon size={48} className="text-purple-700" />
                            </div>
                            <p className="text-purple-900 font-semibold text-lg text-center">
                                Toque para tirar foto
                            </p>
                            <p className="text-gray-500 text-sm text-center">
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
                ) : (
                    <>
                        {/* Imagem Capturada */}
                        <div className="relative">
                            <img
                                src={imagem}
                                alt="Imagem Capturada"
                                className="w-full rounded-3xl shadow-lg"
                            />
                            <button
                                onClick={limparImagem}
                                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition"
                            >
                                <X size={20} className="text-purple-900" />
                            </button>
                        </div>

                        {/* Botão de Analisar (só aparece se não tem resultado ainda) */}
                        {!resultado && (
                            <button
                                onClick={analisar}
                                disabled={analisando || !imagemBase64}
                                className="w-full bg-purple-900 text-white py-4 rounded-2xl mt-4 font-semibold cursor-pointer hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {analisando ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Analisando...
                                    </>
                                ) : (
                                    "Analisar com IA"
                                )}
                            </button>
                        )}

                        {/* Mensagem de erro */}
                        {erro && (
                            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-2xl mt-4">
                                {erro}
                            </div>
                        )}

                        {/* Resultado da análise */}
                        {resultado && (
                            <div className="bg-white rounded-3xl p-6 mt-4 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Trash2 size={24} className="text-purple-900" />
                                    <h2 className="text-xl font-bold text-purple-900">
                                        Resultado
                                    </h2>
                                </div>

                                {/* Tipo de resíduo */}
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">Tipo de resíduo</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {resultado.tipoResiduo}
                                    </p>
                                </div>

                                {/* Lixeira */}
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm mb-2">Lixeira correta</p>
                                    <div className={`${coresLixeira[resultado.lixeira] || 'bg-gray-500'} text-white px-4 py-3 rounded-2xl font-bold text-lg flex items-center gap-2`}>
                                        <Trash2 size={20} />
                                        Lixeira {resultado.lixeira}
                                    </div>
                                </div>

                                {/* Explicação */}
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">Por quê?</p>
                                    <p className="text-gray-800">{resultado.explicacao}</p>
                                </div>

                                {/* Dica */}
                                <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded-r-xl">
                                    <p className="text-green-800 text-sm">
                                        💡 <span className="font-semibold">Dica:</span> {resultado.dica}
                                    </p>
                                </div>

                                {/* Botões de ação */}
                                <button
                                    onClick={limparImagem}
                                    className="w-full bg-purple-900 text-white py-3 rounded-2xl mt-6 font-semibold cursor-pointer hover:bg-purple-800 transition"
                                >
                                    Analisar Outra Imagem
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <BarraNavegacao />
        </div>
    )
}

export default Camera