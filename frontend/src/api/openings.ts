import { Opening } from '@chess-trainer/shared'
import { apiClient } from './client'

export async function fetchOpenings(): Promise<Opening[]> {
  return apiClient.get<Opening[]>('/openings')
}

export async function fetchOpening(id: string): Promise<Opening> {
  return apiClient.get<Opening>(`/openings/${id}`)
}
