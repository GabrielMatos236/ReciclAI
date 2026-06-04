import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"
import Cadastro from "./pages/Cadastro"
import FuncionarioHome from "./pages/FuncionarioHome"
import FuncionarioChamados from "./pages/FuncionarioChamados"
import Chamados from "./pages/Chamados"
import RotaPrivada from "./components/RotaPrivada"
import MobileFrame from './components/MobileFrame'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />}/>
        <Route path="/cadastro" element={<Cadastro/>}/>

        {/* Rotas Privadas */}
        <Route path="/home" element={
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        }/>
        <Route path="/camera" element={
          <RotaPrivada>
            <Camera />
          </RotaPrivada>
        }/>
        <Route path="/mapa" element={
          <RotaPrivada>
            <Mapa />
          </RotaPrivada>
        }/>
        <Route path="/funcionario/home" element={
          <RotaPrivada>
            <FuncionarioHome />
          </RotaPrivada>
        }/>

        <Route path="/funcionario/chamados" element={
          <RotaPrivada>
            <FuncionarioChamados />
          </RotaPrivada>
        }/>

        <Route path="/chamados" element={
          <RotaPrivada>
            <Chamados />
          </RotaPrivada>
        }/>

      </Routes>

      
    </BrowserRouter>
  )
}

export default App