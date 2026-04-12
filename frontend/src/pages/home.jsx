// service imports
import { useToken } from "../auth/AuthProvider"

//react imports
import { useState } from "react"

function Home() {
    const { token, setToken } = useToken()
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState("")
    const handleLogout = async () => {
        if (!token) {
            setErr("You must be logged in to log out")
            return
        }

        setToken(null)
        setLoading(false)
    }


    return <div>
        <p>home</p>
        <button onClick={handleLogout}>Logout</button>
    </div>
}

export default Home
