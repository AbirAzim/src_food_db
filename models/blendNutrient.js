"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let allUnits = {
    Kilojoules: { unit: 'kJ', unitName: 'Kilojoules' },
    Gram: { unit: 'G', unitName: 'Gram' },
    Milligram: { unit: 'MG', unitName: 'Milligram' },
    Microgram: { unit: 'UG', unitName: 'Microgram' },
    Kilogram: { unit: 'KG', unitName: 'Kilogram' },
    Millilitre: { unit: 'ML', unitName: 'Millilitre' },
};
const blendNutrient = new mongoose_1.Schema({
    blendId: String,
    nutrientName: String,
    altName: String,
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrientCategory' },
    status: {
        type: String,
        enum: ['Active', 'Review', 'Archived'],
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
            sourceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UniqueNutrient' },
            sourceNutrientName: String,
            units: String,
        },
    ],
    wikiCoverImages: [String],
    wikiFeatureImage: String,
    bodies: [String],
    wikiTitle: String,
    wikiDescription: String,
    seoTitle: String,
    seoSlug: String,
    seoCanonicalURL: String,
    seoSiteMapPriority: Number,
    seoKeywords: [String],
    seoMetaDescription: String,
    createdAt: { type: Date, default: Date.now },
    isPublished: Boolean,
});
const BlendNutrient = (0, mongoose_1.model)('BlendNutrient', blendNutrient);
blendNutrient.pre('save', async function (next) {
    if (this.unitName !== '' ||
        this.unitName === null ||
        this.unitName === undefined) {
        //@ts-ignore
        this.units = allUnits[this.unitName].unit;
        next();
    }
});
blendNutrient.pre('update', async function (next) {
    if (
    //@ts-ignore
    this.unitName !== '' ||
        //@ts-ignore
        this.unitName === null ||
        //@ts-ignore
        this.unitName === undefined) {
        //@ts-ignore
        this.units = allUnits[this.unitName].unit;
        next();
    }
});
exports.default = BlendNutrient;
