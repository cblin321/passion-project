// hooks
import { useRef, useState, useEffect } from "react"

// auth
import { useAuthHeaders } from "../auth/AuthProvider"

// components
import FormField from "./FormField.jsx"

function EditFile({ updating, file, setFile }) {
    const { users, fileId } = file
    const [changedUsers, setChangedUsers] = useState([])
    const title = useRef({ changed: false, title: file.title })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [userComponents, setUserComponents] = useState()

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${fileId}`, {
            ...useAuthHeaders(),
            method: "POST",
            body: {
                title,
                changedUsers: JSON.Stringify(changedUsers)
            }
        })
        setLoading(false)

        if (!res.ok) {
            setErr(await res.text())
            return
        }

        setFile(

            setErr()

    }

    if (err)
        return <p>{err}</p>

    const handleUpdateRole = () => {
        // send request to endpoint
    }

    const getUserComponents = users.map(async user => {
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${user.userId}`)

        if (!req.ok) {
            setErr(res.text())
            return
        }
        setErr()

        const userObj = await res.json()
        setLoading(false)

        return <form>
            <p>{userObj.email}</p>
            <p>{user.access}</p>
            <button onSubmit={(e) => handleUpdateRole(e, user.userId)}>Change role</button>
        </form>
    })


    useEffect(() => {
        getUserComponents()
    }, [userComponents])

    return <form visibility={updating ? "visible" : "hidden"} onSubmit={(e) => handleSubmit(e)}>
        <FormField inputType="text" inputPlaceholder="Your name"
            onChange={(e) => title.current = e.target.value}
            inputProps={{ value: title.current }}
        >
        </FormField>

        {userComponents}
        <button type="submit" disabled={title.current.changed || changedUsers.length > 0 ? true : false}>
            Submit
        </button>
    </form >
}

export default EditFile
