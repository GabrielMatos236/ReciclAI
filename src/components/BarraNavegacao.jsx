import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useLayoutEffect, useState } from "react"
import { Home, Camera, Map, Recycle } from 'lucide-react'

const ABAS = [
    { rota: '/aprenda', icone: Recycle },
    { rota: '/home',    icone: Home    },
    { rota: '/camera',  icone: Camera  },
    { rota: '/mapa',    icone: Map     },
]

function BarraNavegacao() {
    const navigate  = useNavigate()
    const location  = useLocation()
    const rotaAtual = location.pathname

    const indiceAtivo = ABAS.findIndex(aba => aba.rota === rotaAtual)

    const botoesRef = useRef([])
    const [pilulaStyle, setPilulaStyle] = useState(null)

    useLayoutEffect(() => {
        const botao = botoesRef.current[indiceAtivo]
        if (botao) {
            setPilulaStyle({
                left:  botao.offsetLeft,
                width: botao.offsetWidth,
            })
        }
    }, [indiceAtivo])

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-8 py-3 flex gap-8">

            {indiceAtivo !== -1 && pilulaStyle && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-10 bg-gray-200 rounded-2xl z-0"
                    style={{
                        left:  `${pilulaStyle.left}px`,
                        width: `${pilulaStyle.width}px`,
                    }}
                />
            )}

            {ABAS.map(({ rota, icone: Icone }, idx) => (
                <button
                    key={rota}
                    ref={(el) => (botoesRef.current[idx] = el)}
                    onClick={() => navigate(rota)}
                    className={`p-2 rounded-full relative z-10 ${
                        rotaAtual === rota ? 'text-purple-700' : 'text-gray-400'
                    }`}
                >
                    <Icone size={24} />
                </button>
            ))}

        </div>
    )
}

export default BarraNavegacao