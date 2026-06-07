import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Star, Calendar, LogOut, Edit2, Check, X, Shield } from 'lucide-react'
import BarraNavegacao from '../components/BarraNavegacao'
import { Avatar } from '../components/Avatar'
import { supabase } from '../services/supabase'

function Perfil() {
    const navigate = useNavigate()
    const [perfil, setPerfil] = useState(null)
    const [email, setEmail] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [editandoNome, setEditandoNome] = useState(false)
    const [novoNome, setNovoNome] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        async function carregar() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { navigate('/'); return }

            setEmail(user.email || '')

            const { data } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setPerfil(data)
                setNovoNome(data.nome)
            }
            setCarregando(false)
        }
        carregar()
    }, [])

    useEffect(() => {
        if (editandoNome && inputRef.current) inputRef.current.focus()
    }, [editandoNome])

    async function salvarNome() {
        if (!novoNome.trim() || novoNome.trim() === perfil.nome) {
            setEditandoNome(false)
            return
        }
        setSalvando(true)
        const { error } = await supabase
            .from('perfis')
            .update({ nome: novoNome.trim() })
            .eq('id', perfil.id)

        if (error) {
            setFeedback({ tipo: 'erro', msg: 'Erro ao salvar. Tente novamente.' })
        } else {
            setPerfil(p => ({ ...p, nome: novoNome.trim() }))
            setFeedback({ tipo: 'sucesso', msg: 'Nome atualizado!' })
            setTimeout(() => setFeedback(null), 3000)
        }
        setSalvando(false)
        setEditandoNome(false)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        navigate('/')
    }

    function formatarData(iso) {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-blue-900 font-semibold">Carregando...</p>
            </div>
        )
    }

    const tipoLabel = perfil?.tipo === 'funcionario' ? 'Funcionário(a)' : 'Aluno(a)'

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* Header */}
            <div className="bg-gradient-to-tr from-blue-950 to-blue-700 rounded-b-[32px] pt-12 pb-16 px-6 relative">
                <button
                    onClick={() => navigate('/home')}
                    className="absolute left-5 top-12 bg-blue-800/60 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition"
                >
                    <ArrowLeft size={20} className="text-white" />
                </button>
                <h1 className="text-white text-xl font-bold text-center">Meu Perfil</h1>
            </div>

            {/* Avatar flutuando sobre o header */}
            <div className="flex flex-col items-center -mt-12 mb-4 px-6">
                <div className="ring-4 ring-white rounded-full shadow-xl">
                    <Avatar nome={perfil?.nome} avatarUrl={perfil?.avatar_url} tamanho={88} />
                </div>

                {/* Nome editável */}
                <div className="mt-3 flex items-center gap-2">
                    {editandoNome ? (
                        <>
                            <input
                                ref={inputRef}
                                value={novoNome}
                                onChange={e => setNovoNome(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && salvarNome()}
                                className="text-xl font-bold text-blue-900 text-center border-b-2 border-blue-700 bg-transparent outline-none w-48"
                            />
                            <button onClick={salvarNome} disabled={salvando} className="text-green-600 cursor-pointer">
                                <Check size={18} />
                            </button>
                            <button onClick={() => { setEditandoNome(false); setNovoNome(perfil.nome) }} className="text-red-400 cursor-pointer">
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-bold text-blue-900">{perfil?.nome}</p>
                            <button onClick={() => setEditandoNome(true)} className="text-gray-400 hover:text-blue-700 cursor-pointer transition">
                                <Edit2 size={15} />
                            </button>
                        </>
                    )}
                </div>

                <span className="text-xs text-gray-400 mt-0.5">{tipoLabel}</span>

                {/* Feedback */}
                {feedback && (
                    <div className={`mt-2 text-xs px-3 py-1.5 rounded-full font-semibold ${
                        feedback.tipo === 'sucesso' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {feedback.msg}
                    </div>
                )}
            </div>

            {/* Cards de stats */}
            <div className="px-6 mb-4">
                <div className="bg-emerald-100 rounded-3xl p-4 flex justify-around">
                    <div className="text-center">
                        <p className="text-emerald-800 text-2xl font-bold">{perfil?.pontos || 0}</p>
                        <p className="text-emerald-700 text-xs">Pontos</p>
                    </div>
                </div>
            </div>

            {/* Informações da conta */}
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

            {/* Ações */}
            <div className="px-6 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 ml-1">Conta</p>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-red-50 transition"
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
