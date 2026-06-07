import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import logo from "../assets/logo.png"
import textLogo from "../assets/Text.png"

// Fases da tela: splash → escolha → login | cadastro
const FASE = {
  SPLASH: 'splash',
  ESCOLHA: 'escolha',
  LOGIN: 'login',
  CADASTRO: 'cadastro',
}

function Login() {
  const navigate = useNavigate()

  const [fase, setFase] = useState(FASE.SPLASH)
  const [splashSaindo, setSplashSaindo] = useState(false)  // controla fade-out do splash
  const [formVisivel, setFormVisivel] = useState(false)     // controla fade-in do form

  // Campos de login
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')

  // Campos extras de cadastro
  const [nome, setNome]     = useState('')
  const [tipo, setTipo]     = useState('usuario')

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]             = useState(null)

  // Sequência do splash: 2s visível → fade out → mostra escolha
  useEffect(() => {
    const timerSair = setTimeout(() => {
      setSplashSaindo(true)
    }, 2000)

    const timerProximo = setTimeout(() => {
      setFase(FASE.ESCOLHA)
      setSplashSaindo(false)
    }, 2600) // 2000ms + 600ms de fade

    return () => {
      clearTimeout(timerSair)
      clearTimeout(timerProximo)
    }
  }, [])

  // Fade-in do form ao entrar em login/cadastro
  useEffect(() => {
    if (fase === FASE.LOGIN || fase === FASE.CADASTRO) {
      setFormVisivel(false)
      const t = setTimeout(() => setFormVisivel(true), 50)
      return () => clearTimeout(t)
    }
  }, [fase])

  function irParaLogin() {
    setErro(null)
    setFase(FASE.LOGIN)
  }

  function irParaCadastro() {
    setErro(null)
    setFase(FASE.CADASTRO)
  }

  function voltarParaEscolha() {
    setErro(null)
    setFase(FASE.ESCOLHA)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) throw error

      const { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .select('tipo')
        .eq('id', data.user.id)
        .single()

      if (perfilError) throw perfilError

      navigate(perfil?.tipo === 'funcionario' ? '/funcionario/home' : '/home')
    } catch (err) {
      setErro(err.message?.includes('Invalid login credentials')
        ? 'E-mail ou senha incorretos.'
        : (err.message || 'Erro ao entrar.'))
    } finally {
      setCarregando(false)
    }
  }

  async function handleCadastro(e) {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome, tipo } }
      })
      if (error) throw error

      if (data.user) {
        const { error: perfilError } = await supabase
          .from('perfis')
          .insert({ id: data.user.id, nome, tipo, pontos: 0 })
        if (perfilError) throw perfilError
      }

      navigate(tipo === 'funcionario' ? '/funcionario/home' : '/home')
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar.')
    } finally {
      setCarregando(false)
    }
  }

  // ── SPLASH ──────────────────────────────────────────────────────────────────
  if (fase === FASE.SPLASH) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1d4ed8 100%)',
          transition: 'opacity 0.6s ease',
          opacity: splashSaindo ? 0 : 1,
        }}
      >
        <img
          src={logo}
          alt="ReciclAI ícone"
          className="w-36 h-36 object-contain mb-6"
          style={{
            transition: 'transform 0.6s ease, opacity 0.6s ease',
            transform: splashSaindo ? 'scale(0.9)' : 'scale(1)',
            opacity: splashSaindo ? 0 : 1,
          }}
        />
        <img
          src={textLogo}
          alt="ReciclAI"
          className="w-48 object-contain"
          style={{
            transition: 'transform 0.6s ease, opacity 0.6s ease',
            transitionDelay: '0.05s',
            transform: splashSaindo ? 'translateY(8px)' : 'translateY(0)',
            opacity: splashSaindo ? 0 : 1,
          }}
        />
      </div>
    )
  }

  // Gradiente de fundo compartilhado por escolha/login/cadastro
  const bgStyle = { background: 'linear-gradient(135deg, #0a1628 0%, #1d4ed8 100%)' }

  // ── TELA DE ESCOLHA ─────────────────────────────────────────────────────────
  if (fase === FASE.ESCOLHA) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-between py-20 px-8"
        style={bgStyle}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <img src={logo} alt="ReciclAI ícone" className="w-28 h-28 object-contain" />
          <img src={textLogo} alt="ReciclAI" className="w-44 object-contain" />
        </div>

        {/* Botões */}
        <div className="w-full flex flex-col gap-4">
          {/* Login — fundo branco, texto azul */}
          <button
            onClick={irParaLogin}
            className="w-full py-4 rounded-2xl font-bold text-lg cursor-pointer transition-all active:scale-95"
            style={{ background: 'white', color: '#1d4ed8' }}
          >
            Entrar
          </button>

          {/* Cadastro — só borda, texto branco */}
          <button
            onClick={irParaCadastro}
            className="w-full py-4 rounded-2xl font-bold text-lg cursor-pointer transition-all active:scale-95"
            style={{ background: 'transparent', border: '2px solid white', color: 'white' }}
          >
            Criar conta
          </button>
        </div>
      </div>
    )
  }

  // ── FORMULÁRIOS (LOGIN e CADASTRO) ──────────────────────────────────────────
  const ehCadastro = fase === FASE.CADASTRO

  return (
    <div
      className="h-screen flex flex-col"
      style={bgStyle}
    >
      {/* Área do logo — encolhe para dar espaço ao form */}
      <div
        className="flex flex-col items-center justify-center flex-shrink-0"
        style={{ paddingTop: '3rem', paddingBottom: '2rem' }}
      >
        <img src={logo} alt="ReciclAI ícone" className="w-20 h-20 object-contain mb-3" />
        <img src={textLogo} alt="ReciclAI" className="w-36 object-contain" />
      </div>

      {/* Card do form — cresce a partir de baixo */}
      <div
        className="flex-1 rounded-t-[32px] flex flex-col px-7 pt-8 pb-10"
        style={{
          background: 'white',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          opacity: formVisivel ? 1 : 0,
          transform: formVisivel ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        <h2 className="text-2xl font-bold text-blue-950 mb-1">
          {ehCadastro ? 'Criar conta' : 'Bem-vindo de volta!'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {ehCadastro ? 'Junte-se ao ReciclAI' : 'Entre para continuar reciclando'}
        </p>

        <form
          onSubmit={ehCadastro ? handleCadastro : handleLogin}
          className="flex flex-col gap-3 flex-1"
        >
          {/* Campo extra: nome (só no cadastro) */}
          {ehCadastro && (
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-700 bg-gray-50"
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-700 bg-gray-50"
          />

          <input
            type="password"
            placeholder={ehCadastro ? 'Senha (mínimo 6 caracteres)' : 'Senha'}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            minLength={ehCadastro ? 6 : undefined}
            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-700 bg-gray-50"
          />

          {/* Seletor de tipo (só cadastro) */}
          {ehCadastro && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipo('usuario')}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm cursor-pointer transition"
                style={{
                  background: tipo === 'usuario' ? '#1e3a8a' : '#f3f4f6',
                  color: tipo === 'usuario' ? 'white' : '#6b7280',
                }}
              >
                Aluno(a)
              </button>
              <button
                type="button"
                onClick={() => setTipo('funcionario')}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm cursor-pointer transition"
                style={{
                  background: tipo === 'funcionario' ? '#1e3a8a' : '#f3f4f6',
                  color: tipo === 'funcionario' ? 'white' : '#6b7280',
                }}
              >
                Funcionário(a)
              </button>
            </div>
          )}

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {erro}
            </div>
          )}

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-4 rounded-2xl font-bold text-base cursor-pointer transition-all active:scale-95 disabled:opacity-50 mt-1"
            style={{ background: '#1d4ed8', color: 'white' }}
          >
            {carregando
              ? (ehCadastro ? 'Criando conta...' : 'Entrando...')
              : (ehCadastro ? 'Criar conta' : 'Entrar')}
          </button>

          {/* Trocar entre login e cadastro */}
          <p className="text-center text-gray-400 text-sm mt-auto pt-4">
            {ehCadastro ? 'Já tem conta? ' : 'Não tem conta? '}
            <span
              onClick={ehCadastro ? irParaLogin : irParaCadastro}
              className="font-bold cursor-pointer"
              style={{ color: '#1d4ed8' }}
            >
              {ehCadastro ? 'Entrar' : 'Criar conta'}
            </span>
          </p>
        </form>

      </div>
    </div>
  )
}

export default Login
