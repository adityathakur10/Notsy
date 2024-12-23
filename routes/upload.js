const express=require('express')
const router=express.Router()

const {home,uploadURL}=require('../controllers/upload')

router.get('/homepage',home);
router.post('/upload',uploadURL);

module.exports=router