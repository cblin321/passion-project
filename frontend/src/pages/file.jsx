//components 
import EditFile from "../components/edit_file"
import AddUser from "../components/add_user.jsx"
import UploadPopover from "../components/upload_popover"

// auth
import { useAuthHeader, useToken } from "../auth/AuthProvider"

// hooks
import { useState, useEffect, useCallback } from "react"

// icons
import { FileText, Download, Trash2 } from "lucide-react"

function File() {
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState()
    const [refreshKey, setRefreshKey] = useState(0)
    const [user, setUser] = useState()
    const authHeader = useAuthHeader()
    const { token } = useToken()

    const refetchFiles = useCallback(() => setRefreshKey(k => k + 1), [])

    const setFile = (newFile) => {
        const fileId = newFile.id
        setFiles(oldFiles => {
            const filteredFiles = oldFiles.filter(file => file.id !== fileId)
            return [...filteredFiles, newFile].sort((a, b) => a.title.localeCompare(b.title))
        })
    }

    const removeFile = (fileId) => {
        setFiles(oldFiles => oldFiles.filter(file => file.id !== fileId))
    }

    useEffect(() => {
        setLoading(true)
        async function getFiles() {
            try {
                let res = await fetch(`${import.meta.env.VITE_API_URL}/file`,
                    {
                        headers: authHeader
                    })

                setLoading(false)
                if (!res.ok) {
                    const msg = await res.text()
                    setErr(msg)
                    return
                }

                let data = await res.json()
                setFiles(data)
            } catch {
                setLoading(false)
                setErr("Network error — please check your connection")
            }
        }

        getFiles()
    }, [user, refreshKey])

    const handleDelete = async (fileId) => {
        if (!confirm("Are you sure you want to delete this file?")) return
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}`, {
                method: "DELETE",
                headers: authHeader
            })
            if (!res.ok) {
                setErr(await res.text())
                return
            }
            removeFile(fileId)
        } catch {
            setErr("Network error — please check your connection")
        }
    }

    const handleDownload = async (e, fileId) => {
        e.preventDefault()

        try {
            let res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}`, {
                headers: authHeader
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
            setErr(null)
        } catch {
            setErr("Network error — please check your connection")
        }
    }

    if (loading) {
        return <p className="loading">Loading your files...</p>
    }

    function jwtDecode(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]))
        } catch {
            return null
        }
    }

    const decoded = token ? jwtDecode(token) : null

    const fileItems = files ? files.map(file => {
        const currentFU = decoded ? file.fileUsers.find(fu => {
            if (decoded.id) return fu.userId === decoded.id
            if (decoded.email) return fu.user?.email === decoded.email
            return false
        }) : null
        const currentRole = currentFU?.role
        const isOwner = currentRole === "OWNER"
        const isViewer = currentRole === "VIEWER"

        return (
        <div key={file.id} className="card file-card">
            <div className="file-info">
                <FileText className="file-icon" size={36} />
                <span className="file-name">{file.title}</span>
            </div>
            <div className="file-actions">
                <button className="btn btn-sm btn-green" onClick={(e) => handleDownload(e, file.id)}>
                    <Download size={14} /> Download
                </button>
                {!isViewer && <EditFile file={file} setFile={setFile} currentRole={currentRole} />}
                {isViewer && <button className="btn btn-sm" disabled title="Only editors and owners can edit files">Edit</button>}
                <AddUser file={file} setFile={setFile} currentRole={currentRole} />
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(file.id)} disabled={!isOwner} title={isOwner ? "Delete file" : "Only owners can delete files"}>
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        </div>
    )}) : null

    return <div>
        {err && (
            <div className="error-banner">
                <span>{err}</span>
                <button className="error-dismiss" onClick={() => setErr(null)}>×</button>
            </div>
        )}
        <div className="page-header">
            <h1>My Files</h1>
            <UploadPopover onUpload={refetchFiles} />
        </div>

        {files && files.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <FileText size={48} style={{ color: "var(--text)", marginBottom: 16, opacity: 0.4 }} />
                <h3 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>No files yet</h3>
                <p style={{ margin: "0 0 24px", fontSize: 14 }}>Upload your first file to get started.</p>
                <UploadPopover onUpload={refetchFiles} />
            </div>
        ) : (
            <div className="file-list">
                {fileItems}
            </div>
        )}
    </div>
}

export default File
