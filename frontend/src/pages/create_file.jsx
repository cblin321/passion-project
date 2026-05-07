// auth
import { useAuthHeader } from "../auth/AuthProvider"

// hooks
import { useRef, useState } from "react"

// components
import FormField from "../components/FormField"

// router
import { Link, useNavigate } from "react-router"

function CreateFile() {
    const title = useRef("")
    const newFile = useRef()
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(false)
    const authHeader = useAuthHeader()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("title", title.current)
            formData.append("file", newFile.current)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/create`, {
                method: "POST",
                headers: authHeader,
                body: formData
            })

            setLoading(false)

            if (!res.ok) {
                const msg = await res.text()
                setErr(msg)
                return
            }

            setErr(null)
            navigate("/file")
        } catch {
            setLoading(false)
            setErr("Network error — please check your connection")
        }
    }

    return (
        <div className="form-card">
            <h1>Upload a file</h1>
            {err && (
                <div className="error-banner">
                    <span>{err}</span>
                    <button className="error-dismiss" onClick={() => setErr(null)}>×</button>
                </div>
            )}
            <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                <FormField inputType="text" inputPlaceholder="Untitled File" labelText="Title" onChange={(e) => title.current = e.target.value} />
                <FormField inputType="file" inputProps={{ name: "file" }} inputPlaceholder="Upload" labelText="File" onChange={(e) => newFile.current = e.target.files[0]} />
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Create file"}
                </button>
                <Link to="/file" className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Cancel</Link>
            </form>
        </div>
    )
}

export default CreateFile
