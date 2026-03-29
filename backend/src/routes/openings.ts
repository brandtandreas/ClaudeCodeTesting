import { FastifyInstance } from 'fastify'
import { getAllOpenings, getOpeningById } from '../services/openingService'

export default async function openingsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_request, _reply) => {
    return getAllOpenings(fastify.db)
  })

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const opening = await getOpeningById(fastify.db, request.params.id)
    if (!opening) {
      return reply.notFound('Opening not found')
    }
    return opening
  })
}
