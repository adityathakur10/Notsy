// import jwt from 'jsonwebtoken';
const jwt=require('jsonwebtoken')
const {UnauthenticatedError}=require('../errors/index')

const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    // const authHeader="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzEyOTNkNmUxNzkzNWE2Mjg0ZDU5ODgiLCJuYW1lIjoiamFjb2IiLCJpYXQiOjE3Mjk3Njg4OTAsImV4cCI6MTczMjM2MDg5MH0.Gikbw0ek54XG8trqljMRy2iSP3JiFDAQ0015GCl-JKk"
    if(!authHeader || !authHeader.startsWith('Bearer')){
        // console.log('errorrrrrr')
        throw new UnauthenticatedError('jwt token not provided/invalid')
    }
    const token=authHeader.split(' ')[1]

    try {
        const payload=jwt.verify(token,process.env.jwt_secret)
        // console.log(payload)
        
        //adding user info in the routes....if valid
        req.user = { userId: payload.userId, name: payload.name }
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}
module.exports = auth
