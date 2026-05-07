// auth
import { useToken, useAuthHeader } from "../auth/AuthProvider"

// hooks
import { useRef, useState } from "react"

// components
import FormField from "../components/FormField"

// router
import { redirect, useNavigate } from "react-router"

function CreateFile() {
    const token = useToken()
    if (!token)
        redirect("/login")

    const title = useRef("")
    const newFile = useRef()
    const [err, setErr] = useState()
    const [loading, setLoading] = useState()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("title", title.current)
        formData.append("file", newFile.current)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/create`, {
            method: "POST",
            ...useAuthHeader(),
            body: formData
        })

        setLoading(false)

        if (!res.ok) {
            const msg = await res.text()
            setErr(msg)
            return
        }

        setErr("")
        navigate("/file")
    }

    if (err)
        return <div className="error-banner">{err}</div>

    return (
        <div className="form-card">
            <h1>Upload a file</h1>
            <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                <FormField inputType="text" inputPlaceholder="Untitled File" labelText="Title" onChange={(e) => title.current = e.target.value} />
                <FormField inputType="file" inputProps={{ name: "file" }} inputPlaceholder="Upload" labelText="File" onChange={(e) => newFile.current = e.target.files[0]} />
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Create file"}
                </button>
            </form>
        </div>
    )
}

export default CreateFile
