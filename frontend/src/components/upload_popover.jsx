import { useRef, useState } from "react"

import FormField from "./FormField.jsx"
import { useAuthHeader } from "../auth/AuthProvider.jsx"
import Popover from "./Popover.jsx"
import { Upload } from "lucide-react"

function UploadPopover({ onUpload }) {
    const title = useRef("")
    const newFile = useRef()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)
    const authHeader = useAuthHeader()

    const handleSubmit = async (e, setOpen) => {
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
            if (!res.ok) { setErr(await res.text()); return }
            setErr(null)
            setOpen(false)
            if (onUpload) onUpload()
        } catch {
            setLoading(false)
            setErr("Network error — please check your connection")
        }
    }

    return (
        <Popover trigger={() => (
            <button className="btn btn-primary"><Upload size={18} /> Upload File</button>
        )} menuClass="popover-menu-accent">
            {(setOpen) => (
                <form onSubmit={(e) => handleSubmit(e, setOpen)}>
                    {err && <div className="error-banner" style={{ margin: "8px 16px" }}><span>{err}</span><button className="error-dismiss" onClick={() => setErr(null)}>×</button></div>}
                    <div className="popover-section">
                        <div className="popover-section-header" style={{ color: "var(--accent)" }}>Upload a file</div>
                        <FormField inputType="text" inputPlaceholder="Untitled File" labelText="Title" onChange={(e) => title.current = e.target.value} />
                        <FormField inputType="file" inputProps={{ name: "file" }} inputPlaceholder="Upload" labelText="File" onChange={(e) => newFile.current = e.target.files[0]} />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
                                {loading ? "Uploading..." : "Create file"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </Popover>
    )
}

export default UploadPopover