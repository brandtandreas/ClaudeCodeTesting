import { Opening, ExplorerResult } from './opening'
import { User } from './user'
import { UserProgress, SessionResult } from './progress'

// Auth
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// Openings
export type GetOpeningsResponse = Opening[]

export interface GetOpeningResponse extends Opening {}

// Explorer
export interface GetExplorerRequest {
  fen: string
}

export type GetExplorerResponse = ExplorerResult | null

// Progress
export type GetProgressResponse = UserProgress[]

export interface GetOpeningProgressResponse extends UserProgress {}

export interface PostSessionRequest extends SessionResult {}

export interface PostSessionResponse extends UserProgress {}
