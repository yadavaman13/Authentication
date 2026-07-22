import axios from 'axios';

export const authApiInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
})

export async function registerUser({username, email, password}){
    try{
        const response = await authApiInstance.post('/register', {
            username,
            email,
            password
        })
    }
}