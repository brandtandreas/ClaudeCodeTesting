import { apiClient } from './client'
import type { User } from '@chess-trainer/shared'

interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),

  register: (username: string, email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/register', { username, email, password }),
}
