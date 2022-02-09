"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mapToBlend = new mongoose_1.Schema({
    blendId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'BlendNutrient' },
    nutrientName: String,
    altName: String,
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrientCategory' },
    status: { enum: ['active', 'review', 'archieve'], default: 'review' },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrient' },
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
const MapToBlend = (0, mongoose_1.model)('MapToBlend', mapToBlend);
exports.default = MapToBlend;
