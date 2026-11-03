import { request } from './api'


export const loginUser = ({ email, password }) =>
  request('/auth/login/', { method: 'POST', body: { email, password }, auth: false })




export const registerUser = ({ full_name, email, password }) =>
  request('/auth/register/', {
    method: 'POST',
    body: { full_name, email, password },
    auth: false,
  })




export const fetchProfile = () => request('/auth/profile/')



export const updateProfile = (data) =>
  request('/auth/profile/', { method: 'PATCH', body: data })