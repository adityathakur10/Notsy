const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    nodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    label: {
        type: String,
        required: true
    }
});

const edgeSchema = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    strength: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const graphSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nodes: [nodeSchema],
    edges: [edgeSchema]
});

module.exports = mongoose.model('Graph', graphSchema);