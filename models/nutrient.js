"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nutrientSchema = new mongoose_1.Schema({
    nutrient: String,
    category: String,
    value: String,
    id: String,
    unitName: String,
    parentNutrient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Nutrient',
    },
    min: String,
    rank: Number,
    publication_date: String,
    refDatabaseId: String,
    related_sources: [{
            source: String,
            sourceId: String,
            sourceNutrientName: String,
            units: String,
        }]
});
const Nutrient = (0, mongoose_1.model)('Nutrient', nutrientSchema);
exports.default = Nutrient;
//       {
//           "nutrient": "Vitamin A, IU",
//           "category": "",
//           "value": "100",
//           "id": _id,
//           "unitName": "String",
//           "parentNutrient": ,
//           "min": "",
//           "rank": "",
//           "publication_date": "2019-04-01"
//           "refDatabaseId": "",
//           "related_sources": [{
//             "source": "usda-legacy",
//             "sourceId": "9427",
//             "sourceNutrientName": "Abiyuch, raw",
//             "units": "IU",
//           }]
//       },
