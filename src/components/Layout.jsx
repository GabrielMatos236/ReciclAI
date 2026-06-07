import { Outlet } from 'react-router-dom'
import BarraNavegacao from './BarraNavegacao'

function Layout() {
    return (
        <>
            <Outlet />
            <BarraNavegacao />
        </>
    )
}

export default Layout
