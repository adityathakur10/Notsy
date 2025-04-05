const express=require('express')
const router=express.Router();

const folderRouter=require('./folder');
const topicRouter=require('./topic');
const uploadRouter=require('./upload');

router.use('/folder',folderRouter);
router.use('/topic',topicRouter);
router.use('/upload',uploadRouter);

module.exports=router;