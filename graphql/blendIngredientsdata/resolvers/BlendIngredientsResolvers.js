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
const mongoose_1 = __importDefault(require("mongoose"));
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
const AddBlendIngredient_1 = __importDefault(require("./input-type/AddBlendIngredient"));
const IngredientFilter_1 = __importDefault(require("./input-type/IngredientFilter"));
const BlendIngredientInfo_1 = __importDefault(require("./input-type/BlendIngredientInfo"));
const EditBlendIngredient_1 = __importDefault(require("./input-type/EditBlendIngredient"));
const BlendIngredientData_1 = __importDefault(require("../schemas/BlendIngredientData"));
const ReturnBlendIngredient_1 = __importDefault(require("../schemas/ReturnBlendIngredient"));
const ReturnBlendIngredientBasedOnDefaultPortion_1 = __importDefault(require("../schemas/ReturnBlendIngredientBasedOnDefaultPortion"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const BlendNutrient_1 = __importDefault(require("../schemas/BlendNutrient"));
let BlendIngredientResolver = class BlendIngredientResolver {
    async getAllBlendIngredients() {
        let blendIngredients = await blendIngredient_1.default.find();
        let returnIngredients = [];
        for (let i = 0; i < blendIngredients.length; i++) {
            let returnIngredient = blendIngredients[i];
            returnIngredient.nutrientCount =
                blendIngredients[i].blendNutrients.length;
            returnIngredient.notBlendNutrientCount =
                blendIngredients[i].notBlendNutrients.length;
            returnIngredient.imageCount = blendIngredients[i].images.length;
            returnIngredients.push(returnIngredient);
        }
        return returnIngredients;
    }
    async EditIngredient(data) {
        let food = await blendIngredient_1.default.findOne({ _id: data.editId });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        console.log(data.editableObject.defaultPortion);
        if (data.editableObject.defaultPortion === '' ||
            data.editableObject.defaultPortion === null ||
            data.editableObject.defaultPortion === undefined) {
            console.log('no default portion');
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        else {
            let newData = food;
            //@ts-ignore
            let newPortions = [];
            for (let i = 0; i < newData.portions.length; i++) {
                // console.log(newData.portions[i]._id);
                // console.log(data.editableObject.defaultPortion);
                if (String(newData.portions[i]._id) ===
                    String(data.editableObject.defaultPortion)) {
                    console.log('matched');
                    let changePortion = {
                        measurement: newData.portions[i].measurement,
                        measurement2: newData.portions[i].measurement2,
                        meausermentWeight: newData.portions[i].meausermentWeight,
                        default: true,
                        _id: newData.portions[i]._id,
                    };
                    newPortions.push(changePortion);
                }
                else {
                    let changePortion2 = {
                        measurement: newData.portions[i].measurement,
                        measurement2: newData.portions[i].measurement2,
                        meausermentWeight: newData.portions[i].meausermentWeight,
                        default: false,
                        _id: newData.portions[i]._id,
                    };
                    newPortions.push(changePortion2);
                }
            }
            newData.portions = newPortions;
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, newData);
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        return 'Successfully Edited';
    }
    async getBlendIngredientById(id) {
        let blendIngredient = await blendIngredient_1.default.findById(id)
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            populate: {
                path: 'category',
                model: 'BlendNutrientCategory',
            },
        })
            .populate('srcFoodReference');
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
    async filterIngredientByCategoryAndClass(data) {
        let ingredients;
        if (data.ingredientCategory === 'All') {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - ' + data.IngredientClass,
            }).populate({
                path: 'blendNutrients.blendNutrientRefference',
                model: 'BlendNutrient',
            });
        }
        else {
            ingredients = await blendIngredient_1.default.find({
                category: data.ingredientCategory,
                classType: 'Class - ' + data.IngredientClass,
            }).populate({
                path: 'blendNutrients.blendNutrientRefference',
                model: 'BlendNutrient',
            });
        }
        return ingredients;
    }
    // blendNutrients: [
    //   {
    //     value: String,
    //     blendNutrientRefference: {
    //       type: Schema.Types.ObjectId,
    //       ref: 'BlendNutrient',
    //     },
    //   },
    // ],
    async getBlendIngredientInfoBasedOnDefaultPortion(ingredientId) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        }).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let defaultPortion;
        let found = false;
        for (let i = 0; i < ingredient.portions.length; i++) {
            if (ingredient.portions[i].default) {
                defaultPortion = ingredient.portions[i].meausermentWeight;
                found = true;
            }
        }
        if (!found) {
            defaultPortion = ingredient.portions[0].meausermentWeight;
        }
        let defaultPortionNutrients = [];
        // checked above
        for (let i = 0; i < ingredient.blendNutrients.length; i++) {
            let nutrient = {
                value: (+ingredient.blendNutrients[i].value / 100) * defaultPortion,
                blendNutrientRefference: ingredient.blendNutrients[i].blendNutrientRefference,
            };
            defaultPortionNutrients.push(nutrient);
        }
        let returnIngredientBasedOnDefaultPortion = ingredient;
        returnIngredientBasedOnDefaultPortion.defaultPortionNutrients =
            defaultPortionNutrients;
        return returnIngredientBasedOnDefaultPortion;
    }
    async searchBlendIngredients(searchTerm) {
        let ingredients = await blendIngredient_1.default.find({
            ingredientName: { $regex: searchTerm, $options: 'i' },
        }).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        return ingredients;
    }
    // [
    //  {
    //   ingredientd: "",
    //   value: "",
    // },
    //  {
    //   ingredientd: "",
    //   value: "",
    // },
    //  {
    //   ingredientd: "",
    //   value: "",
    // },
    // ]
    async getBlendNutritionBasedOnRecipe(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
        }).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        for (let i = 0; i < ingredients.length; i++) {
            let value = data.filter(
            // @ts-ignore
            (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                ingredients[i].blendNutrients[j].value =
                    (+ingredients[i].blendNutrients[j].value / 100) * value;
                // if (
                //   String(ingredients[i].nutrients[j].uniqueNutrientRefference._id) ===
                //   '61c618813ced314894f2924a'
                // ) {
                //   console.log(ingredients[i].nutrients[j].value);
                // }
            }
        }
        let nutrients = [];
        for (let i = 0; i < ingredients.length; i++) {
            nutrients.push(...ingredients[i].blendNutrients);
        }
        //@ts-ignore
        let returnNutrients = nutrients.reduce((acc, nutrient) => {
            //@ts-ignore
            let obj = acc.find(
            //@ts-ignore
            (o) => String(o.blendNutrientRefference._id) ===
                String(nutrient.blendNutrientRefference._id));
            if (!obj) {
                nutrient.count = 1;
                acc.push(nutrient);
            }
            else {
                //@ts-ignore
                const index = acc.findIndex((element, index) => {
                    if (String(element.blendNutrientRefference._id) ===
                        String(obj.blendNutrientRefference._id)) {
                        return true;
                    }
                });
                acc[index].count++;
                acc[index].value = +acc[index].value + +nutrient.value;
            }
            return acc;
        }, []);
        for (let j = 0; j < returnNutrients.length; j++) {
            returnNutrients[j].category = await blendNutrientCategory_1.default.findOne({
                _id: returnNutrients[j].category,
            });
            returnNutrients[j].parent =
                returnNutrients[j].parent === null
                    ? null
                    : await blendNutrient_1.default.findOne({
                        _id: returnNutrients[j].parent,
                    });
        }
        console.log(returnNutrients[0]);
        return returnNutrients;
        // let childNutrients: any = [];
        // let getRootNutrients = returnNutrients.filter(
        //   //@ts-ignore
        //   (rn) => {
        //     if (!rn.blendNutrientRefference.parentIsCategory) {
        //       childNutrients.push(rn);
        //     } else return true;
        //   }
        // );
        // let nutrientCategories = [
        //   {
        //     _id: '6203a9061c100bd226c13c65',
        //     categoryName: 'Calories',
        //   },
        //   {
        //     _id: '6203a9381c100bd226c13c67',
        //     categoryName: 'Energy',
        //   },
        //   {
        //     _id: '6203a96e1c100bd226c13c69',
        //     categoryName: 'Vitamins',
        //   },
        //   {
        //     _id: '6203a98a1c100bd226c13c6b',
        //     categoryName: 'Minerals',
        //   },
        // ];
        // let outPut: any = {};
        // let childOutPut: any = {};
        // for (let i = 0; i < getRootNutrients.length; i++) {
        //   let category = nutrientCategories.filter(
        //     (nc) =>
        //       nc._id ===
        //       String(getRootNutrients[i].blendNutrientRefference.category)
        //   )[0];
        //   if (!outPut[category.categoryName]) {
        //     outPut[category.categoryName] = {
        //       value: +getRootNutrients[i].value,
        //       data: [getRootNutrients[i].blendNutrientRefference],
        //     };
        //   } else {
        //     outPut[category.categoryName].value =
        //       +outPut[category.categoryName].value + +getRootNutrients[i].value;
        //     outPut[category.categoryName].data.push(
        //       getRootNutrients[i].blendNutrientRefference
        //     );
        //     //@ts-ignore
        //     outPut[category.categoryName].data.sort((a, b) => a.rank - b.rank);
        //   }
        // }
        // console.log(outPut);
        // return;
        // let mappedReturnData = [];
        // for (let p = 0; p < returnNutrients.length; p++) {
        //   let mapto: any = await MapToBlendModel.findOne({
        //     srcUniqueNutrientId: returnNutrients[p].uniqueNutrientRefference._id,
        //   });
        //   if (!mapto) {
        //     continue;
        //   }
        //   let blendData = await BlendNutrientModel.findOne({
        //     _id: mapto.blendNutrientId,
        //   })
        //     .populate('category')
        //     .populate('parent');
        //   returnNutrients[p].blendData = blendData;
        //   mappedReturnData.push(returnNutrients[p]);
        // }
        // return mappedReturnData;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendIngredient_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "EditIngredient", null);
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
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IngredientFilter_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "filterIngredientByCategoryAndClass", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReturnBlendIngredientBasedOnDefaultPortion_1.default),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendIngredientInfoBasedOnDefaultPortion", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "searchBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendNutrient_1.default) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipe", null);
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
