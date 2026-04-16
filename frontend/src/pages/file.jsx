// router
import { Outlet } from "react-router-dom"

// auth
import { useToken } from "../auth/AuthProvider"

// hooks
import { useState, useEffect } from "react"

// const 
import { API_URL } from "../const"

function File() {
    const token = useToken()

    const [files, setFiles] = useState()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    console.log(token.token)

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            const res = await fetch(`${API_URL}/file/create`, {
                headers: {
                    "Authorization": `Bearer ${token.token}`
                }
            })
            if (!res.ok) {
                setErr(res.text())
                setLoading(false)
                return
            }
            const files = await res.json()
            setLoading(false)
            setFiles(files)
        }

        fetchData()
    }, [])

    const isLoggedIn = !!token

    if (loading)
        return
    if (err)
        return
    if (!files)
        return

    return <div>
        <h1>file dashboard</h1>
        <Outlet></Outlet>
    </div>
}

export default File
