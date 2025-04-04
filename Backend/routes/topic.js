const express=require('express')
const router=express.Router();
const topicController=require('../controllers/topic/topic');

router.post('/',topicController.createTopic);
router.get('/',topicController.getAllTopics);
router.delete('/:id',topicController.deleteTopic);

module.exports=router;