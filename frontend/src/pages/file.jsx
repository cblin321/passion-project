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
            let res = await fetch(`${import.meta.env.VITE_API_URL}/file`,
                {
                    headers: {
                        "Authorization": `Bearer ${token.token}`
                    }
                })

            setLoading(false)
            if (!res.ok) {
                const msg = await res.text()
                setErr(msg)
                return
            }

            let data = await res.json()
            setFiles(data)
            console.log(data)

            //            res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
            //                headers: {
            //                    "Authrization": `Bearer ${token.token}`
            //                }
            //            })
            //
            //            // expect data to be user info
            //            const newUser = await res.json()
            //            setUser((prevUser) => {
            //                const idFields = ["id", "email"]
            //                if (!prevUser || !newUser)
            //                    return false
            //
            //                // if every unique identifier matches
            //                if (idFields.every(field => prevUser[field] === newUser[field]))
            //                    return prevUser
            //
            //                return newUser
            //            })
        }
        getFiles()
    }, [user])

    const fileItems = files ? files.map(file => {
        //        const role = file.fileUsers.filter(user => {
        //            return user.userId === user
        //        })
        //
        return <div key={file.id}>
            <p>{file.title}</p>
        </div>
    }) : null


    if (loading) {
        return <p>{loading}</p>
    }

    if (err) {
        return <p>{err}</p>
    }

    return <div>
        <h1>file dashboard</h1>
        {fileItems}
        <Outlet></Outlet>
    </div>
}

export default File
