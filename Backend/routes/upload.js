const express = require('express');
const router = express.Router();

const upload=require('../config/multer');
const {uploadUrls}=require('../controllers/topic/upload')


// router.post('/uploadPDF', upload.single("pdf"), uploadPDF);
router.post('/uploadUrl', uploadUrls);


module.exports = router;