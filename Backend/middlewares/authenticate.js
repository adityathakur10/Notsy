const jwt=require('jsonwebtoken')
const {UnauthenticatedError}=require('../errors/index')

const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('jwt token not provided/invalid')
    }
    const token=authHeader.split(' ')[1]

    try {
        const payload=jwt.verify(token,process.env.jwt_secret)
        //adding user info in the routes....if valid
        req.user = { userId: payload.userId, name: payload.name }
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}
module.exports = auth
