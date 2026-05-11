import { use } from 'react'
import Text from '../assets/Text.png'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 flex flex-col items-center justify-center px-6">
      
      {/* Logo */}
      <div className="mb-1 flex flex-col items-center">
        <img
            src={Text}
            alt="ReciclAI"
            className="w-48 mb-2"
        />
      </div>

      {/* Card de login */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Entrar</h2>
        
        <input 
          type="email"
          placeholder="E-mail"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
        />
        
        <input 
          type="password"
          placeholder="Senha"
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
        />
        
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition cursor-pointer">
          Entrar
        </button>
        
        <p className="text-center text-gray-600 mt-4 text-sm">
          Não tem conta? <span onClick={() => navigate("/cadastro")} className="text-purple-700 font-semibold cursor-pointer">Cadastre-se</span>
        </p>
      </div>
      
    </div>
  )
}

export default Login