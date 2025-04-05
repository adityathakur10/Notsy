const express= require("express");
const router= express.Router();
const folderController=require('../controllers/notebook/folder');
const upload=require('../config/multer');

router.post('/',upload('./uploads/coverImages'),folderController.createFolder);
router.get('/',folderController.getAllFolders);
router.get('/:id',folderController.getFolderById);
router.delete('/:id',folderController.deleteFolder);

module.exports=router;