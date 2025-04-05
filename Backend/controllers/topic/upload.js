const scraper = require('../../services/scrapeTranscript');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, CustomAPIError } = require('../../errors');
const topicModels = require('../../models/topic/topicIndex');

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

                const existingResource = await topicModels.Resource.findOne({
                    source: url,
                    userId,
                    topicId
                });
                
                if (existingResource) {
                    throw new BadRequestError('Resource already exists');
                }

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

        return res.status(StatusCodes.CREATED).json({
            message: `Processed ${aggregatedUrls.length}/${urls.length} URLs successfully`,
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

module.exports = {
    uploadUrls
};
