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
const recipe_1 = __importDefault(require("../../../models/recipe"));
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
const CreateRecipe_1 = __importDefault(require("./input-type/CreateRecipe"));
const EditRecipe_1 = __importDefault(require("./input-type/EditRecipe"));
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
    async getAllRecipes() {
        const recipes = await recipe_1.default.find().populate('ingredients');
        return recipes;
    }
    async getARecipe(recipeId) {
        const recipe = await recipe_1.default.findById(recipeId).populate('ingredients');
        return recipe;
    }
    async addNewRecipe(data) {
        const newRecipe = await recipe_1.default.create(data);
        return 'new recipe created successfully';
    }
    async editARecipe(data) {
        await recipe_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'recipe updated successfully';
    }
    async deleteARecipe(recipeId) {
        await recipe_1.default.findOneAndDelete({ _id: recipeId });
        return 'recipe deleted successfully';
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipes", null);
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
RecipeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeResolver);
exports.default = RecipeResolver;
