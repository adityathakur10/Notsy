const express=require('express')
const router=express.Router()

const {home,uploadURL}=require('../controllers/upload')
const chat=require('../controllers/chat')

router.get('/homepage',home);
router.post('/upload',uploadURL);
router.post('/chat',chat);

module.exports=router