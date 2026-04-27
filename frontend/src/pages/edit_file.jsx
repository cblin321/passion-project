// hooks
import { useRef, useState, useEffect } from "react"

// auth
import { useAuthHeaders } from "../auth/AuthProvider"

// components
import FormField from "./FormField.jsx"

function EditFile({ updating, name, users, fileId }) {
    const [changedUsers, setChangedUsers] = useState([])
    const name = useRef({ changed: false, name })
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const resBody = {}

        if (name.current.changed)
            resBody.name = name

        if (name.users.length > 0)
            resBody.changedUsers = changedUsers

        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${fileId}`, {
            ...useAuthHeaders(),
            method: "POST",
            body: {
                title
            }
        })
        setLoading(false)

        if (!res.ok) {
            setErr(await res.text())
            return
        }

        setErr()

    }

    if (err)
        return <p>{err}</p>

    const userComponents = users.map()

    return <form visibility={updating ? "visible" : "hidden"} onSubmit={(e) => handleSubmit(e)}>
        <FormField inputType="text" inputPlaceholder="Your name"
            onChange={(e) => name.current = e.target.value}
            inputProps={{ value: name.current }}
        >
        </FormField>

        {userComponents}
        <button type="submit" disabled={name.current.changed || name.users.length > 0 ? true : false}>
            Submit
        </button>
    </form >
}

export default EditFile
