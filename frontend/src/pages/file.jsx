// router
import { Outlet } from "react-router-dom"

//components 
import { EditFile } from "../components/edit_file"

// auth
import { useToken, useAuthHeader } from "../auth/AuthProvider"

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
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        setLoading(true)
        async function getFiles() {
            // fetch files for current user
            let res = await fetch(`${import.meta.env.VITE_API_URL}/file`,
                {
                    ...useAuthHeader(),
                })

            setLoading(false)
            if (!res.ok) {
                const msg = await res.text()
                setErr(msg)
                return
            }

            let data = await res.json()
            setFiles(data)

        }

        getFiles()
    }, [user])

    const handleDownload = async (e, fileId) => {
        e.preventDefault()

        let res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}`, {
            ...useAuthHeader(),
        })
        if (!res.ok) {
            setErr(await res.text())
            return
        }
        let filename = res.headers.get("Content-Disposition").split("filename=")[1]
        filename = filename.match("\"(.+)\"")[1]
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = filename
        a.href = url

        a.click()
        setErr("")
    }

    const fileItems = files ? files.map(file => {

        return <div key={file.id}>
            <p>{file.title}</p>
            <button onClick={(e) => { handleDownload(e, file.id) }}>Download</button>
            <button onClick={() => setUpdating(true)}>Update</button>
            <EditFile updating={updating} name={file.title} users={file.fileUsers} fileId={file.id}>
            </EditFile>
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
