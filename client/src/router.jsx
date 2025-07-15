import Home from './pages/Home'
import Registration from './pages/Registration'
import Admin from './pages/Admin'
import Login from './pages/Login'

const routes = [
    {
        path: '/home',
        element: <Home/>
    },
    {
        path: '/registration',
        element: <Registration/>
    },
    {
        path: '/admin',
        element: <Admin/>
    },
    {
        path: '/login',
        element: <Login/>
    },

]
export default routes