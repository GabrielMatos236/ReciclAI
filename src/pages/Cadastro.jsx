import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import Text from '../assets/Text.png'

function Cadastro() {
    const navigate = useNavigate()
    
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [tipo, setTipo] = useState('usuario')
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(null)

    async function handleCadastro(e) {
        e.preventDefault()
        setCarregando(true)
        setErro(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome: nome,
                        tipo: tipo
                    }
                }
            })

            if (error) throw error

            // Sucesso! Vai pra home
            navigate('/home')
        } catch (err) {
            console.error(err)
            setErro(err.message || 'Erro ao cadastrar')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 flex flex-col items-center justify-center px-6 py-8">
            
            {/* Logo */}
            <div className="mb-1 flex flex-col items-center">
                <img src={Text} alt="ReciclAI" className="w-48 mb-2" />
            </div>

            {/* Card de cadastro */}
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Conta</h2>
                
                <form onSubmit={handleCadastro}>
                    <input 
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                    
                    <input 
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                    
                    <input 
                        type="password"
                        placeholder="Senha (mínimo 6 caracteres)"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                    
                    {/* Seletor de tipo */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Eu sou:</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTipo('usuario')}
                                className={`flex-1 py-2 rounded-xl font-semibold cursor-pointer transition ${
                                    tipo === 'usuario' 
                                        ? 'bg-purple-700 text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                Aluno(a)
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipo('funcionario')}
                                className={`flex-1 py-2 rounded-xl font-semibold cursor-pointer transition ${
                                    tipo === 'funcionario' 
                                        ? 'bg-purple-700 text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                Funcionário(a)
                            </button>
                        </div>
                    </div>
                    
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
                        {carregando ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                </form>
                
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Já tem conta? <span 
                        onClick={() => navigate('/')}
                        className="text-purple-700 font-semibold cursor-pointer"
                    >Entrar</span>
                </p>
            </div>
        </div>
    )
}

export default Cadastro