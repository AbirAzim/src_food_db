"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingredient_1 = __importDefault(require("../models/ingredient"));
const recipe_1 = __importDefault(require("../models/recipe"));
function getGenericModel(collectionType) {
    if (collectionType === 'Ingredient') {
        return ingredient_1.default;
    }
    else if (collectionType === 'Recipe') {
        return recipe_1.default;
    }
    else {
        return null;
    }
}
exports.default = getGenericModel;
