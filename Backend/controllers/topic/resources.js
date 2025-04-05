const {StatusCodes}=require('http-status-codes')
const {CustomAPIError,NotFoundError,BadRequestError}=require('../../errors/index')
const topicModel=require('../../models/topic/topicIndex')   

const getResourceById=async(req,res)=>{
    const ResourceId=req.params.id;
    const userId=req.user.userId;

    try {
        const resource=await topicModel.Resource.findById({ResourceId});
        if(!resource)
            throw new NotFoundError('Resource not found')
        
        return res.status(StatusCodes.OK).json({resource});
    } catch (error) {
        if(error instanceof CustomAPIError){
            return res.status(error.statusCode).json({msg:error.message})   
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'Something went wrong'})
        }
            
    }
}


module.exports={
    getResourceById,
    // uploadUrls,
    // uploadPDF
}