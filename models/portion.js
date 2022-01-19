"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const portionSchema = new mongoose_1.Schema({
    measurement: String,
    measurement2: String,
    meausermentWeight: String,
    refDatabaseId: String,
});
const Portion = (0, mongoose_1.model)('Portion', portionSchema);
exports.default = Portion;
