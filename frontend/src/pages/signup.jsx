// react
import { useState, useRef } from "react"

// auth
import { useToken } from "../auth/AuthProvider"

// components
import FormField from "../components/FormField"

// router
import { Link, useNavigate } from "react-router"

function Signup() {
    const email = useRef("")
    const password = useRef("")

    const { token, setToken } = useToken()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`,
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
        setErr("")
        setLoading(false)
        navigate("/file")
    }

    if (token) {
        return <p>You are already logged in.</p>
    }

    return (
        <div className="form-card">
            <h1>Create account</h1>
            {err && <p className="form-error">{err}</p>}
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
                    {loading ? "Creating account..." : "Sign up"}
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
                Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Log in</Link>
            </p>
        </div>
    )
}

export default Signup
