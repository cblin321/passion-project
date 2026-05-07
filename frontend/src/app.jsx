// page imports
import Signup from "./pages/signup"
import Login from "./pages/login"
import Home from "./pages/home"
import File from "./pages/file"

// react router imports
import { Routes, Route } from "react-router"

// service imports
import AuthProvider from "./auth/AuthProvider"

// layout
import Layout from "./components/Layout"

function App() {
    return <>
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="/file/" element={<File />} />
                </Routes>
            </Layout>
        </AuthProvider>
    </>
}

export default App
