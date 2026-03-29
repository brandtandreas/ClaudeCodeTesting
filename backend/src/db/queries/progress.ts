import { Sql } from 'postgres'
import { UserProgress } from '@chess-trainer/shared'

function rowToProgress(row: Record<string, unknown>): UserProgress {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    openingId: row.opening_id as string,
    sessionsCompleted: row.sessions_completed as number,
    bestStreak: row.best_streak as number,
    lastSessionAt: row.last_session_at as string | null,
    mastered: row.mastered as boolean,
  }
}

export async function getAllProgressForUser(
  sql: Sql,
  userId: string
): Promise<UserProgress[]> {
  const rows = await sql`
    SELECT id, user_id, opening_id, sessions_completed, best_streak,
           last_session_at, mastered
    FROM user_progress
    WHERE user_id = ${userId}
    ORDER BY last_session_at DESC NULLS LAST
  `
  return rows.map(rowToProgress)
}

export async function getProgressForOpening(
  sql: Sql,
  userId: string,
  openingId: string
): Promise<UserProgress | null> {
  const rows = await sql`
    SELECT id, user_id, opening_id, sessions_completed, best_streak,
           last_session_at, mastered
    FROM user_progress
    WHERE user_id = ${userId} AND opening_id = ${openingId}
  `
  if (rows.length === 0) return null
  return rowToProgress(rows[0])
}
