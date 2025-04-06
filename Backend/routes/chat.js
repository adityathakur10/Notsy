const express= require("express");
const router= express.Router();
const chatController=require('../controllers/chat');
const upload=require('../config/multer');

router.post('/',chatController.dummyChat);
// router.get('/',folderController.getAllFolders);
// router.get('/:id',folderController.getFolderById);
// router.delete('/:id',folderController.deleteFolder);

module.exports=router;