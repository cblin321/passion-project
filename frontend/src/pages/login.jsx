// react
import { useState, useRef } from "react"

// providers
import { useToken } from "../auth/AuthProvider"

// components
import FormField from "../components/FormField"

function Login() {

    const email = useRef("")
    const password = useRef("")

    const { token, setToken } = useToken()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

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
        setErr("")
        setLoading(false)
        //redirect("/")
    }

    return <>
        {token ? (
            <p>you are already logged in</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <h1>login</h1>
                <p>Login token: {token}</p>
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

                <button type="submit" disabled={loading}>Log in</button>
            </form>
        )}

    </>
}

export default Login
