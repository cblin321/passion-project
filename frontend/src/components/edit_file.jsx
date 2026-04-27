// hooks
import { useRef, useState, useEffect } from "react"

// components
import FormField from "../components/FormField.jsx"

function EditFile({ updating, name, users }) {
    const [users, setUsers] = useState(users)
    const name = useRef(name)

    useEffect(() => {
        async function getFileData() {
            const res = await fetch(`${import.meta.VITE_API_URL}`, {

            })

        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()


    }

    const users = users.map()

    return <form visibility={updating ? "visible" : "hidden"} onSubmit={(e) => handleSubmit(e)}>
        <FormField inputType="text" inputPlaceholder="Your name"
            onChange={(e) => name.current = e.target.value}
            inputProps={{ value: name.current }}
        >
        </FormField>
    </form >
}

export default EditFile
