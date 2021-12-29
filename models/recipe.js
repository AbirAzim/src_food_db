"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    mainEntityOfPage: String,
    name: String,
    image: [{ image: String, default: Boolean }],
    datePublished: String,
    description: String,
    prepTime: String,
    cookTime: String,
    totalTime: String,
    recipeYield: String,
    recipeIngredients: [String],
    recipeInstructions: [String],
    recipeCuisines: [String],
    author: [String],
    recipeBlendCategory: String,
    brandName: String,
    foodCategories: [String],
    ingredients: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Ingredient',
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
    url: String,
    favicon: String,
});
const Recipe = (0, mongoose_1.model)('Recipe', recipeSchema);
exports.default = Recipe;