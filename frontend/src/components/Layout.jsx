import { Link, useNavigate } from "react-router"
import { useToken } from "../auth/AuthProvider"
import { FileText, LogOut, Upload, HomeIcon, LogIn, UserPlus } from "lucide-react"

function Nav() {
    const { token, setToken } = useToken()
    const navigate = useNavigate()

    const handleLogout = () => {
        setToken(null)
        navigate("/login")
    }

    return (
        <nav className="nav">
            <Link to={token ? "/file" : "/"} className="nav-brand">Passion Project</Link>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to="/file" className="nav-link"><FileText size={18} /> Files</Link>
                        <Link to="/file/create" className="nav-link"><Upload size={18} /> Upload</Link>
                        <button onClick={handleLogout} className="nav-link nav-logout"><LogOut size={18} /> Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link"><HomeIcon size={18} /> Home</Link>
                        <Link to="/login" className="nav-link"><LogIn size={18} /> Login</Link>
                        <Link to="/signup" className="nav-link nav-signup"><UserPlus size={18} /> Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

function Layout({ children }) {
    return (
        <div className="layout">
            <Nav />
            <main className="main">
                {children}
            </main>
        </div>
    )
}

export default Layout
