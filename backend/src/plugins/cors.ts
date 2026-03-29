import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'
import { config } from '../config'

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
}

export default fp(corsPlugin, { name: 'cors' })
