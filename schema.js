const {gql} = require('apollo-server')

const typeDefs = gql`
    type User {
        username: String
        name: String
        passwordHash: String!
      
    } 

    type Token {
        value: String!
    }
    
    type Query {
        findUser(username: String): User
    }

    type Mutation {
        signUp(
            name: String!
            username: String!
            password: String!
        ): User

        signIn(
            username: String!
            password: String!
        ): Token

    }
    `

    module.exports = typeDefs