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
const recipe_1 = __importDefault(require("../../../models/recipe"));
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
let RecipeResolver = class RecipeResolver {
    // @Query((type) => String)
    // async test() {
    //   let recipe = {
    //     image: [
    //       {
    //         image:
    //           'https://www.whiskaffair.com/wp-content/uploads/2020/03/Lemon-Tea-4.jpg',
    //         default: true,
    //       },
    //       {
    //         image:
    //           'https://www.whiskaffair.com/wp-content/uploads/2020/03/Lemon-Tea-4-500x500.jpg',
    //         default: false,
    //       },
    //       {
    //         image:
    //           'https://www.whiskaffair.com/wp-content/uploads/2020/03/Lemon-Tea-4-500x375.jpg',
    //         default: false,
    //       },
    //       {
    //         image:
    //           'https://www.whiskaffair.com/wp-content/uploads/2020/03/Lemon-Tea-4-480x270.jpg',
    //         default: false,
    //       },
    //     ],
    //     recipeInstructions: [
    //       'Heat water in a pan.',
    //       'Once the water comes to a boil, simmer the heat.',
    //       'Add tea leaves and let them steep for a minute.',
    //       'Strain the tea in serving cups.',
    //       'Add lemon juice and honey and stir well.',
    //       'Serve immediately.',
    //     ],
    //     name: 'Lemon Tea Recipe',
    //     prepTime: '5 minutes',
    //     cookTime: '5 minutes',
    //     totalTime: '10 minutes',
    //     recipeYield: '2',
    //     recipeIngredients: [
    //       '2 cups Water',
    //       '2 tsp Black Tea',
    //       '1 tbsp Lemon Juice',
    //       '2 tsp Honey',
    //     ],
    //     recipeCuisines: ['Continental'],
    //     keywords: ['Lemon Tea'],
    //     author: ['Neha Mathor'],
    //     description:
    //       'Lemon Tea is a refreshing tea where lemon juice is added in black or green tea. It soothes the throat, prevents cough and congestion and helps in weightloss. Here is how to make it.',
    //     datePublished: '2020-03-29T01:45:42+00:00',
    //     url: 'https://www.whiskaffair.com/lemon-tea-recipe/',
    //     favicon: 'https://www.whiskaffair.com/favicon.ico',
    //     __v: 0,
    //   };
    //   await RecipeModel.create(recipe);
    //   return 'Recipe Created';
    // }
    async getAllRecipes() {
        const recipes = await recipe_1.default.find();
        return recipes;
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipes", null);
RecipeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeResolver);
exports.default = RecipeResolver;
