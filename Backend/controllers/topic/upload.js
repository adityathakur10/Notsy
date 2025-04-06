const scraper = require('../../services/scrapeTranscript');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, CustomAPIError } = require('../../errors');
const topicModels = require('../../models/topic/topicIndex');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const uploadUrls = async (req, res) => {
    try {
        const urls = req.body.urls;
        const topicId = req.body.topicId;
        const userId = req.user.userId;

        if (!Array.isArray(urls) || urls.length === 0) {
            throw new BadRequestError('URLs must be a non-empty array');
        }

        const aggregatedUrls = [];
        const aggregatedTranscripts = [];
        const results = [];

        for (const url of urls) {
            try {
                const videoId = new URL(url).searchParams.get('v');
                if (!videoId) {
                    throw new BadRequestError('Invalid URL: Video ID not found');
                }

                // const existingResource = await topicModels.Resource.findOne({
                //     source: url,
                //     userId,
                //     topicId
                // });
                
                // if (existingResource) {
                //     throw new BadRequestError('Resource already exists');
                // }

                const transcript = await scraper(url);
                if (!transcript) {
                    throw new NotFoundError('Transcript not available for this video');
                }

                aggregatedUrls.push(url);
                aggregatedTranscripts.push(transcript);
                results.push({ url, status: 'success' });

            } catch (error) {
                console.error(`Error processing ${url}:`, error.message);
                
                results.push({
                    url,
                    status: 'failed',
                    message: error.message,
                    ...(error instanceof CustomAPIError && { errorType: error.constructor.name })
                });
            }
        }

        if (aggregatedUrls.length === 0) {
            throw new NotFoundError('No valid transcripts found in any URLs');
        }

        const newResource = await topicModels.Resource.create({
            type: 'video',
            source: aggregatedUrls,
            content: aggregatedTranscripts,
            topicId,
            userId
        });
        const response=await axios.post(' http://127.0.0.1:8000/upload/',{
            type: 'video',
            source: aggregatedUrls,
            content: aggregatedTranscripts,
            topicId,
            userId
        },{
            timeout:1800000
        })
        return res.status(StatusCodes.CREATED).json({
            response: {
                status: response.status,
                data: response.data, // Only send serializable data
                headers: response.headers
            },
            message: `Processed...`,
            data: newResource,
            results
        });

    } catch (error) {
        if (error instanceof CustomAPIError) {
            return res.status(error.statusCode).json({
                msg: error.message,
                ...(error.results && { results: error.results })
            });
        }
        
        console.error('Unexpected error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { debug: error.message })
        });
    }
};

const uploadPdfs = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new BadRequestError('No PDF files uploaded');
        }

        const topicId = req.body.topicId;
        const userId = req.user.userId;
        const pdfFiles = req.files['pdf']; // Assuming you named the field 'pdf' in multer

        const uploadedPdfPaths = [];
        const apiResponses = [];

        for (const pdfFile of pdfFiles) {
            try {
                // 1. Save PDF locally
                const pdfPath = path.join(__dirname, '..', '..', 'uploads', 'pdfs', `${pdfFile.originalname}_${Date.now()}.pdf`);
                await fs.writeFile(pdfPath, pdfFile.buffer);
                uploadedPdfPaths.push(pdfPath);

                // 2. Send PDF to external API
                const apiEndpoint = 'YOUR_EXTERNAL_API_ENDPOINT'; // Replace with your API endpoint
                const formData = new FormData();
                formData.append('pdf', fs.createReadStream(pdfPath), pdfFile.originalname);

                const apiResponse = await axios.post(apiEndpoint, formData, {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': 'Bearer YOUR_API_KEY' // If needed
                    }
                });

                apiResponses.push({
                    pdfName: pdfFile.originalname,
                    status: 'success',
                    data: apiResponse.data
                });

            } catch (error) {
                console.error(`Error processing PDF ${pdfFile.originalname}:`, error);
                apiResponses.push({
                    pdfName: pdfFile.originalname,
                    status: 'failed',
                    message: error.message
                });
            }
        }

        // Create a new Resource document
        const newResource = await topicModels.Resource.create({
            type: 'pdf',
            source: uploadedPdfPaths, // Store the local file paths
            topicId,
            userId
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'PDFs uploaded and processed successfully',
            data: newResource,
            apiResponses
        });

    } catch (error) {
        console.error('Error in uploadPdfs:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    uploadUrls,
    uploadPdfs
};