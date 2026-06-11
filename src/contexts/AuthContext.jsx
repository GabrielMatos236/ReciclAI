import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function usePerfil() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [perfil, setPerfil]         = useState(null)
    const [user, setUser]             = useState(null)
    const [carregando, setCarregando] = useState(true)

    // Guard: evita múltiplas chamadas simultâneas ao visibilitychange
    const carregandoPerfil = useRef(false)

    useEffect(() => {
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

        // Revalida sessão quando app volta do background (iOS/Android)
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                // Se já tem uma chamada em andamento, ignora
                if (carregandoPerfil.current) return
                carregandoPerfil.current = true

                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session?.user) {
                        await carregarPerfil(session.user)
                    } else {
                        setPerfil(null)
                        setUser(null)
                    }
                    setCarregando(false)
                } finally {
                    carregandoPerfil.current = false
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            subscription.unsubscribe()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
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

    function atualizarPerfil(novosDados) {
        setPerfil(prev => ({ ...prev, ...novosDados }))
    }

    return (
        <AuthContext.Provider value={{ perfil, user, carregando, atualizarPerfil }}>
            {children}
        </AuthContext.Provider>
    )
}
