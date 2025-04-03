const mongoose = require('mongoose');

const revisionNotesSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content for the revision note']
    },
    // sourceChats: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chat'
    // }],
    // lastUpdated: {
    //     type: Date
    // }
}, { timestamps: true });

module.exports = mongoose.model('RevisionNotes', revisionNotesSchema);