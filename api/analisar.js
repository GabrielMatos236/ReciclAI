export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' })
  }

  const { imagemBase64, mediaType } = req.body

  if (!imagemBase64 || !mediaType) {
    return res.status(400).json({ erro: 'imagemBase64 e mediaType são obrigatórios' })
  }

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

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // sem VITE_ — é server-side
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imagemBase64,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const erro = await response.text()
      return res.status(response.status).json({ erro })
    }

    const data = await response.json()
    let texto = data.content[0].text
    texto = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    return res.status(200).json(JSON.parse(texto))

  } catch (err) {
    console.error('Erro na Vercel Function:', err)
    return res.status(500).json({ erro: 'Erro interno ao processar imagem' })
  }
}
