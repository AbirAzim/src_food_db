"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DailySchema = new mongoose_1.Schema({
    nutrientName: String,
    categoryName: String,
    ranges: [
        {
            lifeStageGroup: {
                type: String,
                enum: [
                    'infants',
                    'children',
                    'adults',
                    'males',
                    'females',
                    'pregnancy',
                    'lactation',
                ],
            },
            ageInRange: Boolean,
            ageInMonth: Boolean,
            dailyPercentage: Boolean,
            dailyPercentageInRange: Boolean,
            ageRangeFrom: Number,
            ageRangeTo: Number,
            ageMorethan: Number,
            ageLessThan: Number,
            dailyPercentageRangeFrom: Number,
            dailyPercentageRangeTo: Number,
            dailyPercentageValue: Number,
            value: Number,
            units: String,
            RDA: Boolean,
        },
    ],
});
const UserDaily = (0, mongoose_1.model)('userDaily', DailySchema);
exports.default = UserDaily;
