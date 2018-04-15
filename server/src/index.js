import { GraphQLServer } from 'graphql-yoga'

const CORS = require('micro-cors')({ allowHeaders: ['X-Requested-With', 'Access-Control-Allow-Origin', 'X-HTTP-Method-Override', 'Content-Type', 'Authorization', 'Accept'] })
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')

require('dotenv').config({path: '../prod.env'})

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: true
    }),
  }),
})

const options = {
  port: 4000,
}

CORS(server.start(options, ({ port }) => console.log(`Server is running on ${port}.`)))