import { useState, useEffect } from "react"

import { useAuthHeader } from "../auth/AuthProvider"
import FormField from "./FormField.jsx"
import Popover from "./Popover.jsx"

const FILE_ROLES = ["OWNER", "EDITOR", "VIEWER"]
const ROLE_LEVEL = { OWNER: 3, EDITOR: 2, VIEWER: 1 }

function EditFile({ file, setFile, currentRole }) {
    const { fileUsers } = file
    const fileId = file.id
    const users = fileUsers

    const [changedUsers, setChangedUsers] = useState([])
    const [title, setTitle] = useState({ changed: false, title: file.title })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)
    const [userInfos, setUserInfos] = useState([])
    const authHeader = useAuthHeader()

    useEffect(() => {
        setTitle(old => ({ changed: old.changed, title: file.title }))
        setChangedUsers([])
    }, [file])

    useEffect(() => {
        const fetchUsers = async () => {
            const infos = await Promise.all(users.map(async user => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}/users/${user.userId}`, {
                        headers: authHeader
                    })
                    if (!res.ok) { setErr(await res.text()); return null }
                    const userObj = await res.json()
                    return { userId: user.userId, email: userObj.user.email, role: user.role }
                } catch {
                    setErr("Network error — please check your connection")
                    return null
                }
            }))
            setUserInfos(infos.filter(Boolean))
        }
        fetchUsers()
    }, [file])

    const handleRoleChange = (userId, newRole) => {
        setChangedUsers(old => {
            const currIndex = old.findIndex(i => i.userId === userId)
            const updated = [...old]
            if (currIndex === -1)
                updated.push({ userId, role: newRole })
            else
                updated[currIndex] = { ...updated[currIndex], role: newRole }
            return updated
        })
    }

    const handleRemoveUser = async (userId, setOpen) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}/users/${userId}`, {
                method: "DELETE",
                headers: authHeader
            })
            if (!res.ok) { setErr(await res.text()); return }
            const updatedFile = {
                ...file,
                fileUsers: file.fileUsers.filter(fu => fu.userId !== userId)
            }
            setFile(updatedFile)
            setOpen(false)
        } catch {
            setErr("Network error — please check your connection")
        }
    }

    const handleSubmit = async (e, setOpen) => {
        e.preventDefault()
        setLoading(true)
        try {
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
            setErr(null)
            setOpen(false)
        } catch {
            setLoading(false)
            setErr("Network error — please check your connection")
        }
    }

    if (err) return <div className="error-banner"><span>{err}</span><button className="error-dismiss" onClick={() => setErr(null)}>×</button></div>

    return (
        <Popover trigger={({ open }) => (
            <button className={`btn btn-sm btn-neutral-blue${open ? ' active' : ''}`}>Edit</button>
        )} menuClass="popover-menu-accent-blue">
            {(setOpen) => (
                <form onSubmit={(e) => handleSubmit(e, setOpen)}>
                    <div className="popover-section">
                        <div className="popover-section-header" style={{ color: "var(--accent-blue)" }}>Details</div>
                        <FormField inputType="text" inputPlaceholder="My file"
                            onChange={(e) => setTitle({ title: e.target.value, changed: true })}
                            inputProps={{ value: title.title }}
                        />
                    </div>
                    <div className="popover-section">
                        <div className="popover-section-header" style={{ color: "var(--accent-blue)" }}>Permissions</div>
                        {userInfos.map(info => {
                            const canManage = ROLE_LEVEL[info.role] <= ROLE_LEVEL[currentRole]
                            const allowedRoles = FILE_ROLES.filter(r => ROLE_LEVEL[r] <= ROLE_LEVEL[currentRole])
                            const roleOptions = allowedRoles.map(role => (
                                <option key={`${info.userId}_${role}`} value={role} selected={role === info.role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                                </option>
                            ))
                            return (
                                <div key={info.userId} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <span style={{ flex: 1, fontSize: 14, color: "var(--text)" }}>{info.email}</span>
                                    <span style={{ fontSize: 12, color: "var(--text)", opacity: 0.6, textTransform: "lowercase" }}>{info.role}</span>
                                    {canManage ? (
                                        <select className="role-select" onChange={(e) => handleRoleChange(info.userId, e.target.value)}>
                                            {roleOptions}
                                        </select>
                                    ) : (
                                        <span style={{ fontSize: 12, color: "var(--text)", opacity: 0.4 }}>{info.role}</span>
                                    )}
                                    {canManage && (
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveUser(info.userId, setOpen)}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button className="btn btn-blue-solid btn-sm" type="submit" disabled={loading}>
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