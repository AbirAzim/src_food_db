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
const fs_1 = __importDefault(require("fs"));
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
const blendNutrientCategory_2 = __importDefault(require("../../../models/blendNutrientCategory"));
let BlendIngredientResolver = class BlendIngredientResolver {
    async getAllBlendIngredients() {
        let blendIngredients = await blendIngredient_1.default.find()
            .lean()
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished');
        return blendIngredients;
    }
    async getAllClassOneIngredients() {
        let blendIngredients = await blendIngredient_1.default.find({
            classType: 'Class - 1',
        })
            .lean()
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished');
        return blendIngredients;
    }
    async getALlBlendIngredients2() {
        // const allPlayers: any = [];
        let blendIngredients = await blendIngredient_1.default.find()
            .lean()
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished');
        return blendIngredients;
        // const cursor: any = await BlendIngredientModel.find()
        //   .lean()
        //   .select(
        //     '-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished'
        //   );
        // return cursor;
        // let nutrients: any = fs.readFileSync('./temp/nutrients.json', 'utf-8');
        // let ing = await BlendIngredientModel.findOne({_id: "620b6b8b40d3f19b558f0a15"})
        // fs.writeFileSync('./temp/testbaal.json', JSON.stringify(ing));
        // let ingredient = fs.readFileSync('./temp/testbaal.json', 'utf-8');
        // let ingredientData = JSON.parse(ingredient);
        // let data = await BlendIngredientModel.create(ingredientData);
        // data.save();
        // return [data];
        // cursor.on('data', function (player) {
        //   allPlayers.push(player);
        //   console.log(player);
        // });
        // cursor.on('end', function () {
        //   console.log('All players are loaded here');
        // });
        // console.log(allPlayers);
    }
    async EditIngredient(data) {
        let food = await blendIngredient_1.default.findOne({ _id: data.editId });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        // if (data.editableObject.blendStatus === 'Archived') {
        //   await FoodSrcModel.findByIdAndUpdate(food.srcFoodReference, {
        //     addedToBlend: false,
        //   });
        //   return 'Archieved Successfully';
        // }
        if (data.editableObject.blendStatus) {
            // await BlendIngredientModel.findByIdAndRemove(data.editId);
            await ingredient_1.default.findByIdAndUpdate(food.srcFoodReference, {
                addedToBlend: false,
                blendStatus: data.editableObject.blendStatus,
            });
            return 'Archieved Successfully';
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
            .populate('srcFoodReference')
            .populate({
            path: 'notBlendNutrients.uniqueNutrientRefference',
            model: 'UniqueNutrient',
        });
        return blendIngredient;
    }
    async removeBlendIngredientFromSrc(id) {
        let blendIngredient = await blendIngredient_1.default.findOne({
            srcFoodReference: id,
        });
        if (!blendIngredient) {
            return new AppError_1.default('This Ingredient not found in Blend Database', 404);
        }
        await blendIngredient_1.default.findOneAndRemove({ _id: blendIngredient._id });
        await ingredient_1.default.findByIdAndUpdate(id, {
            addedToBlend: false,
        });
        return 'Success';
    }
    async removeABlendIngredient(id) {
        let food = await blendIngredient_1.default.findOne({ _id: id });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        if (food.blendStatus !== 'Archived') {
            return new AppError_1.default('you can not remove Review or Active Ingredient', 404);
        }
        await ingredient_1.default.findByIdAndUpdate(food.srcFoodReference, {
            addedToBlend: false,
        });
        await blendIngredient_1.default.findOneAndRemove({ _id: id });
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
        let portions;
        if (srcFood.portions.length === 0) {
            portions = [
                {
                    measurement: 'cup',
                    measurement2: 'undetermined',
                    meausermentWeight: '100',
                    default: true,
                },
            ];
        }
        else {
            //@ts-ignore
            portions = srcFood.portions.map((portion) => {
                return {
                    measurement: portion.measurement,
                    measurement2: portion.measurement2,
                    meausermentWeight: portion.meausermentWeight,
                    default: false,
                };
            });
        }
        let newBlendIngredient = {
            ingredientName: srcFood.description,
            blendStatus: 'Review',
            classType: '',
            description: srcFood.description,
            srcFoodReference: srcFood._id,
            portions: portions,
        };
        if (srcFood.source === 'sr_legacy_food') {
            newBlendIngredient.sourceName = 'USDA-Legacy';
        }
        else if (srcFood.source === 'foundation_food') {
            newBlendIngredient.sourceName = 'survey_fndds_food';
        }
        else {
            newBlendIngredient.sourceName = 'USDA-survey';
        }
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
        await blendIngredient_1.default.create(newBlendIngredient);
        await ingredient_1.default.findByIdAndUpdate(srcId, { addedToBlend: true });
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
    async updateStatusInSrc() {
        let ingredients = await blendIngredient_1.default.find({});
        for (let i = 0; i < ingredients.length; i++) {
            await ingredient_1.default.findByIdAndUpdate(ingredients[i].srcFoodReference, {
                blendStatus: ingredients[i].blendStatus,
            });
        }
        return 'Updated successfully';
    }
    async updateStatusInSrc3() {
        await blendIngredient_1.default.updateMany({ blendStatus: 'Archieved' }, { blendStatus: 'Archived' });
        return 'Updated successfully';
    }
    async updateStatusInSrc2() {
        let ingredients = await blendIngredient_1.default.find({}).select('srcFoodReference -_id');
        let ids = [];
        for (let i = 0; i < ingredients.length; i++) {
            ids.push(String(ingredients[i].srcFoodReference));
        }
        console.log(ids);
        await ingredient_1.default.updateMany({ $nin: ids }, { blendStatus: 'Archived' });
        return 'Updated successfully';
    }
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
        // return returnNutrients;
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
        // console.log(returnNutrients[0]);
        let res = await this.architect(returnNutrients);
        console.log(res);
        let a = JSON.stringify(res);
        console.log(a);
        return a;
        // console.log(res);
        // let Calories = returnNutrients.filter(
        //   //@ts-ignore
        //   (rn) =>
        //     String(rn.blendNutrientRefference.category._id) ===
        //     '6203a9061c100bd226c13c65'
        // );
        // // console.log(Calories);
        // let Energy = returnNutrients.filter(
        //   //@ts-ignore
        //   (rn) =>
        //     String(rn.blendNutrientRefference.category._id) ===
        //     '6203a9381c100bd226c13c67'
        // );
        // let Vitamins = returnNutrients.filter(
        //   //@ts-ignore
        //   (rn) =>
        //     String(rn.blendNutrientRefference.category._id) ===
        //     '6203a96e1c100bd226c13c69'
        // );
        // let Minerals = returnNutrients.filter(
        //   //@ts-ignore
        //   (rn) =>
        //     String(rn.blendNutrientRefference.category._id) ===
        //     '6203a98a1c100bd226c13c6b'
        // );
        // return {
        //   Calories,
        //   Energy,
        //   Vitamins,
        //   Minerals,
        // };
    }
    async getBlendNutritionBasedOnRecipexxx(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
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
        let blendNutrientCategories = await blendNutrientCategory_2.default.find()
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
            .select('_id nutrientName');
        if (childs.length === 0) {
            return null;
        }
        for (let i = 0; i < childs.length; i++) {
            let ek = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(childs[i]._id))[0];
            if (!ek) {
                obj[childs[i].nutrientName] = null;
                continue;
            }
            childs[i] = ek;
            childs[i].childs = await this.getChild(childs[i].blendNutrientRefference._id, returnNutrients);
            obj[childs[i].blendNutrientRefference.nutrientName] = childs[i];
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
            obj[populatedChild2[i].blendNutrientRefference.nutrientName] =
                populatedChild2[i];
            obj[populatedChild2[i].blendNutrientRefference.nutrientName].childs =
                await this.getChild(populatedChild2[i].blendNutrientRefference._id, returnNutrients);
        }
        return obj;
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
        // const sugarChild = new Map();
        // sugarChild.set('sucrose', data.sucrose);
        // sugarChild.set('glucose', data.glucose);
        // sugarChild.set('fructose', data.fructose);
        // sugarChild.set('lactose', data.lactose);
        // sugarChild.set('maltose', data.maltose);
        // sugarChild.set('galactose', data.galactose);
        // console.log(sugarChild.get('sucrose'));
        // const vitamins = new Map();
        // vitamins.set('vitaminC', data['vitamin c']);
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
    async dsdsd() {
        let t = await blendIngredient_1.default.find(); //
        for (let i = 0; i < t.length; i++) {
            for (let j = 0; j < t[i].portions.length; j++) {
                if (t[i].portions[j].default === null) {
                    console.log(t[i]._id);
                    break;
                }
            }
        }
        return 'done';
    }
    async start() {
        let fpoot = await ingredient_1.default.find({ source: 'sr_legacy_food' }).select('-_id refDatabaseId');
        fs_1.default.writeFileSync('./temp/sx2.json', JSON.stringify(fpoot));
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllClassOneIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getALlBlendIngredients2", null);
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
], BlendIngredientResolver.prototype, "removeBlendIngredientFromSrc", null);
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
    (0, type_graphql_1.Mutation)(() => String),
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
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "updateStatusInSrc", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "updateStatusInSrc3", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "updateStatusInSrc2", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipe", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipexxx", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "dsdsd", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "start", null);
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
