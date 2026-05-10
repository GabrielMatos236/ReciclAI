# ReciclAI 🌱

App web sustentável que usa IA para classificar resíduos e indicar a lixeira correta no campus.

## 🚀 Tecnologias

- React + Vite
- Tailwind CSS
- Claude API (Anthropic) — classificação de imagens
- Supabase — autenticação e banco de dados
- Leaflet — mapas interativos
- React Router — navegação

## 📦 Como rodar

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/SEU-USUARIO/reciclai.git
cd reciclai
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Crie um arquivo `.env` na raiz com:
\`\`\`
VITE_ANTHROPIC_API_KEY=sua_chave
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_key
\`\`\`

4. Rode o projeto:
\`\`\`bash
npm run dev
\`\`\`

## ✨ Funcionalidades

- 🔐 Autenticação (usuário e funcionário)
- 📸 Análise de descarte com IA (Claude)
- 🗺️ Mapa do campus com pontos de coleta
- 🏆 Sistema de pontos e gamificação
- 🚨 Reportar lixeiras com problemas

## 👥 Autores

- Gabriel Ataide
- Rafael Cerutti

## 📄 Licença

Trabalho acadêmico - 2026