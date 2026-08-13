import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6969/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchUser = async (fingerprint) => {
  if (!fingerprint) return null
  const res = await api.get('/users/me', { params: { fingerprint } })
  return res.data?.data || null
}

export const checkUsernameAvailable = async (name) => {
  if (!name) return false
  const res = await api.get('/users/check-username', { params: { name } })
  return Boolean(res.data?.data?.available)
}

export const createUser = async ({ name, fingerprint }) => {
  const res = await api.post('/users', { name, fingerprint })
  return res.data?.data
}

export const convertCurl = async (curl) => {
  const res = await api.post('/convert-curl', { curl })
  return res.data
}

export const fetchAccounts = async (page = 1, limit = 10) => {
  const res = await api.get('/accounts', { params: { page, limit } })
  return res.data?.data || { accounts: [], totalCount: 0 }
}

export const createAccount = async (accountData) => {
  const res = await api.post('/accounts', accountData)
  return res.data?.data
}
