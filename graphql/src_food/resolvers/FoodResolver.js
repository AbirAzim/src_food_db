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
const EditIngredients_1 = __importDefault(require("./input-type/EditIngredients"));
const EditNutrient_1 = __importDefault(require("./input-type/EditNutrient"));
const createIngredient_1 = __importDefault(require("./input-type/createIngredient"));
const Ingredient_1 = __importDefault(require("../schemas/Ingredient"));
const ReturnIngredient_1 = __importDefault(require("../schemas/ReturnIngredient"));
const UniqueNutrient_1 = __importDefault(require("../schemas/UniqueNutrient"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const fs_1 = __importDefault(require("fs"));
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
        if (data.editableObject.defaultPortion === '') {
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
                    newPortions.push(newData.portions[i]);
                }
            }
            newData.portions = newPortions;
            await ingredient_1.default.findOneAndUpdate({ _id: data.editId }, newData);
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
    async databaseShifting() {
        let foods = fs_1.default.readFileSync('./temp/food.json', 'utf-8');
        foods = JSON.parse(foods);
        for (let i = 0; i < foods.length; i++) {
            let findFood = await ingredient_1.default.findOne({
                refDatabaseId: foods[i]._id,
            });
            if (!findFood) {
                let food = {
                    nutrients: [],
                    portions: [],
                    refDatabaseId: foods[i]._id,
                    ingredientName: foods[i].name,
                    ingredientId: '',
                    category: '',
                    blendStatus: 'Review',
                    classType: '',
                    source: foods[i].data_type,
                    description: foods[i].description,
                    sourceId: foods[i].NDB_number
                        ? foods[i].NDB_number
                        : foods[i].foodCode,
                    sourceCategory: foods[i].categoryId.description,
                    publication_date: foods[i].publication_date,
                };
                for (let j = 0; j < foods[i].nutrients.length; j++) {
                    let newNutrient = {
                        value: foods[i].nutrients[j].amount,
                        sourceId: foods[i].nutrients[j].id,
                        uniqueNutrientRefference: foods[i].nutrients[j].nutrientDescription._id,
                    };
                    food.nutrients.push(newNutrient);
                }
                for (let k = 0; k < foods[i].portions.length; k++) {
                    let newPortion = {
                        measurement: foods[i].portions[k].modifier,
                        measurement2: foods[i].portions[k].measureUnitName,
                        meausermentWeight: foods[i].portions[k].gram_weight,
                        sourceId: foods[i].portions[k].id,
                    };
                    //@ts-ignore
                    food.portions.push(newPortion);
                }
                await ingredient_1.default.create(food);
            }
        }
        return 'done';
    }
    async deleteFood() {
        await uniqueNutrient_1.default.deleteMany({});
        await ingredient_1.default.deleteMany({});
        return 'done';
    }
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
    async changeIngredientName() {
        let ingredients = await ingredient_1.default.find({});
        for (let i = 0; i < ingredients.length; i++) {
            await ingredient_1.default.findOneAndUpdate({ _id: ingredients[i]._id }, { ingredientName: ingredients[i].description });
        }
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
    __metadata("design:paramtypes", [EditIngredients_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "EditIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "storeAllUniqueNutrient", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "databaseShifting", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "deleteFood", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Ingredient_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "SearchIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "changeIngredientName", null);
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
