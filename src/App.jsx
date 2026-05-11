import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"
import Cadastro from "./pages/Cadastro"
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
        <Route path="/Camera" element={
          <RotaPrivada>
            <Camera />
          </RotaPrivada>
        }/>
        <Route path="/Mapa" element={
          <RotaPrivada>
            <Mapa />
          </RotaPrivada>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App