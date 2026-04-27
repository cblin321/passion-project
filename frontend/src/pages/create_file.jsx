// auth
import { useToken, useAuthHeader } from "../auth/AuthProvider"

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
    const newFile = useRef()
    const [err, setErr] = useState()
    const [loading, setLoading] = useState()
    const [files, setFiles] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        console.log(newFile.current)
        formData.append("title", title.current)
        formData.append("file", newFile.current)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file/create`, {
            method: "POST",
            ...useAuthHeader(),
            body: formData
        })

        setLoading(false)

        if (!res.ok) {
            const msg = await res.text()
            setErr(msg)
            return
        }

        setErr("")
    }

    if (err)
        return <p>{err}</p>

    //function FormField({ inputType, inputPlaceholder, labelText, inputId, onChange }) {
    return <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>create file</h1>
        <FormField inputType="text" inputPlaceholder="Untitled File" labelText={"Title"} onChange={(e) => title.current = e.target.value} />
        <FormField inputType="file" inputProps={{ name: "file" }} inputPlaceholder="Upload" labelText="Your file" onChange={(e) => newFile.current = e.target.files[0]} />
        <button type="submit">
            Create new file
        </button>
    </form>

}

export default CreateFile
