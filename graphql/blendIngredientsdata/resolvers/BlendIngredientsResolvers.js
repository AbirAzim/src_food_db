"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const AddBlendIngredient_1 = __importDefault(require("./input-type/AddBlendIngredient"));
const BlendIngredientData_1 = __importDefault(require("../schemas/BlendIngredientData"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let BlendIngredientResolver = class BlendIngredientResolver {
    async getAllBlendIngredients() {
        let blendIngredients = await blendIngredient_1.default.find().populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        return blendIngredients;
    }
    async getBlendIngredientById(id) {
        let blendIngredient = await blendIngredient_1.default.findById(id).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        return blendIngredient;
    }
    async removeABlendIngredient(id) {
        await blendIngredient_1.default.findByIdAndRemove(id);
        return 'BlendIngredient removed';
    }
    async addNewBlendIngredient(data) {
        await blendIngredient_1.default.create(data);
        return 'BlendIngredient added';
    }
    async addNewBlendIngredientFromSrc(srcId) {
        let srcFood = await ingredient_1.default.findById(srcId);
        if (!srcFood) {
            return new AppError_1.default('Food not found in src', 404);
        }
        let blendIngredientWithTheSrcId = await blendIngredient_1.default.findOne({
            srcFoodReference: srcId,
        });
        if (blendIngredientWithTheSrcId) {
            return new AppError_1.default('BlendIngredient already exists with that ID', 404);
        }
        let newBlendIngredient = {
            ingredientName: srcFood.name,
            blendStatus: 'Review',
            classType: '',
            description: '',
            srcFoodReference: srcFood._id,
            portions: srcFood.portions,
        };
        newBlendIngredient.notBlendNutrients = [];
        newBlendIngredient.blendNutrients = [];
        for (let i = 0; i < srcFood.nutrients.length; i++) {
            let found = await mapToBlend_1.default.findOne({
                srcUniqueNutrientId: srcFood.nutrients[i].uniqueNutrientRefference,
            });
            if (!found) {
                newBlendIngredient.notBlendNutrients.push(srcFood.nutrients[i]);
            }
            else {
                let nutrient = {
                    value: srcFood.nutrients[i].value,
                    blendNutrientRefference: found.blendNutrientId,
                };
                newBlendIngredient.blendNutrients.push(nutrient);
            }
        }
        return 'Added successfully';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendIngredientData_1.default),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendIngredientById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "removeABlendIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddBlendIngredient_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addNewBlendIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlendIngredientData_1.default),
    __param(0, (0, type_graphql_1.Arg)('srcId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addNewBlendIngredientFromSrc", null);
BlendIngredientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendIngredientResolver);
exports.default = BlendIngredientResolver;
// ingredientName: String,
//   category: String,
//   blendStatus: String,
//   classType: String,
//   description: String,
//   srcFoodReference: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
//   blendNutrients: [
//     {
//       value: String,
//       blendNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'BlendNutrient',
//       },
//     },
//   ],
//   notBlendNutrients: [
//     {
//       value: String,
//       sourceId: String,
//       uniqueNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'UniqueNutrient',
//       },
//     },
//   ],
//   portions: [
//     {
//       measurement: String,
//       measurement2: String,
//       meausermentWeight: String,
//       default: Boolean,
//       sourceId: String,
//     },
//   ],
//   ingredientName: String,
//   category: String,
//   blendStatus: String,
//   classType: String,
//   source: String,
//   description: String,
//   sourceId: String,
//   sourceCategory: String,
//   publication_date: String,
//   nutrients: [
//     {
//       value: String,
//       sourceId: String,
//       uniqueNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'UniqueNutrient',
//       },
//     },
//   ],
//   portions: [
//     {
//       measurement: String,
//       measurement2: String,
//       meausermentWeight: String,
//       default: Boolean,
//       sourceId: String,
//     },
//   ],
