// react imports
import {
    createContext, useContext,
    useState, useEffect, useMemo
} from 'react';

const AuthContext = createContext()
function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("jwt_token"))

    useEffect(() => {
        if (token)
            localStorage.setItem("jwt_token", token)
        else
            localStorage.removeItem("jwt_token", token)

    }, [token])


    // prevent rerenders when token is unchanged
    const token_memo = useMemo(() => ({
        token,
        setToken
    }), [token])

    return <AuthContext value={token_memo}> {children} </AuthContext>
}

export function useToken() {
    return useContext(AuthContext)
}

export function useAuthHeader() {
    const token = useContext(AuthContext)
    return {
        "Authorization": `Bearer ${token.token}`
    }

}


export default AuthProvider
