import { useState } from "react"

import FormField from "./FormField.jsx"
import { useAuthHeader } from "../auth/AuthProvider.jsx"
import Popover from "./Popover.jsx"

const FILE_ROLES = ["OWNER", "EDITOR", "VIEWER"]
const ROLE_LEVEL = { OWNER: 3, EDITOR: 2, VIEWER: 1 }

function AddUser({ file, setFile, currentRole }) {
    const authHeader = useAuthHeader()
    const allowedRoles = FILE_ROLES.filter(r => ROLE_LEVEL[r] <= ROLE_LEVEL[currentRole])
    const roleOptions = allowedRoles.map(role => {
        const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
        return <option key={role} value={role}>{val}</option>
    })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)
    const [email, setEmail] = useState()
    const [role, setRole] = useState(allowedRoles[0])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${file.id}/users/add`, {
                headers: { ...authHeader, "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ email, role })
            })
            setLoading(false)
            if (!res.ok) { setErr(await res.text()); return }
            const newRelation = await res.json()
            const updatedFile = {
                ...file,
                fileUsers: [...file.fileUsers, { ...newRelation, user: { id: newRelation.userId, email } }]
            }
            setFile(updatedFile)
            setErr(null)
        } catch {
            setLoading(false)
            setErr("Network error — please check your connection")
        }
    }

    
    return (
        <Popover trigger={({ open }) => (
            <button className={`btn btn-sm btn-neutral-blue${open ? ' active' : ''}`}>Share</button>
        )} menuClass="popover-menu-accent-blue">
            {(setOpen) => (
                <form onSubmit={async (e) => { await handleSubmit(e); setOpen(false) }}>
                    {err && <div className="error-banner" style={{ margin: "8px 16px" }}><span>{err}</span><button className="error-dismiss" onClick={() => setErr(null)}>×</button></div>}
                    <div className="popover-section">
                        <div className="popover-section-header" style={{ color: "var(--accent-blue)" }}>Share file</div>
                        <FormField inputType="email" labelText="Email" inputPlaceholder="user@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="form-field">
                            <label>Role</label>
                            <select className="role-select" onChange={(e) => setRole(e.target.value)}>
                                {roleOptions}
                            </select>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button className="btn btn-blue-solid btn-sm" type="submit" disabled={loading}>
                                {loading ? "Adding..." : "Add User"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </Popover>
    )
}

export default AddUser
