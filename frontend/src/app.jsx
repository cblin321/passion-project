// page imports
import Signup from "./pages/signup"
import Login from "./pages/login"
import Home from "./pages/home"

// react router imports
import { Routes, Route } from "react-router"

// service imports
import AuthProvider from "./auth/AuthProvider"

function App() {
    return <>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
            </Routes>
        </AuthProvider>
    </>
}

export default App
