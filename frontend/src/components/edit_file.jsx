import { useState, useEffect } from "react"

import { useAuthHeader } from "../auth/AuthProvider"
import FormField from "./FormField.jsx"
import Popover from "./Popover.jsx"

const FILE_ROLES = ["OWNER", "EDITOR", "VIEWER"]

function EditFile({ file, setFile }) {
    const { fileUsers } = file
    const fileId = file.id
    const users = fileUsers

    const [changedUsers, setChangedUsers] = useState([])
    const [title, setTitle] = useState({ changed: false, title: file.title })
    useEffect(() => {
        setTitle(old => ({ changed: old.changed, title: file.title }))
        setChangedUsers([])
    }, [file])

    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [userComponents, setUserComponents] = useState()
    const authHeader = useAuthHeader()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}`, {
            headers: { ...authHeader, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ title: title.title, changedUsers })
        })
        setTitle(old => ({ ...old, changed: false }))
        setLoading(false)
        if (!res.ok) { setErr(await res.text()); return }
        const data = await res.json()
        setFile(data)
        setErr()
    }

    if (err) return <p>{err}</p>

    const getUserComponents = async () => {
        const res = await Promise.all(users.map(async user => {
            const roleOptions = FILE_ROLES.map(role => {
                const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                return <option key={`${user.userId}_${role}`} value={role} selected={role === user.role}>{val}</option>
            })
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}/users/${user.userId}`, {
                headers: authHeader
            })
            if (!res.ok) { setErr(res.text()); return }
            const userObj = await res.json()
            const email = userObj.user.email
            const handleRoleChange = (e) => {
                const newRole = e.target.value
                setChangedUsers(old => {
                    let currIndex = old.findIndex(i => i.userId === user.userId)
                    if (currIndex === -1)
                        old.push({ userId: user.userId, role: newRole })
                    else
                        old[currIndex] = { ...old[currIndex], role: newRole }
                    return [...old]
                })
            }
            return <div key={user.userId} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ flex: 1, fontSize: 14, color: "var(--text)" }}>{email}</span>
                <span style={{ fontSize: 12, color: "var(--text)", opacity: 0.6, textTransform: "lowercase" }}>{user.role}</span>
                <select className="role-select" onChange={handleRoleChange}>
                    {roleOptions}
                </select>
            </div>
        }))
        setUserComponents(res)
    }

    useEffect(() => { getUserComponents() }, [])

    if (err) return <p>{err}</p>

    return (
        <Popover trigger={() => (
            <button className="btn btn-sm">Edit</button>
        )}>
            {(setOpen) => (
                <form onSubmit={async (e) => { await handleSubmit(e); setOpen(false) }}>
                    <div className="popover-section">
                        <div className="popover-section-header">Details</div>
                        <FormField inputType="text" inputPlaceholder="My file"
                            onChange={(e) => setTitle({ title: e.target.value, changed: true })}
                            inputProps={{ value: title.title }}
                        />
                    </div>
                    <div className="popover-section">
                        <div className="popover-section-header">Permissions</div>
                        {userComponents}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </Popover>
    )
}

export default EditFile
