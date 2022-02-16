"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blendIngredientSchema = new mongoose_1.Schema({
    ingredientName: String,
    category: String,
    blendStatus: String,
    classType: String,
    description: String,
    srcFoodReference: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ingredient' },
    blendNutrients: [
        {
            value: String,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendNutrient',
            },
        },
    ],
    notBlendNutrients: [
        {
            value: String,
            sourceId: String,
            uniqueNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'UniqueNutrient',
            },
        },
    ],
    portions: [
        {
            measurement: String,
            measurement2: String,
            meausermentWeight: String,
            default: Boolean,
            sourceId: String,
        },
    ],
    featuredImage: String,
    images: [String],
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});
const BlendIngredient = (0, mongoose_1.model)('BlendIngredient', blendIngredientSchema);
exports.default = BlendIngredient;