import axios from 'axios';

export const authApiInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
})

export async function register({username, email, password}){
    try{
        const response = await authApiInstance.post('/register', {
            username,
            email,
            password
        })

        return response.data
    } catch(err){
        console.log('Register failed',err)
    }
}

export async function login({email,password}){
    try{
        const reponse = await authApiInstance.post('/login', {
            email,
            password
        })

        return response.data
    } catch(err){
        console.log('Login failed',err)
    }
}

export async function verifyEmail({email, otp}){
    try{
        const response = await authApiInstance.post('/verify-email', {
            email,
            otp
        })

        return response.data
    } catch(err){
        console.log('Error verifying email',err)
    }
}

export async function logout(){
    try{
        const response = await authApiInstance.get('/logout')
        return response.data
    } catch(err){
        console.log('logout failed', err)
    }
}

export async function logoutAll(){
    try{
        const response = await authApiInstance.get('/logout-all')
        return response.data
    } catch(err){
        console.log('Error logging out from all devices', err)
    }
}

export async function refreshToken(){
    try{
        const response = await authApiInstance.get('refresh-token')
        return response.data
    } catch(err){
        console.log('Error generating refresh token', err)
    }
}

export async function getMe(){
    try{
        const response = await authApiInstance.get('/get-me')
        return response.data
    } catch(err){
        console.log('Error fetching the profile', err)
    }
}