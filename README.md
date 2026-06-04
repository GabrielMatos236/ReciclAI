# ReciclAI

Aplicação web progressiva de sustentabilidade desenvolvida para o campus universitário da FAPA. O sistema utiliza inteligência artificial para classificar resíduos por meio de imagens e orientar o usuário à lixeira correta, integrando mapeamento geográfico real do campus e um sistema de chamados para manutenção das lixeiras.

---

## Funcionalidades

**Para usuários:**
- Autenticação com e-mail e senha via Supabase Auth
- Análise de resíduos por imagem com classificação via Claude AI (Haiku), retornando tipo do resíduo, lixeira correta, explicação e dica de descarte
- Mapa interativo do campus com 30 lixeiras distribuídas por 6 prédios, filtráveis por prédio e por tipo de resíduo
- Navegação inteligente entre a tela de análise e o mapa, com filtro pré-ativo baseado no resultado da IA
- Sistema de chamados para reportar problemas em lixeiras (lixeira cheia, quebrada, descarte irregular)
- Pontuação acumulada por uso do sistema

**Para funcionários:**
- Painel exclusivo de gerenciamento de chamados
- Visualização de chamados por status: pendente, em andamento, resolvido
- Atualização de status com rastreamento por token único (formato RC-XXXXXX)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite 8 |
| Estilização | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| Backend as a Service | Supabase (Auth + PostgreSQL + RLS) |
| Inteligência Artificial | Anthropic Claude Haiku 4.5 |
| Mapas | Leaflet + React Leaflet + OpenStreetMap |
| Ícones | Lucide React |
| Deploy | Vercel (planejado) |

---

## Estrutura do projeto

```
src/
  assets/          # Imagens e recursos estaticos
  components/
    BarraNavegacao.jsx   # Navegacao inferior com indicador de aba ativa
    MobileFrame.jsx      # Frame de dispositivo movel para apresentacao
    RotaPrivada.jsx      # HOC de protecao de rotas autenticadas
  pages/
    Login.jsx            # Autenticacao
    Cadastro.jsx         # Registro com selecao de perfil (usuario/funcionario)
    Home.jsx             # Dashboard principal com pontos e atalhos
    Camera.jsx           # Captura e analise de imagem via IA
    Mapa.jsx             # Mapa interativo com filtros
    Chamados.jsx         # Abertura de chamado pelo usuario
    FuncionarioHome.jsx  # Painel do funcionario
    FuncionarioChamados.jsx # Gerenciamento de chamados
  services/
    supabase.js          # Cliente Supabase configurado
    claudeAPI.js         # Integracao com a API da Anthropic
  utils/
    Coordenadas.txt      # Referencia geografica do campus
```

---

## Banco de dados

O projeto utiliza PostgreSQL via Supabase com Row Level Security (RLS) habilitado em todas as tabelas.

**Tabela `perfis`**

| Coluna | Tipo | Descricao |
|---|---|---|
| id | uuid | Referencia para auth.users |
| nome | text | Nome do usuario |
| tipo | text | 'usuario' ou 'funcionario' |
| pontos | integer | Pontuacao acumulada (default 0) |
| created_at | timestamptz | Data de criacao |

**Tabela `chamados`**

| Coluna | Tipo | Descricao |
|---|---|---|
| id | uuid | Identificador unico |
| usuario_id | uuid | FK para perfis |
| tipo | text | Categoria do problema |
| descricao | text | Descricao livre |
| status | text | 'pendente', 'em_andamento' ou 'resolvido' |
| foto_url | text | URL da foto (opcional) |
| created_at | timestamptz | Data de abertura |

**Trigger:** `on_auth_user_created` popula automaticamente a tabela `perfis` a partir dos metadados do cadastro.

**Politicas RLS:**
- Usuarios visualizam e editam apenas o proprio perfil
- Usuarios visualizam apenas os proprios chamados
- Funcionarios visualizam e atualizam todos os chamados

---

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_ANTHROPIC_API_KEY=sua_chave_anthropic
```

> Atencao: a chave da Anthropic esta exposta no bundle do frontend nesta versao de desenvolvimento. A versao de producao utilizara uma Vercel Function para intermediar as chamadas a API e manter a chave segura no servidor.

---

## Instalacao e execucao

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento (acessivel na rede local)
npm run dev -- --host

# Build de producao
npm run build
```

---

## Perfis de acesso

O sistema possui dois perfis com fluxos distintos:

**Usuario comum:** acessa Home, Camera, Mapa e pode abrir chamados.

**Funcionario:** acessa o painel de gerenciamento de chamados com controle de status.

O redirecionamento apos login e feito automaticamente com base no campo `tipo` do perfil, consultado no Supabase imediatamente apos a autenticacao.

---

## Pendencias tecnicas para producao

- Migrar chamadas a API da Anthropic para Vercel Function (protecao da chave)
- Migrar array de lixeiras do frontend para tabela `lixeiras` no Supabase
- Implementar leitura de QR Code para identificacao de lixeiras no fluxo de chamados
- Configurar PWA (manifest + service worker) para instalacao no dispositivo
- Substituir captura via `input[capture]` por `getUserMedia` para visor de camera nativo no app
- Implementar sistema de recompensas vinculado aos pontos acumulados

---

## Autores

Desenvolvido por Gabriel e Rafael como projeto de conclusao de disciplinas do 7 semestre — FAPA, 2026.