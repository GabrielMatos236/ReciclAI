import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useLayoutEffect, useState } from "react"
import { Home, ClipboardList, Map } from "lucide-react"

const ABAS = [
  { rota: "/funcionario/home",     icone: Home          },
  { rota: "/funcionario/chamados", icone: ClipboardList  },
  { rota: "/funcionario/mapa",     icone: Map            },
]

function BarraFuncionario() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const rotaAtual = location.pathname

  const indiceAtivo = ABAS.findIndex(aba => aba.rota === rotaAtual)

  const botoesRef = useRef([])
  const [pilulaStyle, setPilulaStyle] = useState(null)
  const [pronto, setPronto] = useState(false)

  useLayoutEffect(() => {
    const botao = botoesRef.current[indiceAtivo]
    if (botao) {
      const novoStyle = { left: botao.offsetLeft, width: botao.offsetWidth }
      if (!pronto) {
        setPilulaStyle(novoStyle)
        requestAnimationFrame(() => requestAnimationFrame(() => setPronto(true)))
      } else {
        setPilulaStyle(novoStyle)
      }
    }
  }, [indiceAtivo])

  return (
    <>
      <style>{`
        @property --border-angle-func {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spin-border-func {
          from { --border-angle-func: 0deg; }
          to   { --border-angle-func: 360deg; }
        }
        .func-gradient-spin {
          position: absolute;
          inset: 0;
          background: conic-gradient(from var(--border-angle-func), #1d4ed8, #4AE273, #1d4ed8);
          animation: spin-border-func 2s linear infinite;
        }
      `}</style>

      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2"
        style={{ padding: '2px', borderRadius: '9999px', overflow: 'hidden' }}
      >
        <div className="func-gradient-spin" />
        <div className="relative z-10 bg-white rounded-full shadow-lg px-8 py-3 flex gap-8">

          {indiceAtivo !== -1 && pilulaStyle && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-10 bg-gray-200 rounded-2xl z-0"
              style={{
                left:  `${pilulaStyle.left}px`,
                width: `${pilulaStyle.width}px`,
                transition: pronto
                  ? 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
              }}
            />
          )}

          {ABAS.map(({ rota, icone: Icone }, idx) => (
            <button
              key={rota}
              ref={el => (botoesRef.current[idx] = el)}
              onClick={() => navigate(rota)}
              className={`p-2 rounded-full relative z-10 transition-colors duration-200 ${
                rotaAtual === rota ? 'text-blue-700' : 'text-gray-400'
              }`}
            >
              <Icone size={24} />
            </button>
          ))}

        </div>
      </div>
    </>
  )
}

export default BarraFuncionario
