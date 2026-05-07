// react
import { useState, useRef } from "react"

// auth
import { useToken } from "../auth/AuthProvider"

// components
import FormField from "../components/FormField"

// router
import { Link, useNavigate } from "react-router"

function Login() {
    const email = useRef("")
    const password = useRef("")

    const { token, setToken } = useToken()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.current,
                        password: password.current,
                    })
                })

            if (!res.ok) {
                const data = await res.text()
                setErr(data)
                setLoading(false)
                return
            }
            const data = await res.json()

            setToken(data.token)
            setErr(null)
            setLoading(false)
            navigate("/file")
        } catch {
            setLoading(false)
            setErr("Network error — please check your connection")
        }
    }

    if (token) {
        return <p>You are already logged in.</p>
    }

    return (
        <div className="form-card">
            <h1>Log in</h1>
            {err && (
                <div className="error-banner">
                    <span>{err}</span>
                    <button className="error-dismiss" onClick={() => setErr(null)}>×</button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <FormField
                    inputType="email"
                    inputId="email"
                    inputPlaceholder="email@example.com"
                    labelText="Email"
                    onChange={(e) => email.current = e.target.value}
                />
                <FormField
                    inputType="password"
                    inputId="password"
                    inputPlaceholder=""
                    labelText="Password"
                    onChange={(e) => password.current = e.target.value}
                />

                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
                Don't have an account? <Link to="/signup" style={{ color: "var(--accent)" }}>Sign up</Link>
            </p>
        </div>
    )
}

export default Login
