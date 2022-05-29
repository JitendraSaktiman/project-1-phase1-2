const mongoose = require("mongoose");
// const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    body: {
        type: String,
        trime:true,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: 'Author',
        required: true,
        trim:true
    },
    tags: {
        type: [String],
        required: true,
        trim:true
    },
    category: {
        type: String,
        required: true,
        trim:true
    },
    subcategory: {
        type: [String],
        required: true,
        trime:true
    },
    deletedAt: {
        type: Date,
        // default: null
    },

    isDeleted: {
        type: Boolean,
        default: false,
        trim:true
    },
    publishedAt: {
        type: Date,
        // default:null
    },

    isPublished: {
        type: Boolean,
        default: false
    }
}, {timestamps: true });

module.exports = mongoose.model('blog', blogSchema);