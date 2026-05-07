// router
import { Outlet, Link } from "react-router-dom"

//components 
import EditFile from "../components/edit_file"
import AddUser from "../components/add_user.jsx"

// auth
import { useAuthHeader } from "../auth/AuthProvider"

// hooks
import { useState, useEffect } from "react"

// icons
import { FileText, Download, Upload } from "lucide-react"

function File() {
    const [err, setErr] = useState()
    const [loading, setLoading] = useState()
    const [files, setFiles] = useState()
    const [user, setUser] = useState()
    const authHeader = useAuthHeader()

    const setFile = (newFile) => {
        const fileId = newFile.id
        setFiles(oldFiles => {
            const filteredFiles = oldFiles.filter(file => file.id !== fileId)
            return [...filteredFiles, newFile]
        })
    }

    useEffect(() => {
        setLoading(true)
        async function getFiles() {
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

    if (loading) {
        return <p className="loading">Loading your files...</p>
    }

    const fileItems = files ? files.map(file => (
        <div key={file.id} className="card file-card">
            <div className="file-info">
                <FileText className="file-icon" size={36} />
                <span className="file-name">{file.title}</span>
            </div>
            <div className="file-actions">
                <button className="btn btn-sm" onClick={(e) => handleDownload(e, file.id)}>
                    <Download size={14} /> Download
                </button>
                <EditFile file={file} setFile={setFile} />
                <AddUser file={file} setFile={setFile} />
            </div>
        </div>
    )) : null

    if (err) {
        return <div>
            <div className="error-banner">{err}</div>
            <button className="btn" onClick={() => setErr(null)}>Dismiss</button>
        </div>
    }

    return <div>
        <div className="page-header">
            <h1>My Files</h1>
            <Link to="/file/create" className="btn btn-primary">
                <Upload size={18} /> Upload File
            </Link>
        </div>

        {files && files.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <FileText size={48} style={{ color: "var(--text)", marginBottom: 16, opacity: 0.4 }} />
                <h3 style={{ margin: "0 0 8px", color: "var(--text-h)" }}>No files yet</h3>
                <p style={{ margin: "0 0 24px", fontSize: 14 }}>Upload your first file to get started.</p>
                <Link to="/file/create" className="btn btn-primary">
                    <Upload size={18} /> Upload File
                </Link>
            </div>
        ) : (
            <div className="file-list">
                {fileItems}
            </div>
        )}

        <Outlet />
    </div>
}

export default File
