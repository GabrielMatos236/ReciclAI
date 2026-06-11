import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function usePerfil() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [perfil, setPerfil]         = useState(null)
    const [user, setUser]             = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        // onAuthStateChange com INITIAL_SESSION cobre todos os casos:
        // - primeiro load, reload, pull-to-refresh, volta do background, login, logout
        // O Supabase dispara INITIAL_SESSION automaticamente ao montar,
        // então não precisamos chamar getSession() separado.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    await carregarPerfil(session.user)
                }
                setCarregando(false)
            } else if (event === 'SIGNED_OUT') {
                setPerfil(null)
                setUser(null)
                setCarregando(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function carregarPerfil(authUser) {
        setUser(authUser)
        try {
            const { data } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', authUser.id)
                .single()
            if (data) setPerfil(data)
        } catch (err) {
            console.error('Erro ao carregar perfil:', err)
        }
    }

    function atualizarPerfil(novosDados) {
        setPerfil(prev => ({ ...prev, ...novosDados }))
    }

    return (
        <AuthContext.Provider value={{ perfil, user, carregando, atualizarPerfil }}>
            {children}
        </AuthContext.Provider>
    )
}
