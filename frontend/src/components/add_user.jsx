// form for adding a new user
// components
import FormField from "./FormField.jsx"

// auth
import { useAuthHeader } from "../auth/AuthProvider.jsx"

// hooks
import { useState } from "react"

const FILE_ROLES = [
    "OWNER",
    "EDITOR",
    "VIEWER"
]

const roleOptions = FILE_ROLES.map(role => {
    const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    return <option value={role}>{val}</option>
})

function AddUser({ file, setFile }) {
    const [visible, setVisible] = useState(false)
    const authHeader = useAuthHeader()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [email, setEmail] = useState()
    const [role, setRole] = useState(FILE_ROLES[0])

    if (err)
        return <p>{err}</p>

    const handleRoleChange = (e) => {
        setRole(e.target.value)
    }

    const handleSubmit = async (e) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${file.id}/users/add`, {
            headers: {
                ...authHeader,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                email: email,
                role: role
            })
        })

        if (!res.ok) {
            setErr(await res.text())
            return
        }

        const data = await res.json()
        console.log(data)

        setErr()


    }

    return <>
        <button onClick={() => setVisible(old => !old)}>Add User</button>
        <div hidden={!visible}>
            <FormField inputType="email" inputPlaceholder="Email"
                onChange={(e) => { setEmail(e.target.value) }}
            ></FormField>
            <select name="" id="" onChange={handleRoleChange}>
                {roleOptions}
            </select>
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>
    </>

}

export default AddUser
