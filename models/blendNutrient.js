"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blendNutrient = new mongoose_1.Schema({
    blendId: String,
    nutrientName: String,
    altName: String,
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrientCategory' },
    status: { enum: ['active', 'review', 'archieve'], default: 'review' },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrient' },
    parentIsCategory: Boolean,
    rank: Number,
    unitName: String,
    units: String,
    min_measure: String,
    related_sources: [
        {
            source: String,
            sourceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UniqueNutrient' },
            sourceNutrientName: String,
            units: String,
        },
    ],
});
const BlendNutrient = (0, mongoose_1.model)('BlendNutrient', blendNutrient);
exports.default = BlendNutrient;
