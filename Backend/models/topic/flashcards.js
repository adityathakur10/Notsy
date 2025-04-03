const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
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
    sourceChats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    question: {
        type: String,
        required: [true, 'Please provide a question']
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer']
    },
    tags: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
    }
    // lastReviewed: {
    //     type: Date
    // },
    // reviewStats: {
    //     timesReviewed: {
    //         type: Number,
    //         default: 0
    //     },
    //     correctCount: {
    //         type: Number,
    //         default: 0
    //     },
    //     incorrectCount: {
    //         type: Number,
    //         default: 0
    //     }
    // }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);