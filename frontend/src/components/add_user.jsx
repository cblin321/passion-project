// form for adding a new user
// components
import FormField from "./FormField.jsx"

const FILE_ROLES = [
    "OWNER",
    "EDITOR",
    "VIEWER"
]

const roleOptions = FILE_ROLES.map(role => {
    const val = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    return <option value={role} selected={role === user.role}>{val}</option>
})

function AddUser({ file }) {
    const { id, fileUsers } = file
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const [email, setEmail] = newState()
    const [role, setRole] = newState(FILE_ROLES[0])

    if (err)
        return <p>{err}</p>

    const handleRoleChange = (e) => {
        setRole(e.target.value)
    }

    const handleSubmit = (e) => {

    }

    return <div>
        <FormField inputType="email" inputPlaceholder="Email"
            onChange={(e) => { setEmail(e.target.value) }}
        ></FormField>
        <select name="" id="" onChange={handleRoleChange}>
        </select>
        <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
}
