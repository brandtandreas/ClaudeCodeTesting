import { Sql } from 'postgres'
import { Opening } from '@chess-trainer/shared'

function rowToOpening(row: Record<string, unknown>): Opening {
  return {
    id: row.id as string,
    ecoCode: row.eco_code as string,
    name: row.name as string,
    color: row.color as 'white' | 'black',
    startingFen: row.starting_fen as string,
    pgnMoves: row.pgn_moves as string,
    moveCount: row.move_count as number,
  }
}

export async function getAllOpenings(sql: Sql): Promise<Opening[]> {
  const rows = await sql`
    SELECT id, eco_code, name, color, starting_fen, pgn_moves, move_count
    FROM openings
    ORDER BY eco_code, name
  `
  return rows.map(rowToOpening)
}

export async function getOpeningById(
  sql: Sql,
  id: string
): Promise<Opening | null> {
  const rows = await sql`
    SELECT id, eco_code, name, color, starting_fen, pgn_moves, move_count
    FROM openings
    WHERE id = ${id}
  `
  if (rows.length === 0) return null
  return rowToOpening(rows[0])
}
