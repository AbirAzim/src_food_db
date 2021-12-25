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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const uniqueNutrient_1 = __importDefault(require("../../../models/uniqueNutrient"));
const Ingredient_1 = __importDefault(require("../schemas/Ingredient"));
const fs_1 = __importDefault(require("fs"));
let MemberResolver = class MemberResolver {
    async getAllTheIngredients() {
        let ingredients = await ingredient_1.default.find({});
        return ingredients;
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
                    let newNutrient = {
                        nutrient: foods[i].nutrients[j].nutrientDescription.name,
                        category: '',
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
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Ingredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllTheIngredients", null);
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
