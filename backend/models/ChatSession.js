const mongoose=require('mongoose')

const chatSchema=new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transcriptID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transcript',
        required:true
    },
    messages:[
        {
            role: { type: String, required: true },
            content: { type: String, required: true },
            // role:String,
            // type:String,
            timestamp:{
                type:Date,
                default:Date.now
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model('ChatSession',chatSchema)