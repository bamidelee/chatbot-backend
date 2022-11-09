const stringify = require('fast-json-stable-stringify')
const mongoose = require('mongoose')

const schema = mongoose.Schema({
    text:{
        type: String,
    },

    sender:{
        type: Boolean
    }
})

module.exports = mongoose.model('MESSAGES', schema)