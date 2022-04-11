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
const GramConversion_1 = __importDefault(require("./input-type/GramConversion"));
let WikiResolver = class WikiResolver {
    async getWikiList() {
        let returnData = [];
        let blendNutrients = await blendNutrient_1.default.find()
            .populate('category')
            .lean()
            .select('-uniqueNutrientId -related_sources -parent -bodies -wikiCoverImages');
        for (let i = 0; i < blendNutrients.length; i++) {
            let categoryName;
            if (!blendNutrients[i].category) {
                categoryName = null;
            }
            else {
                categoryName = blendNutrients[i].category.categoryName
                    ? blendNutrients[i].category.categoryName
                    : '';
            }
            let data = {
                _id: blendNutrients[i]._id,
                wikiTitle: blendNutrients[i].wikiTitle
                    ? blendNutrients[i].wikiTitle
                    : blendNutrients[i].nutrientName,
                wikiDescription: blendNutrients[i].wikiDescription
                    ? blendNutrients[i].wikiDescription
                    : ' ',
                type: 'Nutrient',
                category: categoryName,
                status: blendNutrients[i].status,
                publishDate: new Date(),
                description: '',
                image: '',
                publishedBy: 'g. braun',
                isPublished: blendNutrients[i].isPublished,
            };
            // if (!data.category) {
            //   console.log('n', data._id);
            //   continue;
            // }
            returnData.push(data);
        }
        let blendIngredients = await blendIngredient_1.default.find()
            .select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished')
            .lean();
        for (let i = 0; i < blendIngredients.length; i++) {
            let data = {
                _id: blendIngredients[i]._id,
                wikiTitle: blendIngredients[i].wikiTitle
                    ? blendIngredients[i].wikiTitle
                    : blendIngredients[i].ingredientName,
                wikiDescription: blendIngredients[i].wikiDescription
                    ? blendIngredients[i].wikiDescription
                    : ' ',
                type: 'Ingredient',
                category: blendIngredients[i].category
                    ? blendIngredients[i].category
                    : '',
                status: blendIngredients[i].blendStatus,
                publishDate: blendIngredients[i].createdAt,
                portions: blendIngredients[i].portions,
                image: blendIngredients[i].featuredImage,
                description: blendIngredients[i].description,
                publishedBy: 'g. braun',
                isPublished: blendIngredients[i].isPublished,
            };
            // if (!data.category) {
            //   console.log('i', data._id);
            //   continue;
            // }
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
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientsInfo[0].ingredientId,
        });
        let res = await this.getBlendNutritionBasedOnRecipexxx2([
            {
                ingredientId: ingredientsInfo[0].ingredientId,
                value: ingredientsInfo[0].value,
            },
        ]);
        // console.log(ingredients[0].wikiTitle)
        // console.log(ingredients[0].wikiDescription)
        let returnData = {
            wikiTitle: ingredient.wikiTitle,
            wikiDescription: ingredient.wikiDescription,
            ingredientName: ingredient.ingredientName,
            wikiCoverImages: ingredient.wikiCoverImages,
            wikiFeatureImage: ingredient.wikiFeatureImage,
            bodies: ingredient.bodies,
            nutrients: res,
            type: 'Ingredient',
            category: ingredient.category ? ingredient.category : '',
            publishedBy: 'g. Braun',
            seoTitle: ingredient.seoTitle,
            seoSlug: ingredient.seoSlug,
            seoCanonicalURL: ingredient.seoCanonicalURL,
            seoSiteMapPriority: ingredient.seoSiteMapPriority,
            seoKeywords: ingredient.seoKeywords,
            seoMetaDescription: ingredient.seoMetaDescription,
            isPublished: ingredient.isPublished,
        };
        return returnData;
    }
    async getAllIngredientsBasedOnNutrition(data) {
        let nutrient = await blendNutrient_1.default.findOne({
            _id: data.nutritionID,
        }).populate('category');
        let ingredients;
        if (data.category === 'All') {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
            })
                .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                .populate('blendNutrients.blendNutrientRefference');
        }
        else {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
                category: data.category,
            })
                .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                .populate('blendNutrients.blendNutrientRefference');
        }
        let returnIngredients = {};
        for (let i = 0; i < ingredients.length; i++) {
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                if (ingredients[i].blendNutrients[j].blendNutrientRefference === null)
                    continue;
                if (String(ingredients[i].blendNutrients[j].blendNutrientRefference._id) === data.nutritionID) {
                    if (!returnIngredients[ingredients[i].ingredientName]) {
                        // let value = await this.convertToGram({
                        //   amount: parseInt(ingredients[i].blendNutrients[j].value),
                        //   unit: ingredients[i].blendNutrients[j].blendNutrientRefference
                        //     .units,
                        // });
                        let defaultPortion = ingredients[i].portions.filter(
                        //@ts-ignore
                        (a) => a.default === true)[0];
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseFloat(ingredients[i].blendNutrients[j].value),
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
                            portion: defaultPortion,
                        };
                    }
                    else {
                        let defaultPortion = ingredients[i].portions.filter(
                        //@ts-ignore
                        (a) => a.default === true)[0];
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseFloat(returnIngredients[ingredients[i].ingredientName].value) + parseFloat(ingredients[i].blendNutrients[j].value),
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
                            portion: defaultPortion,
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
            wikiTitle: nutrient.wikiTitle,
            wikiDescription: nutrient.wikiDescription,
            nutrientName: nutrient.nutrientName,
            wikiCoverImages: nutrient.wikiCoverImages,
            wikiFeatureImage: nutrient.wikiFeatureImage,
            bodies: nutrient.bodies,
            ingredients: result.slice(0, 10),
            type: 'Nutrient',
            category: nutrient.category.categoryName,
            publishedBy: 'g. Braun',
            seoTitle: nutrient.seoTitle,
            seoSlug: nutrient.seoSlug,
            seoCanonicalURL: nutrient.seoCanonicalURL,
            seoSiteMapPriority: nutrient.seoSiteMapPriority,
            seoKeywords: nutrient.seoKeywords,
            seoMetaDescription: nutrient.seoMetaDescription,
            isPublished: nutrient.isPublished,
        };
        console.log(returnData);
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
    async convertToGram(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        console.log('data', data);
        if (data.unit === 'kJ') {
            gram = +data.amount * 238.90295761862;
            return gram;
        }
        if (data.unit === 'G') {
            return data.amount;
        }
        if (data.unit === 'MG') {
            gram = +data.amount * 0.001;
            return gram;
        }
        if (data.unit === 'UG') {
            gram = +data.amount * 0.000001;
            return gram;
        }
        if (data.unit === 'IU') {
            gram = +data.amount * 0.000001059322033898305;
            return gram;
        }
    }
    async convertGramToUnit(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        console.log('data', data);
        if (data.unit === 'kJ') {
            gram = +data.amount * 238.90295761862;
            return gram;
        }
        if (data.unit === 'G') {
            return data.amount;
        }
        if (data.unit === 'MG') {
            gram = +data.amount * 0.001;
            return gram;
        }
        if (data.unit === 'UG') {
            gram = +data.amount * 0.000001;
            return gram;
        }
        if (data.unit === 'IU') {
            gram = +data.amount * 0.000001059322033898305;
            return gram;
        }
    }
    async getDefaultPortion(ingredientId) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        });
        let defaultPortion = ingredient.portions.filter(
        //@ts-ignore
        (a) => a.default === true)[0];
        if (!defaultPortion) {
            defaultPortion = ingredient.portions[0];
        }
        return Number(defaultPortion.meausermentWeight);
    }
    async bodyTest() {
        let description = await blendIngredient_1.default.find({}).select('wikiCoverImages wikiFeatureImage wikiTitle wikiDescription bodies seoTitle seoSlug seoCanonicalURL seoSiteMapPriority seoKeywords seoMetaDescription sourceName isPublished');
        return JSON.stringify(description);
    }
    // have to fix this later
    // fixing this
    // warning
    async getBlendNutritionBasedOnRecipexxx2(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
            status: 'Active',
        })
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            select: '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
        })
            .lean();
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
        let blendNutrientCategories = await blendNutrientCategory_1.default.find()
            .lean()
            .select('_id categoryName');
        //returnNutrients
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
        }
        return JSON.stringify(obj);
    }
    async getChild(parent, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({ parent: parent })
            .lean()
            .select('_id nutrientName altName');
        if (childs.length === 0) {
            return null;
        }
        for (let i = 0; i < childs.length; i++) {
            let ek = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(childs[i]._id))[0];
            let check = childs[i].altName === '';
            let check2 = childs[i].altName === undefined;
            let check3 = check || check2;
            //  ||
            // populatedChild2[i].blendNutrientRefference.altName !== undefined ||
            // populatedChild2[i].blendNutrientRefference.altName !== null;
            let name = check3 ? childs[i].nutrientName : childs[i].altName;
            if (!ek) {
                obj[name.toLowerCase()] = null;
                continue;
            }
            childs[i] = ek;
            childs[i].childs = await this.getChild(childs[i].blendNutrientRefference._id, returnNutrients);
            let check4 = childs[i].blendNutrientRefference.altName === '';
            let check5 = childs[i].blendNutrientRefference.altName === undefined;
            let check6 = check4 || check5;
            //  ||
            // populatedChild2[i].blendNutrientRefference.altName !== undefined ||
            // populatedChild2[i].blendNutrientRefference.altName !== null;
            let name2 = check6
                ? childs[i].blendNutrientRefference.nutrientName
                : childs[i].blendNutrientRefference.altName;
            obj[name2.toLowerCase()] = childs[i];
        }
        return obj;
    }
    async getTopLevelChilds(category, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({
            category: category,
            parentIsCategory: true,
        })
            .lean()
            .select('_id');
        let populatedChild = childs.map((child) => {
            let data = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(child._id))[0];
            if (!data) {
                data = {
                    value: 0,
                    blendNutrientRefference: null,
                };
            }
            return data;
        });
        let populatedChild2 = populatedChild.filter(
        //@ts-ignore
        (child) => child.blendNutrientRefference !== null);
        for (let i = 0; i < populatedChild2.length; i++) {
            let check = populatedChild2[i].blendNutrientRefference.altName === '';
            let check2 = populatedChild2[i].blendNutrientRefference.altName === undefined;
            let check3 = check || check2;
            //  ||
            // populatedChild2[i].blendNutrientRefference.altName !== undefined ||
            // populatedChild2[i].blendNutrientRefference.altName !== null;
            let name = check3
                ? populatedChild2[i].blendNutrientRefference.nutrientName
                : populatedChild2[i].blendNutrientRefference.altName;
            obj[name.toLowerCase()] = populatedChild2[i];
            obj[name.toLowerCase()].childs = await this.getChild(populatedChild2[i].blendNutrientRefference._id, returnNutrients);
        }
        return obj;
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
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GramConversion_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "convertToGram", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GramConversion_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "convertGramToUnit", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getDefaultPortion", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "bodyTest", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getBlendNutritionBasedOnRecipexxx2", null);
WikiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiResolver);
exports.default = WikiResolver;
