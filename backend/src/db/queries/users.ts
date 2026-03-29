import { Sql } from 'postgres'
import { User } from '@chess-trainer/shared'

interface UserRow {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
}

function rowToUserRow(row: Record<string, unknown>): UserRow {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    createdAt: String(row.created_at),
  }
}

export async function findUserByEmail(
  sql: Sql,
  email: string
): Promise<UserRow | null> {
  const rows = await sql`
    SELECT id, username, email, password_hash, created_at
    FROM users
    WHERE email = ${email}
  `
  if (rows.length === 0) return null
  return rowToUserRow(rows[0])
}

export async function findUserById(
  sql: Sql,
  id: string
): Promise<User | null> {
  const rows = await sql`
    SELECT id, username, email, created_at
    FROM users
    WHERE id = ${id}
  `
  if (rows.length === 0) return null
  const row = rows[0]
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    createdAt: String(row.created_at),
  }
}

export async function createUser(
  sql: Sql,
  data: { username: string; email: string; passwordHash: string }
): Promise<User> {
  const [row] = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${data.username}, ${data.email}, ${data.passwordHash})
    RETURNING id, username, email, created_at
  `
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    createdAt: String(row.created_at),
  }
}
