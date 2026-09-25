import axios from 'axios';

const api = axios.create({
    baseURL: '/api/auth',
    withCredentials: true,
});

export async function login({ email, password }) {
    try {
        const response = await api.post('/login', {
            email,
            password,
        });

        return response.data || response?.user;
    } catch (err) {
        console.log('error while logging In', err);
        throw err.response?.data || err;
    }
}

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password,
        });

        return response.data || response?.user;
    } catch (err) {
        console.log('Error in registration', err);
        throw err?.response?.data || err;
    }
}

export async function getMe() {
    try {
        const response = await api.get('/get-me');

        return response.data || response?.data?.user;
    } catch (err) {
        console.log('Error fetching user profile', err);
        throw err?.response?.data || err;
    }
}
