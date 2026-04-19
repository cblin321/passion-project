// auth
import { useToken } from "../auth/AuthProvider"

// hooks
import { useRef, useState } from "react"

// components
import FormField from "../components/FormField"

// router
import { redirect } from "react-router"

function CreateFile() {
    const token = useToken()
    //model File {
    //    id        Int         @id @default(autoincrement())
    //    name      String
    //    fileUsers FileUsers[]
    //}
    if (!token)
        redirect("/login")

    const title = useRef("")
    const [err, setErr] = useState()
    const [loading, setLoading] = useState()
    const [files, setFiles] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`
            },
            body: JSON.stringify({
                title: title.current
            })
        })
        setLoading(false)

        if (!res.ok) {
            const msg = await res.text()
            setErr(msg)
            return
        }
    }

    //function FormField({ inputType, inputPlaceholder, labelText, inputId, onChange }) {
    return <form method="POST" onSubmit={handleSubmit}>
        <h1>create file</h1>
        <FormField inputType="text" inputPlaceholder="Untitled File" labelText={"Title"} onChange={(e) => title.current = e.target.value} />
        <FormField inputType="file" inputPlaceholder="Upload" labelText="Your file" enctype="multipart/form-data" />
        <button type="submit">
            Create new file
        </button>
    </form>

}

export default CreateFile
