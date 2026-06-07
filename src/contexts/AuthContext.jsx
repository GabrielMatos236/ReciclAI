import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

// Hook pra usar em qualquer componente
export function usePerfil() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [perfil, setPerfil]     = useState(null)
    const [user, setUser]         = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        // Carrega sessão e perfil na inicialização
        async function inicializar() {
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                await carregarPerfil(session.user)
            }
            setCarregando(false)
        }

        inicializar()

        // Reage a login/logout em qualquer aba
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                await carregarPerfil(session.user)
            } else if (event === 'SIGNED_OUT') {
                setPerfil(null)
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function carregarPerfil(authUser) {
        setUser(authUser)
        const { data } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', authUser.id)
            .single()
        if (data) setPerfil(data)
    }

    // Atualiza o perfil no contexto (chamado pelo Perfil.jsx após editar nome)
    function atualizarPerfil(novosDados) {
        setPerfil(prev => ({ ...prev, ...novosDados }))
    }

    return (
        <AuthContext.Provider value={{ perfil, user, carregando, atualizarPerfil }}>
            {children}
        </AuthContext.Provider>
    )
}
