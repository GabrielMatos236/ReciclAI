import { Outlet } from 'react-router-dom'
import BarraFuncionario from './BarraFuncionario'

function LayoutFuncionario() {
    return (
        <>
            <Outlet />
            <BarraFuncionario />
        </>
    )
}

export default LayoutFuncionario
