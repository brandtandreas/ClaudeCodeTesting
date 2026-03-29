import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { fetchExplorerData } from '../services/lichessExplorer'

const querySchema = z.object({
  fen: z.string().min(1),
})

export default async function explorerRoutes(fastify: FastifyInstance) {
  fastify.get('/explorer', async (request, reply) => {
    const parsed = querySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.badRequest('fen query parameter is required')
    }

    const result = await fetchExplorerData(parsed.data.fen)
    return result
  })
}
