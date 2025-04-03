const folder = require('../models/notebook/folder');
const {StatusCodes}=require('http-status-codes');
const { CustomAPIError,UnauthenticatedError,NotFoundError,BadRequestError}=require('../errors/index');

const createFolder=async(req,res)=>{
    const name=req.body.name;
    const userId=req.user.userId;
    try {
        const newFolder=await folder.findOne({name:name,userId:userId});
        if(newFolder){
            throw new BadRequestError('folder already exists');
        }
        const folderData=await folder.create({
            name:name,
            userId:userId
        });
        return res.status(StatusCodes.CREATED).json({msg:'folder created ',folder:folderData})
    } catch (error) {
        if(error instanceof CustomAPIError){
            return res.status(error.statusCode).json({msg:error.message});
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'internal server error'});
    }
}

const getAllFolders=async(req,res)=>{
    const userId=req.user.userId;
    try {
        const folders=await folder.find({userId:userId}).sort({createdAt:-1});
        if(folders.length===0){
            // return res.status(StatusCodes.NOT_FOUND).json({msg:'no folders found'});
            throw new NotFoundError('no folders found');
        }
        return res.status(StatusCodes.OK).json({
            msg:'all folders',
            count:folders.length,
            folders:folders
        });
    } catch (error) {
        if(error instanceof CustomAPIError){
            return res.status(error.statusCode).json({msg:error.message});
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'internal server error'});
    }
}

const deleteFolder = async (req, res) => {
    const folderId = req.params.id;
    const userId = req.user.userId;

    try {
        // 1. Verify folder exists
        const folderToDelete = await folder.findOne({ _id: folderId, userId });
        if (!folderToDelete) {
            throw new NotFoundError('Folder not found');
        }

        // 2. Get all topics in this folder
        const topicsInFolder = await Topic.find({ folderId });

        // 3. Extract topic IDs
        const topicIds = topicsInFolder.map(t => t._id);

        // 4. Delete ALL related data
        await Promise.all([
            folder.deleteOne({ _id: folderId, userId }),
            Topic.deleteMany({ folderId }),
            
            // Delete all data related to these topics
            Resource.deleteMany({ topicId: { $in: topicIds } }),
            Chat.deleteMany({ topicId: { $in: topicIds } }),
            Flashcard.deleteMany({ topicId: { $in: topicIds } }),
            
            // Remove graph nodes and edges related to these topics
            Graph.updateMany(
                { userId },
                { 
                    $pull: { 
                        nodes: { nodeId: { $in: topicIds } },
                        edges: { 
                            $or: [
                                { source: { $in: topicIds } },
                                { target: { $in: topicIds } }
                            ]
                        }
                    }
                }
            )
        ]);

        return res.status(StatusCodes.OK).json({
            message: 'Folder and all related content deleted successfully'
        });
    } catch (error) {
        // Error handling
    }
};


