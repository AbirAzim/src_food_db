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
const BlendIngredientInfo_1 = __importDefault(require("../../blendIngredientsdata/resolvers/input-type/BlendIngredientInfo"));
const GetIngredientsFromNutrition_1 = __importDefault(require("./input-type/GetIngredientsFromNutrition"));
const EditIngredientAndNutrientWiki_1 = __importDefault(require("./input-type/EditIngredientAndNutrientWiki"));
const Wikilist_1 = __importDefault(require("../schemas/Wikilist"));
const IngredientsFromNutrition_1 = __importDefault(require("../schemas/IngredientsFromNutrition"));
const NutrientsFromIngredient_1 = __importDefault(require("../schemas/NutrientsFromIngredient"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
let WikiResolver = class WikiResolver {
    async getWikiList() {
        let returnData = [];
        let blendNutrients = await blendNutrient_1.default.find()
            .populate('category')
            .select('-__v -uniqueNutrientId -related_sources -parent');
        for (let i = 0; i < blendNutrients.length; i++) {
            let data = {
                _id: blendNutrients[i]._id,
                title: blendNutrients[i].nutrientName,
                type: 'Nutrient',
                category: blendNutrients[i].category.categoryName,
                status: blendNutrients[i].status,
                publishDate: new Date(),
                description: '',
                image: '',
                publishedBy: 'g. braun',
            };
            if (!data.title) {
                console.log(data);
            }
            returnData.push(data);
        }
        let blendIngredients = await blendIngredient_1.default.find();
        for (let i = 0; i < blendIngredients.length; i++) {
            let data = {
                _id: blendIngredients[i]._id,
                title: blendIngredients[i].ingredientName,
                type: 'Ingredient',
                category: blendIngredients[i].category,
                status: blendIngredients[i].blendStatus,
                publishDate: blendIngredients[i].createdAt,
                image: blendIngredients[i].featuredImage,
                description: blendIngredients[i].description,
                publishedBy: 'g. braun',
            };
            if (!data.title) {
                console.log(data);
            }
            returnData.push(data);
        }
        return returnData;
        // {
        //   title: '',
        //   type: '',
        //   category: '',
        //   status: '',
        //   publishDate: Date.now(),
        //   publishedBy: Strig,
        // }
    }
    async getBlendNutritionBasedIngredientsWiki(ingredientsInfo) {
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
            returnNutrients[j].blendNutrientRefference.category =
                await blendNutrientCategory_1.default.findOne({
                    _id: returnNutrients[j].blendNutrientRefference.category,
                });
            returnNutrients[j].blendNutrientRefference.parent =
                returnNutrients[j].blendNutrientRefference.parent === null
                    ? null
                    : await blendNutrient_1.default.findOne({
                        _id: returnNutrients[j].blendNutrientRefference.parent,
                    });
        }
        let res = await this.architect(returnNutrients);
        console.log(res);
        let a = JSON.stringify(res);
        let returnData = {
            wikiCoverImages: ingredients[0].wikiCoverImages,
            wikiFeatureImage: ingredients[0].wikiFeatureImage,
            bodies: ingredients[0].bodies,
            nutrients: a,
        };
        return returnData;
    }
    async architect(arr) {
        let data = {};
        arr.forEach((item) => {
            var _a;
            const name = (_a = item.blendNutrientRefference.nutrientName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            data[name] = {
                value: item.value,
                blendNutrientRefference: item.blendNutrientRefference,
            };
        });
        let carbohydrates = {
            ...data.carbohydrate,
            dietryFibre: {
                ...data['dietary fiber'],
                childs: {
                    fiberSoluable: data['Fiber, soluble'],
                    fiberInsoluble: data['Fiber, insoluble'],
                },
            },
            sugars: {
                ...data.sugars,
                childs: {
                    sucrose: data.sucrose,
                    glucose: data.glucose,
                    fructose: data.fructose,
                    lactose: data.lactose,
                    maltose: data.maltose,
                    galactose: data.galactose,
                },
            },
            starch: data.starch,
        };
        let energy = {
            childs: {
                protien: data.protein,
                fats: data.fats,
                carbohydrates,
            },
        };
        let vitamins = {
            childs: {
                vitaminC: data['vitamin c'],
                thiamin: data.thiamin,
                riboflavin: data.riboflavin,
                niacin: data.niacin,
                pantothenicAcid: data['pantothenic acid'],
                vitaminB6: data['vitamin b-6'],
                biotin: data.biotin,
                folate: data.folate,
                choline: data.choline,
                betaine: data.betaine,
                vitaminB12: data['vitamin b-12'],
                vitaminA: data['vitamin a'],
                vitaminE: data['vitamin e'],
                vitaminD: data['vitamin d'],
                vitaminK: data['vitamin k'],
            },
        };
        let calories = data.calorie;
        let minerals = {
            childs: {
                calcium: data.calcium,
                iron: data.iron,
                magnesium: data.magnesium,
                phosphorus: data.phosphorus,
                potassium: data.potassium,
                sodium: data.sodium,
                zinc: data.zinc,
                copper: data.copper,
                manganese: data.manganese,
                iodine: data.iodine,
                salenium: data.salenium,
                sulfur: data.sulfur,
                nickel: data.nickel,
                molybdenum: data.molybdenum,
                colbalt: data.colbalt,
                boron: data.boron,
                fluoride: data.fluoride,
            },
        };
        return { calories, energy, vitamins, minerals };
    }
    async getAllIngredientsBasedOnNutrition(data) {
        let nutrient = await blendNutrient_1.default.findOne({ _id: data.nutritionID });
        let ingredients;
        if (data.category === 'All') {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
            }).select('-srcFoodReference -description -classType -blendStatus -category -sourceName -portions -notBlendNutrients');
        }
        else {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
                category: data.category,
            }).select('-srcFoodReference -description -classType -blendStatus -category -sourceName -portions -notBlendNutrients');
        }
        console.log(ingredients.length);
        let returnIngredients = {};
        for (let i = 0; i < ingredients.length; i++) {
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                if (String(ingredients[i].blendNutrients[j].blendNutrientRefference) ===
                    data.nutritionID) {
                    if (!returnIngredients[ingredients[i].ingredientName]) {
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseInt(ingredients[i].blendNutrients[j].value),
                        };
                    }
                    else {
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseInt(returnIngredients[ingredients[i].ingredientName].value) + parseInt(ingredients[i].blendNutrients[j].value),
                        };
                    }
                }
            }
        }
        let sortArray = [];
        Object.keys(returnIngredients).forEach((key) => {
            sortArray.push(returnIngredients[key]);
        });
        //@ts-ignore
        let result = sortArray.sort((a, b) => {
            return b.value - a.value;
        });
        let returnData = {
            wikiCoverImages: nutrient.wikiCoverImages,
            wikiFeatureImage: nutrient.wikiFeatureImage,
            bodies: nutrient.bodies,
            ingredients: result.slice(0, 10),
        };
        return returnData;
    }
    async editIngredientWiki(data) {
        await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editNutrientWiki(data) {
        await blendNutrient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Wikilist_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiList", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientsFromIngredient_1.default) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getBlendNutritionBasedIngredientsWiki", null);
__decorate([
    (0, type_graphql_1.Query)(() => IngredientsFromNutrition_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetIngredientsFromNutrition_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getAllIngredientsBasedOnNutrition", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editIngredientWiki", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editNutrientWiki", null);
WikiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiResolver);
exports.default = WikiResolver;