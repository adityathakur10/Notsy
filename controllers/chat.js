const ChatSession = require('../models/ChatSession');
const openai = require('./openAiClient');

const chat=async (req,res)=>{
    // res.send('heloo')
    const {ChatSessionId,message}=req.body;
    const userId=req.user.userId;

    try {
        const c_Session=await ChatSession.findOne({_id:ChatSessionId,user:userId})
        if(!c_Session){
            return res.status(404).json({message:"chat session does not exist"})
        }
        c_Session.messages.push({role:"user",content:message});
        
        //gpt
        const aiResponse=await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:c_Session.messages //full msg history is sent for context 
        })
        const aiMsg=aiResponse.choices[0].message.content

        //save response
        c_Session.messages.push({role:"assistant",content:aiMsg})
        await c_Session.save()
        
        res.status(200).json({message:aiMsg})
    } catch (error) {
        // res.send('error')
        console.log("error during chat :",error.message);
        res.status(500).json({error:"An error occurred while processing your request."})
    }
}
module.exports=chat;