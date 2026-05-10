import { useLocation, useNavigate } from "react-router-dom";
import { Home, Camera, Map} from 'lucide-react'

function BarraNavegacao() {
    const navigate = useNavigate()
    const location = useLocation()

    const rotaAtual = location.pathname

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-8 py-3 flex gap-8">

            <button
             onClick={() => navigate("/home")}
             className={`p-2 rounded-full transition ${rotaAtual === '/home' ? 'text-purple-700' : 'text-gray-400'}`}
            >
                <Home size={24} />
            </button>

            <button
             onClick={() => navigate("/camera")}
             className={`p-2 rounded-full transition ${rotaAtual === '/camera' ? 'text-purple-700' : 'text-gray-400'}`}
            >
                <Camera size={24} />
            </button>

            <button
             onClick={() => navigate("/mapa")}
             className={`p-2 rounded-full transition ${rotaAtual === '/mapa' ? 'text-purple-700' : 'text-gray-400'}`}
            >
                <Map size={24} />
            </button>
        </div>
    )
}

export default BarraNavegacao