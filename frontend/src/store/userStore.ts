import { create } from 'zustand'
import { User } from '@chess-trainer/shared'

interface UserState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

function loadToken(): string | null {
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: loadToken(),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null })
  },
}))
