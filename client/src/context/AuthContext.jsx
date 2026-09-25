import { useContext, createContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
            {{ children }}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be inside the AuthContext.Provider');
    }

    return context;
};
