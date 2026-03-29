import { UserProgress, SessionResult } from '@chess-trainer/shared'
import { apiClient } from './client'

export async function fetchProgress(): Promise<UserProgress[]> {
  return apiClient.get<UserProgress[]>('/progress')
}

export async function fetchOpeningProgress(openingId: string): Promise<UserProgress> {
  return apiClient.get<UserProgress>(`/progress/${openingId}`)
}

export async function submitSession(session: SessionResult): Promise<UserProgress> {
  return apiClient.post<UserProgress>('/progress/session', session)
}
