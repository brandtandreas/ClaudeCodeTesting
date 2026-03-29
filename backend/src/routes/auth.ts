import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createUser, findUserByEmail } from '../db/queries/users'

const registerSchema = z.object({
  username: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.badRequest(parsed.error.message)
    }

    const { username, email, password } = parsed.data

    const existing = await findUserByEmail(fastify.db, email)
    if (existing) {
      return reply.conflict('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await createUser(fastify.db, { username, email, passwordHash })

    const token = fastify.jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    })

    return reply.status(201).send({ token, user })
  })

  fastify.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.badRequest(parsed.error.message)
    }

    const { email, password } = parsed.data

    const row = await findUserByEmail(fastify.db, email)
    if (!row) {
      return reply.unauthorized('Invalid email or password')
    }

    const valid = await bcrypt.compare(password, row.passwordHash)
    if (!valid) {
      return reply.unauthorized('Invalid email or password')
    }

    const user = {
      id: row.id,
      username: row.username,
      email: row.email,
      createdAt: row.createdAt,
    }

    const token = fastify.jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    })

    return { token, user }
  })
}
