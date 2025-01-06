import { readFileSync } from 'node:fs'
import { getServerContext, type ServerContext } from './serverContext'
import { resolvers } from './resolvers'
import { logger } from './logger'
import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { env } from './environment'

const typeDefs = readFileSync('./schema.graphql', 'utf8')
const schema = createSchema<ServerContext>({ typeDefs, resolvers })

const yoga = createYoga({
	schema,
	context: getServerContext,
})
const server = createServer(yoga)
const PORT = 8080

server.listen(PORT, () => {
	const serverMode = env.isProd ? 'production' : 'development'
	logger.info(
		`🚀 Server is running on http://localhost:${PORT}/graphql in ${serverMode} mode`,
	)
})
