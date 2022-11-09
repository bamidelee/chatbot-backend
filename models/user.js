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

    messages:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MESSAGES'
    }
]

   
})

module.exports = mongoose.model('USER', schema)