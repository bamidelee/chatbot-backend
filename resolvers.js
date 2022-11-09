const User = require('./models/user')
const Messages = require('./models/messages')
const {UserInputError} = require('apollo-server')
const bcrypt = require('bcrypt')
require('dotenv').config()

const resolvers = {
    Query:{
        findUser: async(root, args) => User.findOne({username: args.username})
        .populate('messages')
    },

    Mutation: {
        signUp: async(root,args) => {
            const existingUser = await User.findOne({username: args.username})
            if(existingUser){
                throw new UserInputError('Username taken')
            }
            const {username, password, name} = args
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)
           
            const user = new User({
                username,
                passwordHash,
                name
            })
            try
          {  await user.save()}
           
            catch(error)  {
                throw new UserInputError(error.messages,{
                    invalidArgs: args
                })
            }
            return user
        },

        signIn: async(root, args) => {
            const user = await User.findOne({username: args.username})
            const passwordCorrect = user === null? false
            : await bcrypt.compare(args.password, user.passwordHash) 
            if(!(user && passwordCorrect)){
                throw new UserInputError('User not found')
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }
            return user
        },

        text: async(root, args, context) => {
            
            let { text, sender, username
            } = args
            
            const message = new Messages({
                text,
                sender
            })

            const user = await User.findOne({username: args.username})
           
            try
            {
                await message.save()
                user.messages = user.messages.concat(message._id)
                await user.save()
            }
                catch(error){
                throw new UserInputError(error.message,{
                    invalidArgs: args
                })
            }
            
            return message

        },

    }
}

module.exports = resolvers