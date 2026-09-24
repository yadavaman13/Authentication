import axios from 'axios'

const api = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
})

export async function login({email, password}){
    try{
        const response = await api.post('/login',{
            email,
            password
        })

        return response.data;
    } catch(err){
        console.log('error while logging In', err)
        throw err.response?.data || err
    }
}

