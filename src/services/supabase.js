import { createClient } from "@supabase/supabase-js"; // -> Essa é a biblioteca oficial do cliente Supabase para JavaScript, que permite interagir com o projeto Supabase a partir de uma aplicação frontend.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL // -> Essa é a URL do projeto Supabase, que pode ser encontrada no painel do Supabase em Configurações do Projeto -> API.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY // -> Essa é a chave anônima do projeto Supabase, que pode ser encontrada no painel do Supabase em Configurações do Projeto -> API.

export const supabase = createClient(supabaseUrl, supabaseAnonKey) // -> Essa função cria uma instância do cliente Supabase, que pode ser usada para interagir com o banco de dados e outros serviços do Supabase. A instância é exportada para que possa ser utilizada em outras partes da aplicação.