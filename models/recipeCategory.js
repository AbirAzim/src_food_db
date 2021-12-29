"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
    },
    description: String,
    image: String,
    icon: String,
    isPublished: {
        type: Boolean,
        default: false,
    }
});
const RecipeCategory = (0, mongoose_1.model)('RecipeCategory', recipeCategorySchema);
exports.default = RecipeCategory;
