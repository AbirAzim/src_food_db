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
    recipeBlendCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeCategory' },
    tempBlendCategory: String,
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeBrand' },
    foodCategories: [String],
    ingredients: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ingredient' },
            selectedPortion: { name: String, quantity: Number, gram: Number },
            portions: [
                { name: String, quantiy: Number, default: Boolean, gram: Number },
            ],
        },
    ],
    testIngredient: [
        {
            quantity: String,
            unit: String,
            name: String,
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
    url: String,
    favicon: String,
    // blendStatus:
    addedByAdmin: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    adminIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    ],
    discovery: {
        type: Boolean,
        default: false,
    },
    global: { type: Boolean, default: false },
    numberOfRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
});
const Recipe = (0, mongoose_1.model)('Recipe', recipeSchema);
exports.default = Recipe;
