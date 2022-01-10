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
const Ingredient_1 = __importDefault(require("../../src_food/schemas/Ingredient"));
const RecipeCategory_1 = __importDefault(require("./RecipeCategory"));
const Brand_1 = __importDefault(require("./Brand"));
const ImageType_1 = __importDefault(require("./ImageType"));
let TestIngredient = class TestIngredient {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TestIngredient.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TestIngredient.prototype, "unit", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TestIngredient.prototype, "name", void 0);
TestIngredient = __decorate([
    (0, type_graphql_1.ObjectType)()
], TestIngredient);
let Recipe = class Recipe {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], Recipe.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "mainEntityOfPage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ImageType_1.default], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Recipe.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "datePublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "prepTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "cookTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "totalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "recipeYield", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "recipeIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "recipeInstructions", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "recipeCuisines", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RecipeCategory_1.default, { nullable: true }),
    __metadata("design:type", RecipeCategory_1.default)
], Recipe.prototype, "recipeBlendCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Brand_1.default, { nullable: true }),
    __metadata("design:type", Brand_1.default)
], Recipe.prototype, "brand", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "foodCategories", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [Ingredient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "url", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Recipe.prototype, "scrappedByAdmin", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Recipe.prototype, "discovery", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "favicon", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [TestIngredient], { nullable: true }),
    __metadata("design:type", Array)
], Recipe.prototype, "testIngredient", void 0);
Recipe = __decorate([
    (0, type_graphql_1.ObjectType)()
], Recipe);
exports.default = Recipe;
