import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { config } from '../config'

async function jwtPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET,
  })

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )
}

export default fp(jwtPlugin, { name: 'jwt' })
