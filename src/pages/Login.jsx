import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import Text from '../assets/Text.png'

function Login() {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(null)

    async function handleLogin(e) {
        e.preventDefault()
        setCarregando(true)
        setErro(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: senha
            })

            if (error) throw error

            // Login bem-sucedido!
            navigate('/home')
        } catch (err) {
            console.error(err)
            
            // Mensagem amigável dependendo do erro
            if (err.message.includes('Invalid login credentials')) {
                setErro('E-mail ou senha incorretos')
            } else {
                setErro(err.message || 'Erro ao entrar')
            }
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 flex flex-col items-center justify-center px-6">
            
            {/* Logo */}
            <div className="mb-1 flex flex-col items-center">
                <img src={Text} alt="ReciclAI" className="w-48 mb-2" />
            </div>

            {/* Card de login */}
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Entrar</h2>
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                    
                    <input 
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                    
                    {/* Mensagem de erro */}
                    {erro && (
                        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl mb-3 text-sm">
                            {erro}
                        </div>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition cursor-pointer disabled:opacity-50"
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Não tem conta? <span 
                        onClick={() => navigate('/cadastro')}
                        className="text-purple-700 font-semibold cursor-pointer"
                    >Cadastre-se</span>
                </p>
            </div>
        </div>
    )
}

export default Login