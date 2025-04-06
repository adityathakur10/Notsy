const {StatusCodes}=require('http-status-codes')
const {CustomAPIError,NotFoundError,BadRequestError}=require('../../errors/index')
const topicModel=require('../../models/topic/topicIndex')   

const getResourceById = async (req, res) => {
    const resourceId = req.params.id;
    const userId = req.user.userId;

    try {
        const resource = await topicModel.Resource.findById(resourceId)
            .lean() // Add this for better performance
            .exec();
        
        if (!resource) {
            throw new NotFoundError('Resource not found');
        }

        // Add this debug log
        console.log('Resource being sent:', resource);
        
        if (!Array.isArray(resource.source)) {
            resource.source = [resource.source]; // Ensure source is always an array
        }
        
        return res.status(StatusCodes.OK).json({ resource });
    } catch (error) {
        console.error('Error details:', error);
        if (error instanceof CustomAPIError) {
            return res.status(error.statusCode).json({ msg: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong' });
    }
};

module.exports={
    getResourceById,
    // uploadUrls,
    // uploadPDF
}