"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'comment name is required'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    recipeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Recipe' },
    createdAt: { type: Date, default: Date.now },
    commnetedBy: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    modifiedAt: Date,
});
const UserComment = (0, mongoose_1.model)('userComment', commentSchema);
exports.default = UserComment;
