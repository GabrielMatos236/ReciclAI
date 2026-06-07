import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"
import FuncionarioHome from "./pages/FuncionarioHome"
import FuncionarioChamados from "./pages/FuncionarioChamados"
import Chamados from "./pages/Chamados"
import Aprenda from "./pages/Aprenda"
import Recompensas from "./pages/Recompensas"
import RotaPrivada from "./components/RotaPrivada"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Login />} />

        {/* Rotas Privadas */}
        <Route path="/home" element={<RotaPrivada><Home /></RotaPrivada>} />
        <Route path="/camera" element={<RotaPrivada><Camera /></RotaPrivada>} />
        <Route path="/mapa" element={<RotaPrivada><Mapa /></RotaPrivada>} />
        <Route path="/chamados" element={<RotaPrivada><Chamados /></RotaPrivada>} />
        <Route path="/aprenda" element={<RotaPrivada><Aprenda /></RotaPrivada>} />
        <Route path="/recompensas" element={<RotaPrivada><Recompensas /></RotaPrivada>} />
        <Route path="/funcionario/home" element={<RotaPrivada><FuncionarioHome /></RotaPrivada>} />
        <Route path="/funcionario/chamados" element={<RotaPrivada><FuncionarioChamados /></RotaPrivada>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
