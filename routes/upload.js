const express=require('express')
const router=express.Router()
const multer=require('multer')
const {home,uploadURL,uploadPDF}=require('../controllers/upload')

const chat=require('../controllers/chat')
router.get('/homepage',home);
router.post('/chat',chat);

const upload=multer({storage:multer.memoryStorage()})
router.post('/uploadPDF',upload.single("pdf"),uploadPDF);
router.post('/uploadURL',uploadURL);

module.exports=router