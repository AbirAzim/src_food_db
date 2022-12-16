"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    slug: String,
    image: String,
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
    },
    plans: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            unique: true,
            ref: 'GeneraBlog',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    collectionDataCount: {
        type: Number,
        default: 0,
    },
    updatedAt: { type: Date, default: Date.now },
});
planCollectionSchema.pre('save', async function (next) {
    this.collectionDataCount = this.blogs.length;
    next();
});
planCollectionSchema.post('update', async function (next) {
    //@ts-ignore
    this.collectionDataCount = this.blogs.length;
    next();
});
const BlogCollection = (0, mongoose_1.model)('BlogCollection', planCollectionSchema);
exports.default = BlogCollection;
