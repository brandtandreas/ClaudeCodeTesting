import { Sql } from 'postgres'

declare module 'fastify' {
  interface FastifyInstance {
    db: Sql
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }

  interface FastifyRequest {
    user: {
      id: string
      username: string
      email: string
    }
  }
}
