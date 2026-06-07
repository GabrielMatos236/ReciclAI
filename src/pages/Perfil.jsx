import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, LogOut, Edit2, Check, X, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'
import { Avatar } from '../components/Avatar'
import { usePerfil } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

function Perfil() {
    const navigate = useNavigate()
    const { perfil: perfilCtx, atualizarPerfil } = usePerfil()
    const [perfil, setPerfil] = useState(null)
    const [email, setEmail] = useState('')
    const [carregando, setCarregando] = useState(true)

    // Edição de nome
    const [editandoNome, setEditandoNome] = useState(false)
    const [novoNome, setNovoNome] = useState('')
    const [salvando, setSalvando] = useState(false)
    const inputNomeRef = useRef(null)

    // Alteração de senha
    const [senhaAberta, setSenhaAberta] = useState(false)
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [salvandoSenha, setSalvandoSenha] = useState(false)

    // Feedback
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        async function carregar() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { navigate('/'); return }
            setEmail(user.email || '')
            const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single()
            if (data) { setPerfil(data); setNovoNome(data.nome) }
            setCarregando(false)
        }
        carregar()
    }, [])

    useEffect(() => {
        if (editandoNome && inputNomeRef.current) inputNomeRef.current.focus()
    }, [editandoNome])

    function mostrarFeedback(tipo, msg) {
        setFeedback({ tipo, msg })
        setTimeout(() => setFeedback(null), 3500)
    }

    async function salvarNome() {
        if (!novoNome.trim() || novoNome.trim() === perfil.nome) { setEditandoNome(false); return }
        setSalvando(true)
        const { error } = await supabase.from('perfis').update({ nome: novoNome.trim() }).eq('id', perfil.id)
        if (error) mostrarFeedback('erro', 'Erro ao salvar nome.')
        else {
            const nomeAtualizado = novoNome.trim()
            setPerfil(p => ({ ...p, nome: nomeAtualizado }))
            atualizarPerfil({ nome: nomeAtualizado })  // atualiza Home e outros instantaneamente
            mostrarFeedback('sucesso', 'Nome atualizado!')
        }
        setSalvando(false)
        setEditandoNome(false)
    }

    async function salvarSenha() {
        if (novaSenha.length < 6) { mostrarFeedback('erro', 'A senha deve ter pelo menos 6 caracteres.'); return }
        if (novaSenha !== confirmarSenha) { mostrarFeedback('erro', 'As senhas não coincidem.'); return }
        setSalvandoSenha(true)
        const { error } = await supabase.auth.updateUser({ password: novaSenha })
        if (error) mostrarFeedback('erro', 'Erro ao alterar senha.')
        else {
            mostrarFeedback('sucesso', 'Senha alterada com sucesso!')
            setNovaSenha(''); setConfirmarSenha(''); setSenhaAberta(false)
        }
        setSalvandoSenha(false)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        navigate('/')
    }

    function formatarData(iso) {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    if (carregando) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-blue-900 font-semibold">Carregando...</p>
        </div>
    )

    const tipoLabel = perfil?.tipo === 'funcionario' ? 'Funcionário(a)' : 'Aluno(a)'

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* Header com recorte circular para o avatar */}
            <div className="relative bg-gradient-to-tr from-blue-950 to-blue-700 pt-12 pb-0">

                {/* Botão voltar */}
                <button
                    onClick={() => navigate('/home')}
                    className="absolute left-5 top-12 bg-blue-800/60 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition z-10"
                >
                    <ArrowLeft size={20} className="text-white" />
                </button>

                <h1 className="text-white text-xl font-bold text-center mb-6">Meu Perfil</h1>

                {/* Avatar encaixado no final do header */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full ring-4 ring-white shadow-xl translate-y-12 z-10 relative">
                        <Avatar nome={perfil?.nome} avatarUrl={perfil?.avatar_url} tamanho={96} className="w-full h-full" />
                    </div>
                </div>

                {/* Curva que "abraça" o avatar */}
                <div
                    className="w-full bg-gray-100"
                    style={{
                        height: 48,
                        borderTopLeftRadius: '50% 100%',
                        borderTopRightRadius: '50% 100%',
                        marginTop: 0,
                    }}
                />
            </div>

            {/* Nome + tipo abaixo do avatar */}
            <div className="flex flex-col items-center mt-10 mb-4 px-6">
                <div className="flex items-center gap-2">
                    {editandoNome ? (
                        <>
                            <input
                                ref={inputNomeRef}
                                value={novoNome}
                                onChange={e => setNovoNome(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && salvarNome()}
                                className="text-xl font-bold text-blue-900 text-center border-b-2 border-blue-700 bg-transparent outline-none w-48"
                            />
                            <button onClick={salvarNome} disabled={salvando} className="text-green-600 cursor-pointer"><Check size={18} /></button>
                            <button onClick={() => { setEditandoNome(false); setNovoNome(perfil.nome) }} className="text-red-400 cursor-pointer"><X size={18} /></button>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-bold text-blue-900">{perfil?.nome}</p>
                            <button onClick={() => setEditandoNome(true)} className="text-gray-400 hover:text-blue-700 cursor-pointer transition"><Edit2 size={15} /></button>
                        </>
                    )}
                </div>
                <span className="text-xs text-gray-400 mt-0.5">{tipoLabel}</span>

                {feedback && (
                    <div className={`mt-2 text-xs px-3 py-1.5 rounded-full font-semibold ${feedback.tipo === 'sucesso' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {feedback.msg}
                    </div>
                )}
            </div>

            {/* Card de pontos */}
            <div className="px-6 mb-4">
                <div className="bg-emerald-100 rounded-3xl p-4 flex justify-center">
                    <div className="text-center">
                        <p className="text-emerald-800 text-2xl font-bold">{perfil?.pontos || 0}</p>
                        <p className="text-emerald-700 text-xs">Pontos</p>
                    </div>
                </div>
            </div>

            {/* Informações */}
            <div className="px-6 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 ml-1">Informações</p>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Mail size={15} className="text-blue-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">E-mail</p>
                            <p className="text-blue-900 text-sm font-semibold truncate">{email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Shield size={15} className="text-purple-700" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Tipo de conta</p>
                            <p className="text-blue-900 text-sm font-semibold">{tipoLabel}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Calendar size={15} className="text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Membro desde</p>
                            <p className="text-blue-900 text-sm font-semibold">{formatarData(perfil?.created_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conta */}
            <div className="px-6 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 ml-1">Conta</p>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">

                    {/* Alterar senha */}
                    <button
                        onClick={() => setSenhaAberta(p => !p)}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer border-b border-gray-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Lock size={15} className="text-blue-700" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-blue-900 text-sm font-semibold">Alterar senha</p>
                            <p className="text-gray-400 text-xs">Definir nova senha de acesso</p>
                        </div>
                        <X size={16} className={`text-gray-300 transition-transform ${senhaAberta ? 'rotate-0' : 'rotate-45'}`} />
                    </button>

                    {/* Form de nova senha */}
                    {senhaAberta && (
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex flex-col gap-3">
                            <div className="relative">
                                <input
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="Nova senha"
                                    value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-700 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder="Confirmar nova senha"
                                value={confirmarSenha}
                                onChange={e => setConfirmarSenha(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-700 bg-white"
                            />
                            <button
                                onClick={salvarSenha}
                                disabled={salvandoSenha || !novaSenha || !confirmarSenha}
                                className="w-full bg-blue-700 text-white py-3 rounded-2xl text-sm font-bold cursor-pointer hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {salvandoSenha ? 'Salvando...' : 'Salvar nova senha'}
                            </button>
                        </div>
                    )}

                    {/* Sair */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <LogOut size={15} className="text-red-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-red-600 text-sm font-semibold">Sair da conta</p>
                            <p className="text-gray-400 text-xs">Encerrar sessão atual</p>
                        </div>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Perfil
