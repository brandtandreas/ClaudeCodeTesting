import Fastify from 'fastify'
import dbPlugin from './plugins/db'
import corsPlugin from './plugins/cors'
import jwtPlugin from './plugins/jwt'
import sensiblePlugin from './plugins/sensible'
import routes from './routes'
import { config } from './config'

export async function buildApp() {
  const fastify = Fastify({ logger: true })

  await fastify.register(corsPlugin)
  await fastify.register(sensiblePlugin)
  await fastify.register(dbPlugin)
  await fastify.register(jwtPlugin)
  await fastify.register(routes)

  return fastify
}

async function start() {
  const app = await buildApp()
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
