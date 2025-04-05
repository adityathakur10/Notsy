const express = require('express');
const router = express.Router();

const upload=require('../config/multer');
const {uploadUrl}=require('../controllers/topic/upload')


// router.post('/uploadPDF', upload.single("pdf"), uploadPDF);
router.post('/uploadURL', uploadUrl);


module.exports = router;