"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    image: String,
    recipes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            unique: true,
            ref: 'Recipe',
        },
    ],
    updatedAt: { type: Date, default: Date.now },
});
const UserCollection = (0, mongoose_1.model)('UserCollection', userCollectionSchema);
exports.default = UserCollection;
