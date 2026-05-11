import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function RotaPrivada({ children }) {
    const [carregando, setCarregando] = useState(true)
    const [autenticado, setAutenticado] = useState(false)

    useEffect(() => {
        //verificar sessão ativa
        async function verificarSessao() {
            const { data: { session} } = await supabase.auth.getSession()
            setAutenticado(!!session)
            setCarregando(false)
        }

        verificarSessao()

        //verificar mudanças de autenticação em outras abas
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setAutenticado(!!session)
        })

        //Cleanup: cancela a inscrição quando o componente for desmontado
        return () => subscription.unsubscribe()
    }, [])

    if(carregando){
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-purple-900 font-semibold">Carregando...</p>
            </div>
        )
    }

    if(!autenticado) {
        return <Navigate to="/" replace />
    }

    return children
}

export default RotaPrivada