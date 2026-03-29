export type MoveQuality = 'best' | 'acceptable' | 'mistake'

export interface AttemptRecord {
  fenBeforeMove: string
  movePlayed: string
  bestMove: string
  quality: MoveQuality
}

export interface SessionResult {
  openingId: string
  perfect: boolean
  attempts: AttemptRecord[]
}

export interface UserProgress {
  id: string
  userId: string
  openingId: string
  sessionsCompleted: number
  bestStreak: number
  lastSessionAt: string | null
  mastered: boolean
}
