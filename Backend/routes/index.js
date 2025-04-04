const express=require('express')
const router=express.Router();

const folderRouter=require('./folder');
const topicRouter=require('./topic');

router.use('/folder',folderRouter);
router.use('/topic',topicRouter);


module.exports=router;