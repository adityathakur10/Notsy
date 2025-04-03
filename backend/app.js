const express =require("express")
const app=express()
const connectDB=require('./db/connect')
const authenticateUser = require('./middlewares/authenticate');
require('dotenv').config();


//middlewares
app.use(express.json())

//import routes
const uploadRoutes=require('./routes/upload')
const authRoutes=require('./routes/auth')
//routes
app.use('/notsy/auth',authRoutes)
app.use('/notsy',authenticateUser ,uploadRoutes)





// listen function & connect to database
const port=3000
const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`database connected and listening on port ${port}` )
        })
    } catch (error) {
        console.log(error)
    }
}

start();