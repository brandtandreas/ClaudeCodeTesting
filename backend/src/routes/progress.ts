import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  getUserProgress,
  getOpeningProgress,
  upsertProgressFromSession,
} from '../services/progressService'

const sessionSchema = z.object({
  openingId: z.string().uuid(),
  perfect: z.boolean(),
  attempts: z.array(
    z.object({
      fenBeforeMove: z.string(),
      movePlayed: z.string(),
      bestMove: z.string(),
      quality: z.enum(['best', 'acceptable', 'mistake']),
    })
  ),
})

export default async function progressRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    { preHandler: [fastify.authenticate] },
    async (request, _reply) => {
      return getUserProgress(fastify.db, request.user.id)
    }
  )

  fastify.get<{ Params: { openingId: string } }>(
    '/:openingId',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const progress = await getOpeningProgress(
        fastify.db,
        request.user.id,
        request.params.openingId
      )
      if (!progress) {
        return reply.notFound('Progress record not found')
      }
      return progress
    }
  )

  fastify.post(
    '/session',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = sessionSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.badRequest(parsed.error.message)
      }

      const updated = await upsertProgressFromSession(
        fastify.db,
        request.user.id,
        parsed.data
      )
      return updated
    }
  )
}
