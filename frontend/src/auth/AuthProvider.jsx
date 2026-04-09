// react imports
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext()
function AuthContext({ children }) {
    const [token, setToken] = useState(localStorage.get("jwt_token"))

    useEffect(() => {
        if (token)
            localStorage.setItem("jwt_token", token)
        else
            localStorage.removeItem("jwt_token", token)

    }, [token])


    // prevent rerenders when token is unchanged
    const token_memo = useMemo(() => {
        token,
            setToken
    }, [token])

    return <AuthContext value={token_memo}> {children} </AuthContext>
}

export function useToken() {
    return useContext(AuthContext)
}

export default AuthContext
