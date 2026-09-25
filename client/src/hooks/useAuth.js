import { useAuthContext } from '../context/AuthContext';
import { login, register } from '../services/auth.api';

export function useAuth() {
    const { user, setUser, loading, setLoading, error, setError } = useAuthContext();

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            setError(null);

            const response = await login({ email, password });

            setUser(response.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            setError(null);

            const response = await register({ username, email, password });

            setUser(response.user);
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, user, error, handleLogin, handleRegister };
}
