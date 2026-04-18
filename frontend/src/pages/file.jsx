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

    const [err, setErr] = useState()
    const [loading, setLoading] = useState()
    const [files, setFiles] = useState()
    const [user, setUser] = useState()

    //if (!user)
    //    return <>
    //        <p>you must be logged in to view files</p>
    //    </>

    useEffect(() => {
        setLoading(true)
        async function getFiles() {
            // fetch files for current user
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file`,
                {
                    headers: {
                        "Authorization": `Bearer ${token.token}`
                    }
                })

            if (!res.ok) {
                setLoading(false)
                const msg = await res.text()
                setErr(msg)
                return
            }

            setLoading(false)

            // expect data to be user info
            const newUser = await res.json()
            console.log(newUser)
            setUser((prevUser) => {
                const idFields = ["id", "email"]
                if (!prevUser || !newUser)
                    return false

                // if every unique identifier matches
                if (idFields.every(field => prevUser[field] === newUser[field]))
                    return prevUser

                return newUser
            })
        }
        getFiles()
    }, [user])


    if (loading) {
        return <p>{loading}</p>
    }

    if (err) {
        return <p>{err}</p>
    }

    return <div>
        <h1>file dashboard</h1>
        <Outlet></Outlet>
    </div>
}

export default File
