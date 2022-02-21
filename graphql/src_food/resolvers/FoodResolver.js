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
const uniqueNutrient_1 = __importDefault(require("../../../models/uniqueNutrient"));
const RecycledIngredient_1 = __importDefault(require("../../../models/RecycledIngredient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const EditBlendIngredient_1 = __importDefault(require("../../blendIngredientsdata/resolvers/input-type/EditBlendIngredient"));
const EditNutrient_1 = __importDefault(require("./input-type/EditNutrient"));
const createIngredient_1 = __importDefault(require("./input-type/createIngredient"));
const IngredientInfo_1 = __importDefault(require("./input-type/IngredientInfo"));
const Ingredient_1 = __importDefault(require("../schemas/Ingredient"));
const NutrientValue_1 = __importDefault(require("../schemas/NutrientValue"));
const ReturnIngredient_1 = __importDefault(require("../schemas/ReturnIngredient"));
const UniqueNutrient_1 = __importDefault(require("../schemas/UniqueNutrient"));
const ReurnIngredientBasedOnDefaultPortion_1 = __importDefault(require("../schemas/ReurnIngredientBasedOnDefaultPortion"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
let MemberResolver = class MemberResolver {
    async getAllTheIngredients() {
        let ingredients = await ingredient_1.default.find({}).populate({
            path: 'nutrients.uniqueNutrientRefference',
            model: 'UniqueNutrient',
        });
        let returnIngredients = [];
        for (let i = 0; i < ingredients.length; i++) {
            let returnIngredient = ingredients[i];
            returnIngredient.nutrientCount = ingredients[i].nutrients.length;
            returnIngredient.portionCount = ingredients[i].portions.length;
            returnIngredient.imageCount = ingredients[i].images.length;
            returnIngredients.push(returnIngredient);
        }
        return returnIngredients;
    }
    async getALlUniqueNutrientList() {
        let nutrients = await uniqueNutrient_1.default.find({});
        for (let i = 0; i < nutrients.length; i++) {
            let mapToBlend = await mapToBlend_1.default.findOne({
                srcUniqueNutrientId: nutrients[i]._id,
            });
            if (mapToBlend) {
                nutrients[i].mapTo = mapToBlend.blendNutrientId;
            }
        }
        return nutrients;
    }
    async createNewIngredient(data) {
        let ingredient = await ingredient_1.default.create(data);
        return ingredient;
    }
    async gerASingleIngredient(ingredientId) {
        let ingredient = await ingredient_1.default.findOne({
            _id: ingredientId,
        }).populate({
            path: 'nutrients.uniqueNutrientRefference',
            model: 'UniqueNutrient',
        });
        return ingredient;
    }
    async getAUniqueNutrient(nutrientId) {
        let nutrient = await uniqueNutrient_1.default.findOne({
            _id: nutrientId,
        });
        return nutrient;
    }
    async editUniqueNutrient(data) {
        await uniqueNutrient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Successfully Edited';
    }
    async EditIngredient(data) {
        let food = await ingredient_1.default.findOne({ _id: data.editId });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        console.log(data.editableObject.defaultPortion);
        if (data.editableObject.defaultPortion === '' ||
            data.editableObject.defaultPortion === null ||
            data.editableObject.defaultPortion === undefined) {
            console.log('no default portion');
            await ingredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
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
            await ingredient_1.default.findOneAndUpdate({ _id: data.editId }, newData);
            await ingredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        return 'Successfully Edited';
    }
    async storeAllUniqueNutrient() {
        let nutrients = fs_1.default.readFileSync('./temp/nutrients.json', 'utf-8');
        nutrients = JSON.parse(nutrients);
        for (let i = 0; i < nutrients.length; i++) {
            let nutrient = {
                _id: nutrients[i]._id,
                nutrient: nutrients[i].name,
                category: '',
                nutrientId: '',
                unitName: nutrients[i].unit_name,
                min: '',
                rank: nutrients[i].rank,
                refDatabaseId: nutrients[i]._id,
                related_sources: [
                    {
                        source: 'USDA',
                        sourceId: nutrients[i].id,
                        sourceNutrientName: nutrients[i].name,
                        units: nutrients[i].unit_name,
                    },
                ],
            };
            await uniqueNutrient_1.default.create(nutrient);
        }
        return 'done';
    }
    // @Query(() => String)
    // async databaseShifting() {
    //   let foods: any = fs.readFileSync('./temp/food.json', 'utf-8');
    //   foods = JSON.parse(foods);
    //   for (let i = 0; i < foods.length; i++) {
    //     let findFood = await FoodSrcModel.findOne({
    //       refDatabaseId: foods[i]._id,
    //     });
    //     if (!findFood) {
    //       let food = {
    //         nutrients: [] as NutrientValue[],
    //         portions: [] as Portion[],
    //         refDatabaseId: foods[i]._id,
    //         ingredientName: foods[i].name,
    //         ingredientId: '',
    //         category: '',
    //         blendStatus: 'Review',
    //         classType: '',
    //         source: foods[i].data_type,
    //         description: foods[i].description,
    //         sourceId: foods[i].NDB_number
    //           ? foods[i].NDB_number
    //           : foods[i].foodCode,
    //         sourceCategory: foods[i].categoryId.description,
    //         publication_date: foods[i].publication_date,
    //       };
    //       for (let j = 0; j < foods[i].nutrients.length; j++) {
    //         let newNutrient = {
    //           value: foods[i].nutrients[j].amount,
    //           sourceId: foods[i].nutrients[j].id,
    //           uniqueNutrientRefference:
    //             foods[i].nutrients[j].nutrientDescription._id,
    //         };
    //         food.nutrients.push(newNutrient);
    //       }
    //       for (let k = 0; k < foods[i].portions.length; k++) {
    //         let newPortion = {
    //           measurement: foods[i].portions[k].modifier,
    //           measurement2: foods[i].portions[k].measureUnitName,
    //           meausermentWeight: foods[i].portions[k].gram_weight,
    //           sourceId: foods[i].portions[k].id,
    //         };
    //         //@ts-ignore
    //         food.portions.push(newPortion);
    //       }
    //       await FoodSrcModel.create(food);
    //     }
    //   }
    //   return 'done';
    // }
    // @Mutation(() => String)
    // async deleteFood() {
    //   await UniqueNutrientModel.deleteMany({});
    //   await FoodSrcModel.deleteMany({});
    //   return 'done';
    // }
    async SearchIngredients(searchTerm) {
        let ingredients = await ingredient_1.default.find({
            ingredientName: { $regex: searchTerm, $options: 'i' },
        }).populate({
            path: 'nutrients',
            populate: {
                path: 'uniqueNutrientRefference',
                model: 'UniqueNutrient',
            },
        });
        return ingredients;
    }
    // @Query(() => String)
    // async changeIngredientName() {
    //   let ingredients = await FoodSrcModel.find({});
    //   for (let i = 0; i < ingredients.length; i++) {
    //     await FoodSrcModel.findOneAndUpdate(
    //       { _id: ingredients[i]._id },
    //       { ingredientName: ingredients[i].description }
    //     );
    //   }
    //   return 'done';
    // }
    // @Query(() => [Ingredient])
    // async filterIngredientByCategoryAndClass(
    // @Arg('data') data: IngredientFilter
    // ) {
    //   let ingredients;
    //   if (data.ingredientCategory === 'All') {
    //     ingredients = await FoodSrcModel.find({
    //       classType: 'Class - ' + data.IngredientClass,
    //     }).populate({
    //       path: 'nutrients',
    //       populate: {
    //         path: 'uniqueNutrientRefference',
    //         model: 'UniqueNutrient',
    //       },
    //     });
    //   } else {
    //     ingredients = await FoodSrcModel.find({
    //       category: data.ingredientCategory,
    //       classType: 'Class - ' + data.IngredientClass,
    //     }).populate({
    //       path: 'nutrients',
    //       populate: {
    //         path: 'uniqueNutrientRefference',
    //         model: 'UniqueNutrient',
    //       },
    //     });
    //   }
    //   return ingredients;
    // }
    async getIngredientInfoBasedOnDefaultPortion(ingredientId) {
        let ingredient = await ingredient_1.default.findOne({
            _id: ingredientId,
        }).populate({
            path: 'nutrients',
            populate: {
                path: 'uniqueNutrientRefference',
                model: 'UniqueNutrient',
            },
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
        for (let i = 0; i < ingredient.nutrients.length; i++) {
            let nutrient = {
                value: (ingredient.nutrients[i].value / 100) * defaultPortion,
                uniqueNutrientRefference: ingredient.nutrients[i].uniqueNutrientRefference,
            };
            defaultPortionNutrients.push(nutrient);
        }
        let returnIngredientBasedOnDefaultPortion = ingredient;
        returnIngredientBasedOnDefaultPortion.defaultPortionNutrients =
            defaultPortionNutrients;
        return returnIngredientBasedOnDefaultPortion;
    }
    // @Query(() => String)
    // async getNutritionBasedOnRecipeTest() {
    //   let data = [
    //     {
    //       ingredientId: '61c6e4453a320071dc96ab1a',
    //       value: 12,
    //     },
    //     { ingredientId: '61c6e4453a320071dc96ab3e', value: 40 },
    //     { ingredientId: '61c6e4463a320071dc96ab87', value: 76 },
    //   ];
    //   let fake = data.map((x) => new mongoose.mongo.ObjectId(x.ingredientId));
    //   console.log(fake);
    //   let ingredients = await FoodSrcModel.aggregate([
    //     {
    //       $match: { _id: { $in: fake } },
    //     },
    //     {
    //       $unwind: '$nutrients',
    //     },
    //     {
    //       $addFields: {
    //         convertedValue: { $toDecimal: '$nutrients.value' },
    //       },
    //     },
    //     { $unwind: '$nutrients.uniqueNutrientRefference' },
    //     {
    //       $group: {
    //         _id: '$nutrients.uniqueNutrientRefference',
    //         num: { $sum: 1 },
    //         value: { $sum: '$convertedValue' },
    //       },
    //     },
    //   ]);
    //   let mynutrient = ingredients.filter((x) => {
    //     return String(x._id) === '61c618813ced314894f2924a';
    //   });
    //   let test = await FoodSrcModel.find({ _id: { $in: fake } });
    //   for (let i = 0; i < test.length; i++) {
    //     for (let j = 0; j < test[i].nutrients.length; j++) {
    //       if (
    //         String(test[i].nutrients[j].uniqueNutrientRefference) ===
    //         '61c618813ced314894f2924a'
    //       ) {
    //         console.log(test[i].ingredientName);
    //         console.log(test[i].nutrients[j].uniqueNutrientRefference);
    //         console.log(test[i].nutrients[j].value);
    //       }
    //     }
    //   }
    // let nutrients = await Promise.all(ingredients.map(async (x) => {
    //   let myIngredient = data.filter(y => y.ingredientId == x._id.toString())[0];
    //   let value = myIngredient.value;
    //   return {
    //     ingredientId: x._id,
    //     value: (x.nutrients.value / 100) * value,
    //     uniqueNutrientRefference: await UniqueNutrientModel.findOne({
    //       _id: x.nutrients.uniqueNutrientRefference,
    //     }),
    //   };
    // }));
    // console.log(nutrients);
    //   console.log(mynutrient);
    //   return 'done';
    // }
    async getNutritionBasedOnRecipe(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await ingredient_1.default.find({
            _id: { $in: hello },
        }).populate({
            path: 'nutrients',
            populate: {
                path: 'uniqueNutrientRefference',
                model: 'UniqueNutrient',
            },
        });
        for (let i = 0; i < ingredients.length; i++) {
            let value = data.filter(
            // @ts-ignore
            (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
            for (let j = 0; j < ingredients[i].nutrients.length; j++) {
                ingredients[i].nutrients[j].value =
                    (+ingredients[i].nutrients[j].value / 100) * value;
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
            nutrients.push(...ingredients[i].nutrients);
        }
        //@ts-ignore
        let returnNutrients = nutrients.reduce((acc, nutrient) => {
            //@ts-ignore
            let obj = acc.find(
            //@ts-ignore
            (o) => String(o.uniqueNutrientRefference._id) ===
                String(nutrient.uniqueNutrientRefference._id));
            if (!obj) {
                nutrient.count = 1;
                acc.push(nutrient);
            }
            else {
                //@ts-ignore
                const index = acc.findIndex((element, index) => {
                    if (String(element.uniqueNutrientRefference._id) ===
                        String(obj.uniqueNutrientRefference._id)) {
                        return true;
                    }
                });
                acc[index].count++;
                acc[index].value = +acc[index].value + +nutrient.value;
                if (String(acc[index].uniqueNutrientRefference._id) ===
                    '61c618813ced314894f2924a') {
                    console.log(acc[index].value);
                }
            }
            return acc;
        }, []);
        let mappedReturnData = [];
        for (let p = 0; p < returnNutrients.length; p++) {
            let mapto = await mapToBlend_1.default.findOne({
                srcUniqueNutrientId: returnNutrients[p].uniqueNutrientRefference._id,
            });
            if (!mapto) {
                continue;
            }
            let blendData = await blendNutrient_1.default.findOne({
                _id: mapto.blendNutrientId,
            })
                .populate('category')
                .populate('parent');
            returnNutrients[p].blendData = blendData;
            mappedReturnData.push(returnNutrients[p]);
        }
        return mappedReturnData;
    }
    async removeIngredient(ingredientId) {
        let ingredient = await ingredient_1.default.findOne({ _id: ingredientId });
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let recycle = await RecycledIngredient_1.default.find();
        if (!recycle) {
            recycle = await RecycledIngredient_1.default.create({});
            await RecycledIngredient_1.default.findOneAndUpdate({ _id: recycle._id }, { $push: { refDtabaseIngredientId: ingredient.refDatabaseId } });
        }
        else {
            await RecycledIngredient_1.default.findOneAndUpdate({ _id: recycle[0]._id }, { $push: { refDtabaseIngredientId: ingredient.refDatabaseId } });
        }
        await ingredient_1.default.findOneAndDelete({ _id: ingredientId });
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnIngredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllTheIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UniqueNutrient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getALlUniqueNutrientList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Ingredient_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createIngredient_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createNewIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => Ingredient_1.default),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "gerASingleIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => UniqueNutrient_1.default),
    __param(0, (0, type_graphql_1.Arg)('nutrientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAUniqueNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditNutrient_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editUniqueNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendIngredient_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "EditIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "storeAllUniqueNutrient", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Ingredient_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "SearchIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReurnIngredientBasedOnDefaultPortion_1.default),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getIngredientInfoBasedOnDefaultPortion", null);
__decorate([
    (0, type_graphql_1.Query)(() => [NutrientValue_1.default]) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [IngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getNutritionBasedOnRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "removeIngredient", null);
MemberResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberResolver);
exports.default = MemberResolver;
// {
//   "refDatabaseId": "",
//   "ingredientName": "Abiyuch",
//   "id": "",
//   "category": "",
//   "blendStatus": "Review",
//   "classType": "",
//   "source": "usda-legacy",
//   "description": "Abiyuch, raw",
//   "sourceId": "9427",
//   "sourceCategory": "Abiyuch, raw",
//   "publication_date": "2019-04-01",
//   "nutrients": [
//       {
//           "nutrient": "Vitamin A, IU",
//           "category": "",
//           "value": "100",
//           "id": String,
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
//   "portions": [
//       {
//           "measurement": "0.5 undetermined",
//           "measuredWeight": "114 gm",
//           "refDatabaseId": "",
//       }
//   ],
//   "featuredImage": "",
//   "images": [
//       "/images/product-img.jpg",
//       "/images/user-img.jpg"
//   ]
// }
// you
// 2
// me ()
// 3
