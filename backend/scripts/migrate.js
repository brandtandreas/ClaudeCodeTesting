// @ts-check
const fs = require('fs')
const path = require('path')
const postgres = require('postgres')

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL env var is required')
    process.exit(1)
  }

  const sql = postgres(databaseUrl)

  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  const migrationsDir = path.join(__dirname, '../src/db/migrations')
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const version = file.replace('.sql', '')

    const [existing] = await sql`
      SELECT version FROM schema_migrations WHERE version = ${version}
    `

    if (existing) {
      console.log(`  Skipping ${file} (already applied)`)
      continue
    }

    console.log(`  Applying ${file}...`)
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    await sql.unsafe(sqlContent)
    await sql`INSERT INTO schema_migrations (version) VALUES (${version})`
    console.log(`  Applied ${file}`)
  }

  console.log('Migrations complete.')
  await sql.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
