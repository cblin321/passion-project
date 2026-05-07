// hooks
import { useRef, useState, useEffect } from "react"

// auth
import { useAuthHeader } from "../auth/AuthProvider"

// components
import FormField from "./FormField.jsx"

const FILE_ROLES = [
    "OWNER",
    "EDITOR",
    "VIEWER"
]

function EditFile({ file, setFile }) {
    const [updating, setUpdating] = useState(false)
    const { fileUsers } = file
    const fileId = file.id
    const users = fileUsers


    //list of users that had their perms changed, only includes updated properties
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
            headers: {
                ...authHeader,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                title: title.title,
                changedUsers
            })
        })
        setTitle(old => ({ ...old, changed: false }))
        setLoading(false)

        if (!res.ok) {
            setErr(await res.text())
        }

        const data = await res.json()


        setFile(data)

        setErr()

    }

    if (err)
        return <p>{err}</p>

    const getUserComponents = async () => {

        const res = await Promise.all(await users.map(async user => {
            const roleOptions = FILE_ROLES.map(role => {
                const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                return <option key={`${user.userId}_${role}`} value={role} selected={role === user.role}>{val}</option>
            })
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${user.userId}`, {
                headers: authHeader
            })

            if (!res.ok) {
                setErr(res.text())
            }

            if (err)
                setErr()

            const userObj = await res.json()

            const handleRoleChange = (e) => {
                const newRole = e.target.value

                // upsert
                setChangedUsers(old => {
                    let currIndex = old.findIndex(i => i.userId === user.userId)

                    if (currIndex === -1)
                        old.push({ userId: user.userId, role: newRole })
                    else
                        old[currIndex] = { ...old[currIndex], role: newRole }

                    return [
                        ...old
                    ]

                })

            }


            return <div key={user.userId}>
                <p>{userObj.email}</p>
                <p>{user.role}</p>
                <select name="" id="" onChange={handleRoleChange}>
                    {roleOptions}
                </select>
            </div>
        }))
        setUserComponents(res)
    }



    useEffect(() => {
        getUserComponents()
    }, [])

    if (err)
        return <p>{err}</p>

    // TODO integrate w/ role selction
    //const isUnchanged = !title.changed && !(changedUsers.length > 0)

    return <>
        <button onClick={() => setUpdating(old => !old)}>Update</button>
        <form hidden={!updating} onSubmit={(e) => handleSubmit(e)}>
            <FormField inputType="text" inputPlaceholder="Your name"
                onChange={(e) => {
                    setTitle({
                        title: e.target.value,
                        changed: true
                    })
                }}
                inputProps={{ value: title.title }}
            >
            </FormField>

            <h2>Users:</h2>
            {userComponents}
            <button type="submit">
                Submit
            </button>
        </form >
    </>
}

export default EditFile
