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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    // Seta o user e libera o carregando IMEDIATAMENTE
                    // O perfil carrega em background sem bloquear a tela
                    setUser(session.user)
                    setCarregando(false)
                    carregarPerfil(session.user)
                } else {
                    setCarregando(false)
                }
            } else if (event === 'SIGNED_OUT') {
                setPerfil(null)
                setUser(null)
                setCarregando(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])
    async function carregarPerfil(authUser) {
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