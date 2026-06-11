import { Navigate } from "react-router-dom"
import { usePerfil } from "../contexts/AuthContext"

function RotaPrivada({ children }) {
    const { user, carregando, perfil } = usePerfil()

    if (carregando) {
        return (
            <div className="min-h-screen bg-gradient-to-tr from-blue-950 to-blue-700 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 px-8">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white/70 text-sm font-medium">Carregando...</p>
                    <p className="text-white/40 text-xs text-center mt-4">
                        user: {user ? '✓' : '✗'} | perfil: {perfil ? '✓' : '✗'} | carregando: {String(carregando)}
                    </p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/" replace />
    }

    return children
}

export default RotaPrivada