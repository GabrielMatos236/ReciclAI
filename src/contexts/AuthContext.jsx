// #4 Hierarquia do fluxo da aplicação - o Guarda //
import { createContext, useContext, useEffect, useState } from 'react' // -> Importa os hooks do React necessários para criar e gerenciar o contexto de autenticação, incluindo createContext para criar o contexto, useContext para acessar o contexto em componentes filhos, useEffect para lidar com efeitos colaterais e useState para gerenciar o estado local.
import { supabase } from '../services/supabase' // -> Importa a instância do Supabase, que é usada para interagir com o backend do Supabase, incluindo autenticação e operações de banco de dados.
const AuthContext = createContext(null) // -> Cria um contexto de autenticação usando createContext, que será usado para fornecer informações sobre o estado de autenticação do usuário para os componentes filhos. O valor inicial é definido como null, indicando que não há usuário autenticado inicialmente.
export function usePerfil() { // -> Cria um hook personalizado chamado usePerfil, que permite que os componentes filhos acessem facilmente o contexto de autenticação e obtenham informações sobre o perfil do usuário. Ele retorna o valor do contexto usando useContext(AuthContext), permitindo que os componentes acessem o perfil, o usuário autenticado e outras informações relacionadas à autenticação.
    return useContext(AuthContext)
}
export function AuthProvider({ children }) { // -> Cria um componente chamado AuthProvider, que envolve os componentes filhos e fornece o contexto de autenticação para eles. Ele recebe uma prop chamada children, que representa os componentes filhos que serão renderizados dentro do provedor de contexto.
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