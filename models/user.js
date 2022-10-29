const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },

    name:{
        type: String,
        required: true
    },
    


    passwordHash:{
        type: String,
        required: true
    },

   
})

module.exports = mongoose.model('USER', schema)