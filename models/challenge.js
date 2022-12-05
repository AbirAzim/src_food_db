"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChallengeSchema = new mongoose_1.Schema({
    challengeName: {
        type: 'string',
        required: [true, 'challengeName is required'],
    },
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'Member ID is required'],
    },
    description: {
        type: 'string',
        default: '',
    },
    notification: {
        type: 'boolean',
        default: false,
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    days: Number,
    isActive: {
        type: Boolean,
        default: false,
    },
    sharedWith: [
        {
            memberId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            hasAccepted: { type: Boolean, default: false },
            blendScore: Number,
        },
    ],
    topIngredients: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ingredient' },
            count: Number,
        },
    ],
});
const Challenge = (0, mongoose_1.model)('challenge', ChallengeSchema);
exports.default = Challenge;
