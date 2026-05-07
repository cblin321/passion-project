import { useState } from "react"

import FormField from "./FormField.jsx"
import { useAuthHeader } from "../auth/AuthProvider.jsx"
import Popover from "./Popover.jsx"

const FILE_ROLES = ["OWNER", "EDITOR", "VIEWER"]

const roleOptions = FILE_ROLES.map(role => {
    const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    return <option key={role} value={role}>{val}</option>
})

function AddUser({ file, setFile }) {
    const authHeader = useAuthHeader()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [email, setEmail] = useState()
    const [role, setRole] = useState(FILE_ROLES[0])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${file.id}/users/add`, {
            headers: { ...authHeader, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ email, role })
        })
        setLoading(false)
        if (!res.ok) { setErr(await res.text()); return }
        setErr()
    }

    return (
        <Popover trigger={() => (
            <button className="btn btn-sm">Share</button>
        )}>
            {(setOpen) => (
                <form onSubmit={async (e) => { await handleSubmit(e); setOpen(false) }}>
                    {err && <div className="popover-section"><p className="form-error">{err}</p></div>}
                    <div className="popover-section">
                        <div className="popover-section-header">Share file</div>
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
                            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
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
