// #3 Hierarquia do fluxo da aplicação - o Cérebro //
import { BrowserRouter, Routes, Route } from "react-router-dom" // -> Importa os componentes do React Router para gerenciar a navegação entre páginas no aplicativo.
import { AuthProvider } from "./contexts/AuthContext" // -> Importa o provedor de contexto de autenticação, que fornece informações sobre o estado de autenticação do usuário para os componentes filhos. Isso impede que usuários não autenticados acessem certas rotas, garantindo que apenas usuários autorizados possam visualizar determinadas páginas.
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"
import FuncionarioHome from "./pages/FuncionarioHome"
import FuncionarioChamados from "./pages/FuncionarioChamados"
import FuncionarioMapa from "./pages/FuncionarioMapa"
import Chamados from "./pages/Chamados"
import Aprenda from "./pages/Aprenda"
import Recompensas from "./pages/Recompensas"
import Perfil from "./pages/Perfil"
import RotaPrivada from "./components/RotaPrivada"
import Layout from "./components/Layout"
import LayoutFuncionario from "./components/LayoutFuncionario"
// -> Import dos componentes e páginas do aplicativo, incluindo rotas públicas e privadas, provedores de contexto e layouts específicos para usuários e funcionários.

function App() { // -> Função principal do aplicativo React, que define a estrutura de navegação e as rotas da aplicação.
  return ( // -> Retorna a estrutura de navegação do aplicativo, que inclui o BrowserRouter para gerenciar a navegação, o AuthProvider para fornecer informações de autenticação e as rotas definidas usando o componente Routes.
    <BrowserRouter> {/* -> Componente que envolve toda a aplicação e permite o uso do React Router para gerenciar a navegação entre páginas. */}
      <AuthProvider> {/* -> Componente que fornece o contexto de autenticação para todos os componentes filhos, permitindo que eles acessem informações sobre o estado de autenticação do usuário. */}
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Login />} />

          {/* Rotas do usuário — com navbar do usuário */}
          <Route element={<Layout />}>
            <Route path="/home"        element={<RotaPrivada><Home /></RotaPrivada>} />
            <Route path="/camera"      element={<RotaPrivada><Camera /></RotaPrivada>} />
            <Route path="/mapa"        element={<RotaPrivada><Mapa /></RotaPrivada>} />
            <Route path="/chamados"    element={<RotaPrivada><Chamados /></RotaPrivada>} />
            <Route path="/aprenda"     element={<RotaPrivada><Aprenda /></RotaPrivada>} />
            <Route path="/recompensas" element={<RotaPrivada><Recompensas /></RotaPrivada>} />
            <Route path="/perfil"      element={<RotaPrivada><Perfil /></RotaPrivada>} />
          </Route>

          {/* Rotas do funcionário — com navbar do funcionário */}
          <Route element={<LayoutFuncionario />}>
            <Route path="/funcionario/home"     element={<RotaPrivada><FuncionarioHome /></RotaPrivada>} />
            <Route path="/funcionario/chamados" element={<RotaPrivada><FuncionarioChamados /></RotaPrivada>} />
            <Route path="/funcionario/mapa"     element={<RotaPrivada><FuncionarioMapa /></RotaPrivada>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
// Route dentro de Route permite que a definição de rotas aninhadas, onde uma rota pai pode ter várias rotas filhas. Isso é útil para criar layouts consistentes e reutilizáveis, como barras de navegação ou rodapés, que permanecem visíveis enquanto o conteúdo principal muda com base na rota filha selecionada.

export default App // -> Exporta o componente App como padrão, permitindo que ele seja importado e usado em outros arquivos do aplicativo, como no arquivo main.jsx, onde é renderizado dentro do StrictMode.
