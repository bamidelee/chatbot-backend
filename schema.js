const {gql} = require('apollo-server')

const typeDefs = gql`
    type User {
        username: String
        name: String
        passwordHash: String!
        messages: [Messages]
      
    } 

    type Messages {
        text: String
        sender: Boolean
        _id: ID!
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
        ): User

        text(
            sender: Boolean
            text:String
            username: String
        ): Messages

    }
    `

    module.exports = typeDefs