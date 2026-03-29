import { FastifyInstance } from 'fastify'
import { healthRoutes } from './health'
import authRoutes from './auth'
import openingsRoutes from './openings'
import explorerRoutes from './explorer'
import progressRoutes from './progress'

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes)
  await fastify.register(authRoutes, { prefix: '/auth' })
  await fastify.register(openingsRoutes, { prefix: '/openings' })
  await fastify.register(explorerRoutes)
  await fastify.register(progressRoutes, { prefix: '/progress' })
}
