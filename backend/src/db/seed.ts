import postgres from 'postgres'
import { OPENINGS } from '@chess-trainer/shared'

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL env var is required')
    process.exit(1)
  }

  const sql = postgres(databaseUrl)

  console.log(`Seeding ${OPENINGS.length} openings...`)

  for (const opening of OPENINGS) {
    await sql`
      INSERT INTO openings (eco_code, name, color, starting_fen, pgn_moves, move_count)
      VALUES (
        ${opening.ecoCode},
        ${opening.name},
        ${opening.color},
        ${opening.startingFen},
        ${opening.pgnMoves},
        ${opening.moveCount}
      )
      ON CONFLICT DO NOTHING
    `
    console.log(`  Upserted: ${opening.name} (${opening.ecoCode})`)
  }

  console.log('Seed complete.')
  await sql.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
