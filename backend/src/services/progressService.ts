import { Sql } from 'postgres'
import { UserProgress } from '@chess-trainer/shared'

interface SessionData {
  openingId: string
  perfect: boolean
  attempts: {
    fenBeforeMove: string
    movePlayed: string
    bestMove: string
    quality: 'best' | 'acceptable' | 'mistake'
  }[]
}

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

export async function getUserProgress(
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

export async function getOpeningProgress(
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

export async function upsertProgressFromSession(
  sql: Sql,
  userId: string,
  session: SessionData
): Promise<UserProgress> {
  const { openingId, perfect, attempts } = session

  const [updated] = await sql`
    INSERT INTO user_progress (user_id, opening_id, sessions_completed, best_streak, last_session_at, mastered)
    VALUES (
      ${userId},
      ${openingId},
      1,
      ${perfect ? 1 : 0},
      now(),
      false
    )
    ON CONFLICT (user_id, opening_id) DO UPDATE SET
      sessions_completed = user_progress.sessions_completed + 1,
      best_streak = CASE
        WHEN ${perfect} AND user_progress.best_streak >= 0
        THEN user_progress.best_streak + 1
        ELSE user_progress.best_streak
      END,
      last_session_at = now(),
      mastered = CASE
        WHEN user_progress.sessions_completed + 1 >= 5
          AND (
            CASE
              WHEN ${perfect} AND user_progress.best_streak >= 0
              THEN user_progress.best_streak + 1
              ELSE user_progress.best_streak
            END
          ) >= 3
        THEN true
        ELSE user_progress.mastered
      END,
      updated_at = now()
    RETURNING id, user_id, opening_id, sessions_completed, best_streak,
              last_session_at, mastered
  `

  if (attempts.length > 0) {
    const attemptRows = attempts.map((a) => ({
      user_id: userId,
      opening_id: openingId,
      fen_before_move: a.fenBeforeMove,
      move_played: a.movePlayed,
      best_move: a.bestMove,
      move_quality: a.quality,
    }))

    await sql`
      INSERT INTO attempts ${sql(attemptRows, 'user_id', 'opening_id', 'fen_before_move', 'move_played', 'best_move', 'move_quality')}
    `
  }

  return rowToProgress(updated)
}
