export async function analisarImagem(imagemBase64, mediaType) {
  const response = await fetch('/api/analisar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imagemBase64, mediaType }),
  })

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ erro: 'Erro desconhecido' }))
    throw new Error(erro.erro || `Erro ${response.status}`)
  }

  return response.json()
}
