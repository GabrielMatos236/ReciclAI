const EM_DEV = import.meta.env.DEV

export async function analisarImagem(imagemBase64, mediaType) {

  // Em produção (Vercel): chama a Function segura
  if (!EM_DEV) {
    const response = await fetch('/api/analisar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagemBase64, mediaType }),
    })
    if (!response.ok) {
      const erro = await response.json().catch(() => ({ erro: 'Erro desconhecido' }))
      throw new Error(erro.erro || `Erro ${response.status}`)
    }
    return response.json()
  }

  // Em dev local: chama a API direto (chave via VITE_ANTHROPIC_API_KEY)
  const prompt = `Você é um especialista em descarte sustentável de resíduos. Analise a imagem e responda EXCLUSIVAMENTE em JSON, sem nenhum texto antes ou depois, no seguinte formato:

{
  "tipoResiduo": "string (ex: Plástico, Papel, Vidro, Metal, Orgânico, Eletrônico, Não-reciclável)",
  "lixeira": "string (cor da lixeira: Vermelha, Azul, Verde, Amarela, Marrom, Cinza)",
  "explicacao": "string de NO MÁXIMO 100 CARACTERES explicando por que vai nessa lixeira",
  "dica": "string de NO MÁXIMO 80 CARACTERES com uma dica de descarte"
}

Cores das lixeiras (padrão brasileiro):
- Azul: Papel e papelão
- Vermelha: Plástico
- Verde: Vidro
- Amarela: Metal
- Marrom: Orgânico
- Cinza: Não-reciclável / Rejeito

IMPORTANTE: explicacao e dica devem ser extremamente curtas e diretas. Sem rodeios.

Se não identificar nenhum objeto descartável claro, retorne tipoResiduo "Indefinido".`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imagemBase64 } },
          { type: 'text', text: prompt }
        ]
      }]
    })
  })

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`Erro na API: ${erro}`)
  }

  const data = await response.json()
  let texto = data.content[0].text
  texto = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(texto)
}
