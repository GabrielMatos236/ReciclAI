import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Camera from "./pages/Camera"
import Mapa from "./pages/Mapa"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/Camera" element={<Camera />}/>
        <Route path="/Mapa" element={<Mapa />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App