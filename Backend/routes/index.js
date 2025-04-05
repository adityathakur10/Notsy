const express=require('express')
const router=express.Router();

const folderRouter=require('./folder');
const topicRouter=require('./topic');
const uploadRouter=require('./upload');
const resourceRouter=require('./resource');

router.use('/folder',folderRouter);
router.use('/topic',topicRouter);
router.use('/upload',uploadRouter);
router.use('/resource',resourceRouter);

module.exports=router;