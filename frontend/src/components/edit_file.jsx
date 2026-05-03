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
    const { fileUsers, fileId } = file
    const users = fileUsers
    const [changedUsers, setChangedUsers] = useState()
    const title = useRef({ changed: false, title: file.title })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [userComponents, setUserComponents] = useState()
    const authHeader = useAuthHeader()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newFile = { ...file }

        if (title.current.changed) {
            title.current.changed = false
            newFile.title = title
        }

        if (changedUsers.length > 0) {
            // get all users that do not share any userIds with changed users
            const unchangedUsers = users.filter(user => changedUsers.every(changed => changed.userId !== user.Id))
            newFile.users = [
                ...unchangedUsers,
                changedUsers
            ]
        }

        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/${fileId}`, {
            headers: authHeader,
            method: "POST",
            body: {
                title,
                changedUsers: JSON.Stringify(changedUsers)
            }
        })
        setLoading(false)

        //if (!res.ok) {
        //    setErr(await res.text())
        //    return
        //}

        setFile(newFile)

        setErr()

    }

    if (err)
        return <p>{err}</p>

    const handleUpdateRole = () => {
        // send request to endpoint
    }

    const getUserComponents = async () => {
        const roleOptions = FILE_ROLES.map(role => {
            const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
            return <option value={role}>{val}</option>
        })

        const res = await Promise.all(await users.map(async user => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${user.userId}`, {
                headers: authHeader
            })

            if (!res.ok) {
                setErr(res.text())
                return
            }

            if (err)
                setErr()

            const userObj = await res.json()


            return <div key={user.userId}>
                <p>{userObj.email}</p>
                <p>{user.role}</p>
                <select name="" id="">
                    {roleOptions}
                </select>
                <button onClick={(e) => handleUpdateRole(e, user.userId)}>Change role</button>
            </div>
        }))
        setUserComponents(res)
    }



    useEffect(() => {
        getUserComponents()
    }, [])

    if (err)
        return <p>{err}</p>

    return <>
        <button onClick={() => setUpdating(old => !old)}>Update</button>
        <form hidden={!updating} onSubmit={(e) => handleSubmit(e)}>
            <FormField inputType="text" inputPlaceholder="Your name"
                onChange={(e) => title.current.title = e.target.value}
                inputProps={{ value: title.current.title }}
            >
            </FormField>

            {userComponents}
            <button type="submit" disabled={!title.current.changed || changedUsers ? true : false}>
                Submit
            </button>
        </form >
    </>
}

export default EditFile
