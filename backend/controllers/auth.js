const User=require('../models/user')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError,UnauthenticatedError }=require('../errors/index')


const register=async(req,res)=>{
    
    try {
        const user=await User.create({...req.body})
        const token=user.createJWT()

        res.status(StatusCodes.CREATED).json({user:{name:user.name},token})

    } catch (error) {
        if(error.code===11000)
            return res.status(400).json({ error: 'Email already exists' });
    }
    
}

const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }
    const user=await User.findOne({email})
    const passwordCheck=await user.comparePassword(password)
    if(!user || !passwordCheck){
        throw new UnauthenticatedError('invalid credentials')
    }

    const token=user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})

    // res.send('lolgin')
}



module.exports={login,register}