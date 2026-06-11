import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function usePerfil() {
    return useContext(AuthContext)
}

// Helper: roda uma promise com timeout. Se demorar mais que `ms`, retorna o fallback.
// Crucial pro iOS Safari, onde getSession() pode travar indefinidamente após reload.
function comTimeout(promise, ms, fallback) {
    return Promise.race([
        promise,
        new Promise(resolve => setTimeout(() => resolve(fallback), ms))
    ])
}

export function AuthProvider({ children }) {
    const [perfil, setPerfil]         = useState(null)
    const [user, setUser]             = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        let cancelado = false

        async function inicializar() {
            // Timeout de 3s: se o Supabase travar (comum no iOS após pull-to-refresh),
            // assume que não tem sessão e libera a tela.
            const resultado = await comTimeout(
                supabase.auth.getSession(),
                3000,
                { data: { session: null } }
            )

            if (cancelado) return

            const session = resultado?.data?.session
            if (session?.user) {
                await carregarPerfil(session.user)
            }
            setCarregando(false)
        }

        inicializar()

        // Reage a login/logout. O Supabase também dispara este evento quando
        // a sessão é restaurada do storage, então cobre o caso de reload no iOS.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (cancelado) return

            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
                await carregarPerfil(session.user)
                setCarregando(false)
            } else if (event === 'SIGNED_OUT') {
                setPerfil(null)
                setUser(null)
            }
        })

        return () => {
            cancelado = true
            subscription.unsubscribe()
        }
    }, [])

    async function carregarPerfil(authUser) {
        setUser(authUser)
        try {
            const { data } = await comTimeout(
                supabase.from('perfis').select('*').eq('id', authUser.id).single(),
                3000,
                { data: null }
            )
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
