// Componente reutilizável — exportado pra usar na Home e no Perfil
export function Avatar({ nome, avatarUrl, tamanho = 40, className = '' }) {
    const iniciais = nome
        ? nome.trim().split(' ').slice(0, 2).map(p => p[0].toUpperCase()).join('')
        : '?'

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={nome}
                className={`rounded-full object-cover ${className}`}
                style={{ width: tamanho, height: tamanho }}
            />
        )
    }

    // Gera cor baseada no nome (sempre consistente pro mesmo usuário)
    const cores = [
        '#1d4ed8', '#0f766e', '#7c3aed', '#b45309',
        '#be123c', '#166534', '#1e40af', '#92400e'
    ]
    const idx = nome ? nome.charCodeAt(0) % cores.length : 0
    const cor = cores[idx]

    return (
        <div
            className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
            style={{ width: tamanho, height: tamanho, backgroundColor: cor, fontSize: tamanho * 0.35 }}
        >
            <span style={{ color: 'white' }}>{iniciais}</span>
        </div>
    )
}
