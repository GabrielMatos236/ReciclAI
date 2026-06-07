import { supabase } from './supabase'

/**
 * Incrementa os pontos do usuário logado.
 * @param {number} quantidade - quantos pontos adicionar (padrão: 10)
 */
export async function incrementarPontos(quantidade = 10) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Busca pontos atuais
        const { data: perfil, error: erroLeitura } = await supabase
            .from('perfis')
            .select('pontos')
            .eq('id', user.id)
            .single()

        if (erroLeitura || !perfil) return

        // Atualiza com o novo valor
        await supabase
            .from('perfis')
            .update({ pontos: (perfil.pontos || 0) + quantidade })
            .eq('id', user.id)

    } catch (err) {
        // Falha silenciosa — não deve travar a análise de imagem
        console.error('Erro ao incrementar pontos:', err)
    }
}
