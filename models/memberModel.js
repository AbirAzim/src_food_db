"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    image: String,
    bio: String,
    provider: {
        type: String,
        enum: ['email', 'google', 'facebook'],
        default: 'email',
    },
    firstName: String,
    lastName: String,
    displayName: String,
    yourBlender: String,
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
    },
    phone: String,
    location: String,
    orderHistoty: [String],
    myCart: [String],
    recentViewedProducts: [String],
    createdAt: { type: Date, default: Date.now },
    configuration: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'MemberConfiguiration',
    },
    defaultCollection: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UserCollection' },
    lastModifiedCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserCollection',
    },
    collections: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'UserCollection' }],
    dailyGoal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'dailyGoal' },
});
const Member = (0, mongoose_1.model)('User', memberSchema);
exports.default = Member;
