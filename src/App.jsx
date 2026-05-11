import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"
import Cadastro from "./pages/Cadastro"
import MobileFrame from './components/MobileFrame'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/Camera" element={<Camera />}/>
        <Route path="/Mapa" element={<Mapa />}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App