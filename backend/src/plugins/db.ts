import fp from 'fastify-plugin'
import postgres from 'postgres'
import { FastifyInstance } from 'fastify'
import { config } from '../config'

async function dbPlugin(fastify: FastifyInstance) {
  const sql = postgres(config.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  fastify.decorate('db', sql)

  fastify.addHook('onClose', async () => {
    await sql.end()
  })
}

export default fp(dbPlugin, { name: 'db' })
