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
    collectionCount: {
        type: Number,
        default: 0,
    },
    widgetCollections: [
        {
            displayName: String,
            icon: String,
            banner: String,
            collectionData: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminCollection' },
            isPublished: { type: Boolean, default: false },
            publishedAt: Date,
            publishedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin' },
            orderBy: String,
            theme: String,
            filter: {
                filterType: String,
                values: [String],
            },
        },
    ],
});
const Widget = (0, mongoose_1.model)('Widget', widgetSchema);
exports.default = Widget;
// addWidget
// deleteWidget
// editWidget
// getAllWidgets
// addWidgetCollection
// removeWidgetCollection
// editWidgetCollection
//
