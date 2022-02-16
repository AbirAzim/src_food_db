"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blendNutrient = new mongoose_1.Schema({
    blendId: String,
    nutrientName: String,
    altName: String,
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrientCategory' },
    status: {
        type: String,
        enum: ['Active', 'Review', 'Archieve'],
        default: 'Active',
    },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrient' },
    uniqueNutrientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UniqueNutrient' },
    parentIsCategory: Boolean,
    rank: Number,
    unitName: String,
    units: String,
    min_measure: String,
    related_sources: [
        {
            source: String,
            // sourceId: { type: Schema.Types.ObjectId, ref: 'UniqueNutrient' },
            sourceNutrientName: String,
            units: String,
        },
    ],
});
const BlendNutrient = (0, mongoose_1.model)('BlendNutrient', blendNutrient);
exports.default = BlendNutrient;
