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
const Wikilist_1 = __importDefault(require("../schemas/Wikilist"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
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
};
__decorate([
    (0, type_graphql_1.Query)(() => [Wikilist_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiList", null);
WikiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiResolver);
exports.default = WikiResolver;
