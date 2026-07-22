import { createContext, useContext, useState } from "react";
import * as authService from '../services/auth.api.js';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        try{
            const response = await authService.login(data);
            setUser(response.data.user)
            return response.data;
        } finally{
            setLoading(false)
        }
    }

    const logout = async () => {
        setUser(null)
    }

    return(
        <AuthContext.Provider
            value= {{user, loading, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext)