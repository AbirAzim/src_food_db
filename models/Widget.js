"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const widgetSchema = new mongoose_1.Schema({
    widgetName: {
        type: String,
        required: [true, 'Widget Name Is Required'],
        unique: true,
    },
    widgetType: String,
    widget: [
        {
            icon: String,
            banner: String,
            hasIcon: Boolean,
            hasBanner: Boolean,
            collections: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminCollection' }],
            isPublished: Boolean,
            publishedAt: Date,
            publishedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin' },
        },
    ],
});
const Widget = (0, mongoose_1.model)('Widget', widgetSchema);
exports.default = Widget;
