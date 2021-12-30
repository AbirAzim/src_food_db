"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    brandName: {
        type: String,
        required: [true, 'brand name is required'],
        unique: true,
    },
    brandDescription: String,
    brandImage: String,
    brandIcon: String,
    brandUrl: String,
    title: String,
    canonicalURL: String,
    siteMap: String,
    metaDesc: String,
    keywords: [String],
});
const RecipeBrand = (0, mongoose_1.model)('RecipeBrand', brandSchema);
exports.default = RecipeBrand;
