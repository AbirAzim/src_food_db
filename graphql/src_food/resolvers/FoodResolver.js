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
const nutrient_1 = __importDefault(require("../../../models/nutrient"));
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const portion_1 = __importDefault(require("../../../models/portion"));
const Ingredient_1 = __importDefault(require("../schemas/Ingredient"));
const Nutrient_1 = __importDefault(require("../schemas/Nutrient"));
const Portion_1 = __importDefault(require("../schemas/Portion"));
const IngredientWithImagesAndNutrientCount_1 = __importDefault(require("../schemas/IngredientWithImagesAndNutrientCount"));
const AddPortionToAIngredient_1 = __importDefault(require("./input-type/AddPortionToAIngredient"));
const AddNutrientToAIngredient_1 = __importDefault(require("./input-type/AddNutrientToAIngredient"));
const EditIngredients_1 = __importDefault(require("./input-type/EditIngredients"));
const fs_1 = __importDefault(require("fs"));
let MemberResolver = class MemberResolver {
    async getAllTheIngredients() {
        let foods = await ingredient_1.default.find();
        let returnFoods = [];
        for (let i = 0; i < foods.length; i++) {
            returnFoods[i] = foods[i];
            returnFoods[i].nutrientsCount = foods[i].nutrients.length;
            returnFoods[i].portionsCount = foods[i].portions.length;
            returnFoods[i].imagesCount = foods[i].images.length;
        }
        return returnFoods;
    }
    async getAllTheNutrients() {
        let nutrients = await nutrient_1.default.find();
        return nutrients;
    }
    async getAllThePortions() {
        let portions = await portion_1.default.find();
        return portions;
    }
    async getAllTheNutrientsAndPortionsByFoodId(foodId) {
        let food = await ingredient_1.default.findOne({
            _id: foodId,
        })
            .populate('nutrients')
            .populate('portions');
        return food;
    }
    async getASingleNutrient(nutrientId) {
        let nutrient = await nutrient_1.default.findOne({
            _id: nutrientId,
        });
        return nutrient;
    }
    async getASinglePortions(portionId) {
        let portion = await portion_1.default.findOne({
            _id: portionId,
        });
        return portion;
    }
    async getIngredientsByName(ingredientName) {
        var regexp = new RegExp(`[a-zA-Z0-9\s]*${ingredientName}[a-zA-Z0-9\s]*`, 'i');
        const items = await ingredient_1.default.find({
            ingredientName: regexp,
        })
            .populate('nutrients')
            .populate('portions');
        return items;
    }
    async addPortionToAIngredient(data) {
        let newPortion = await portion_1.default.create(data.portionData);
        await ingredient_1.default.findOneAndUpdate({ _id: data.ingredientId }, { $push: { portions: newPortion._id } });
        return newPortion;
    }
    async editIngredient(data) {
        let food = await ingredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Successfully edited';
    }
    async addNutrientToAIngredient(data) {
        let newNutrient = await nutrient_1.default.create(data.nutrientData);
        await ingredient_1.default.findOneAndUpdate({ _id: data.ingredientId }, { $push: { nutrients: newNutrient._id } });
        return newNutrient;
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
                    id: '',
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
                    let nutrient = foods[i].nutrients[j];
                    let findNutrient = await nutrient_1.default.findOne({
                        refDatabaseId: foods[i].nutrients[j]._id,
                    });
                    if (!findNutrient) {
                        let newNutrient = {
                            refDatabaseId: foods[i].nutrients[j]._id,
                            nutrient: foods[i].nutrients[j].nutrientDescription.name,
                            category: '',
                            value: foods[i].nutrients[j].amount,
                            id: '',
                            unitName: '',
                            min: foods[i].nutrients[j].min,
                            rank: foods[i].nutrients[j].nutrientDescription.rank,
                            publication_date: '',
                        };
                        let nutrient = await nutrient_1.default.create(newNutrient);
                        food.nutrients.push(nutrient._id);
                    }
                    else {
                        food.nutrients.push(findNutrient._id);
                    }
                }
                for (let k = 0; k < foods[i].portions.length; k++) {
                    let findPortion = await portion_1.default.findOne({
                        refDatabaseId: foods[i].portions[k]._id,
                    });
                    if (!findPortion) {
                        let newPortion = {
                            measurement: foods[i].portions[k].modifier,
                            measurement2: foods[i].portions[k].measureUnitName,
                            meausermentWeight: foods[i].portions[k].gram_weight,
                            refDatabaseId: foods[i].portions[k]._id,
                        };
                        let portion = await portion_1.default.create(newPortion);
                        food.portions.push(portion._id);
                    }
                    else {
                        food.portions.push(findPortion._id);
                    }
                }
                await ingredient_1.default.create(food);
            }
        }
        return 'done';
    }
    async deleteFood() {
        await ingredient_1.default.deleteMany({});
        await nutrient_1.default.deleteMany({});
        await portion_1.default.deleteMany({});
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [IngredientWithImagesAndNutrientCount_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllTheIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Nutrient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllTheNutrients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Portion_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllThePortions", null);
__decorate([
    (0, type_graphql_1.Query)(() => Ingredient_1.default),
    __param(0, (0, type_graphql_1.Arg)('foodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllTheNutrientsAndPortionsByFoodId", null);
__decorate([
    (0, type_graphql_1.Query)(() => Nutrient_1.default),
    __param(0, (0, type_graphql_1.Arg)('nutrientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASingleNutrient", null);
__decorate([
    (0, type_graphql_1.Query)(() => Portion_1.default),
    __param(0, (0, type_graphql_1.Arg)('portionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASinglePortions", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Ingredient_1.default]),
    __param(0, (0, type_graphql_1.Arg)('ingredientName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getIngredientsByName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Portion_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddPortionToAIngredient_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "addPortionToAIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredients_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Nutrient_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNutrientToAIngredient_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "addNutrientToAIngredient", null);
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
