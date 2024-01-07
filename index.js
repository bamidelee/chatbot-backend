const { ApolloServer } = require('apollo-server-express')
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require( "apollo-server-core");
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const http = require('http')
const  { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cors = require('cors')




const mongoose = require('mongoose')

const User = require('./models/user')


const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })
 
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLocaleLowerCase().startsWith('bearer')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      }, 
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
     ],
  })
  const wsServer = new WebSocketServer({
 
    server: httpServer,

    path: '/graphql',
  });
  const serverCleanup = useServer({ schema }, wsServer);
  await server.start()

  server.applyMiddleware({
    app,
    cors: false,
    path: "/",
  });
  const PORT = 4000

  httpServer.listen( PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

// call the function that does the setup and starts the server
start()