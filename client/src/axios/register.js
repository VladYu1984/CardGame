import api from './index'

export const register = (userData) => {
    return api.post('/registration', userData)
}