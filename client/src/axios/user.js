import api from './index'

export const getMe = () => {
    const token = localStorage.getItem('token');
    return api.get('/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}