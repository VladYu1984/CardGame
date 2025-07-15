import { Link } from 'react-router-dom'

function Navbar(){
    return(
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/registration'> Registration</Link>
            <Link to='/admin'> Admin</Link>
            <Link to='/login'> Login</Link>
        </nav>
    )
}
export default Navbar