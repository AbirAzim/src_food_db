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
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const recipeCategory_1 = __importDefault(require("../../../models/recipeCategory"));
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
const CreateRecipe_1 = __importDefault(require("./input-type/CreateRecipe"));
const EditRecipe_1 = __importDefault(require("./input-type/EditRecipe"));
const GetAllRecipesByBlendCategory_1 = __importDefault(require("./input-type/GetAllRecipesByBlendCategory"));
let RecipeResolver = class RecipeResolver {
    // @Query((type) => String)
    // async test() {
    //   let recipes = fs.readFileSync('./temp/recipes.json', 'utf-8');
    //   recipes = JSON.parse(recipes);
    //   for (let i = 1; i < recipes.length; i++) {
    //     await RecipeModel.create(recipes[i]);
    //   }
    //   return 'Recipe Created';
    // }
    // fixing
    async getAllRecipesByBlendCategory(data) {
        // let user = await MemberModel.findOne({ _id: data.userId }).populate({
        //   path: 'collections',
        //   populate: {
        //     path: 'recipes',
        //     model: 'Recipe',
        //   },
        // });
        // //@ts-ignore
        // let memberRecipes = user.collections.map((collection) => {
        //   return collection.recipes;
        // });
        // console.log(memberRecipes);
        let recipes;
        //@ts-ignore
        if (data.includeIngredientIds.length > 0) {
            recipes = await recipe_1.default.find({
                tempBlendCategory: { $in: data.blendTypes },
                'ingredients.ingredientId': { $in: data.includeIngredientIds },
            });
        }
        else {
            recipes = await recipe_1.default.find({
                tempBlendCategory: { $in: data.blendTypes },
            });
        }
        return recipes;
    }
    async getAllRecipes() {
        const recipes = await recipe_1.default.find()
            .populate('ingredients')
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipes;
        5;
    }
    async getAllrecomendedRecipes() {
        const recipes = await recipe_1.default.find()
            .populate('ingredients')
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipes;
    }
    async getAllpopularRecipes() {
        const recipes = await recipe_1.default.find()
            .limit(4)
            .populate('ingredients')
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipes;
    }
    async getAllLatestRecipes() {
        const recipes = await recipe_1.default.find()
            .sort({ datePublished: -1 })
            .populate('ingredients')
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipes;
    }
    async getARecipe(recipeId) {
        const recipe = await recipe_1.default.findById(recipeId)
            .populate('ingredients')
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipe;
    }
    async addNewRecipe(data) {
        const newRecipe = await recipe_1.default.create(data);
        return 'new recipe created successfully';
    }
    // @Mutation(() => String)
    // async storeAllBrands() {
    //   let recipes = await RecipeModel.find();
    //   for (let i = 0; i < recipes.length; i++) {
    //     let url = recipes[i].url;
    //     let brand = await BrandModel.findOne({ brandUrl: url });
    //     if (!brand) {
    //       let brandNameFromUrl = new URL(url).hostname;
    //       brandNameFromUrl = brandNameFromUrl.replace(/^www\./, '');
    //       brandNameFromUrl = brandNameFromUrl.replace(/\.com$/, '');
    //       let newBrand = {
    //         brandName: brandNameFromUrl,
    //         brandUrl: url,
    //         brandIcon: recipes[i].favicon,
    //       };
    //       await BrandModel.create(newBrand);
    //       console.log(newBrand);
    //     }
    //   }
    //   return true;
    // }
    async addTestIngredient() {
        let recipes = await recipe_1.default.find();
        for (let i = 0; i < recipes.length; i++) {
            console.log('step 1');
            let ingredients = recipes[i].recipeIngredients;
            for (let j = 0; j < ingredients.length; j++) {
                console.log('step 2');
                let ingredient = ingredients[j].split(' ');
                var first = ingredient.shift();
                var second = ingredient.shift();
                var third = ingredient.length ? ingredient.join(' ') : undefined;
                let newIngredient = {
                    quantity: first,
                    unit: second,
                    name: third,
                };
                await recipe_1.default.findOneAndUpdate({ _id: recipes[i]._id }, { $push: { testIngredient: newIngredient } });
            }
        }
        return 'done';
    }
    async editARecipe(data) {
        let updatedData = data.editableObject;
        let recipeBlendCategory = await recipeCategory_1.default.findOne({
            _id: data.editableObject.recipeBlendCategory,
        });
        updatedData.tempBlendCategory = recipeBlendCategory.name;
        await recipe_1.default.findOneAndUpdate({ _id: data.editId }, updatedData);
        return 'recipe updated successfully';
    }
    async deleteARecipe(recipeId) {
        await recipe_1.default.findOneAndDelete({ _id: recipeId });
        return 'recipe deleted successfully';
    }
    async addRecipeRecipeFromUser(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let userDefaultCollection = user.lastModifiedCollection
            ? user.defaultCollection
            : user.lastModifiedCollection;
        // let collection = await UserCollectionModel.findOne({
        //   _id: userDefaultCollection,
        // });
        let newData = data;
        newData.foodCategories = [];
        for (let i = 0; i < newData.ingredients.length; i++) {
            newData.ingredients[i].portions = [];
            let ingredient = await ingredient_1.default.findOne({
                _id: newData.ingredients[i].ingredientId,
            });
            let index = 0;
            let selectedPortionIndex = 0;
            for (let j = 0; j < ingredient.portions.length; j++) {
                if (ingredient.portions[j].default === true) {
                    index = j;
                    console.log(index);
                    break;
                }
            }
            for (let k = 0; k < ingredient.portions.length; k++) {
                if (ingredient.portions[k].measurement ===
                    newData.ingredients[i].selectedPortionName) {
                    selectedPortionIndex = k;
                }
                let portion = {
                    name: ingredient.portions[k].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[k].meausermentWeight,
                    default: ingredient.portions[k].default,
                    gram: ingredient.portions[k].meausermentWeight,
                };
                newData.ingredients[i].portions.push(portion);
            }
            newData.ingredients[i].selectedPortion = {
                name: ingredient.portions[selectedPortionIndex].measurement,
                quantity: newData.ingredients[i].weightInGram /
                    +ingredient.portions[selectedPortionIndex].meausermentWeight,
                gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
            };
            newData.foodCategories.push(ingredient.category);
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        newData.userId = user._id;
        let userRecipe = await recipe_1.default.create(newData);
        await userCollection_1.default.findOneAndUpdate({ _id: userDefaultCollection }, { $push: { recipes: userRecipe._id } });
        return newData;
    }
    async addRecipeFromUser(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let userDefaultCollection = user.lastModifiedCollection
            ? user.defaultCollection
            : user.lastModifiedCollection;
        // let collection = await UserCollectionModel.findOne({
        //   _id: userDefaultCollection,
        // });
        let newData = data;
        newData.foodCategories = [];
        for (let i = 0; i < newData.ingredients.length; i++) {
            newData.ingredients[i].portions = [];
            let ingredient = await blendIngredient_1.default.findOne({
                _id: newData.ingredients[i].ingredientId,
            });
            let index = 0;
            let selectedPortionIndex = 0;
            for (let j = 0; j < ingredient.portions.length; j++) {
                if (ingredient.portions[j].default === true) {
                    index = j;
                    console.log(index);
                    break;
                }
            }
            for (let k = 0; k < ingredient.portions.length; k++) {
                if (ingredient.portions[k].measurement ===
                    newData.ingredients[i].selectedPortionName) {
                    selectedPortionIndex = k;
                }
                let portion = {
                    name: ingredient.portions[k].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[k].meausermentWeight,
                    default: ingredient.portions[k].default,
                    gram: ingredient.portions[k].meausermentWeight,
                };
                newData.ingredients[i].portions.push(portion);
            }
            newData.ingredients[i].selectedPortion = {
                name: ingredient.portions[selectedPortionIndex].measurement,
                quantity: newData.ingredients[i].weightInGram /
                    +ingredient.portions[selectedPortionIndex].meausermentWeight,
                gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
            };
            newData.foodCategories.push(ingredient.category);
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        newData.userId = user._id;
        let userRecipe = await recipe_1.default.create(newData);
        await userCollection_1.default.findOneAndUpdate({ _id: userDefaultCollection }, { $push: { recipes: userRecipe._id } });
        return newData;
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]) // not sure yet
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllRecipesByBlendCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipesByBlendCategory", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllrecomendedRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllpopularRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllLatestRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Recipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addNewRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addTestIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "editARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "deleteARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => Recipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addRecipeRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => Recipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addRecipeFromUser", null);
RecipeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeResolver);
exports.default = RecipeResolver;
