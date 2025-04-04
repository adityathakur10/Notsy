const express =require("express")
const app=express()
const connectDB=require('./db/connect')
const authenticateUser = require('./middlewares/authenticate');
require('dotenv').config();
const cors=require('cors')
const path=require('path')


const corsOptions={
    origin:'http://localhost:5173',
    optionsSuccessStatus:200
}
//middlewares
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))
app.use(cors());
app.use(express.json())

//import routes
// const uploadRoutes=require('./routes/upload')

//routes
app.use('/notsy/auth',require('./routes/auth'))
// app.use('/notsy',authenticateUser ,uploadRoutes)
app.use('/notsy',authenticateUser ,require('./routes/index'));





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