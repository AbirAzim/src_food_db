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
const NewUserRecipeInput_1 = __importDefault(require("./input-type/NewUserRecipeInput"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
let UserRecipeAndCollectionResolver = class UserRecipeAndCollectionResolver {
    async createNewUserRecipeWithCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ url: data.recipe.url });
        if (!recipe) {
            recipe = await recipe_1.default.create(data.recipe);
        }
        let collections = user.collections;
        let found = false;
        for (let k = 0; k < collections.length; k++) {
            if (collections[k]._id === data.collectionId) {
                await userCollection_1.default.findOneAndUpdate({ _id: collections[k]._id }, { $push: { recipes: recipe._id } });
                found = true;
                this.removeDuplicateRecipe(collections[k]._id);
                break;
            }
        }
        if (!found) {
            await userCollection_1.default.findOneAndUpdate({ _id: user.defaultCollection }, { $push: { recipes: recipe._id } });
            this.removeDuplicateRecipe(user.defaultCollection);
        }
        return 'successfull';
    }
    async removeDuplicateRecipe(collectionId) {
        let collection = await userCollection_1.default.findOne({
            _id: collectionId,
        });
        let NewList = [];
        for (let i = 0; i < collection.recipes.length; i++) {
            if (i === 0) {
                NewList.push(collection.recipes[i]);
            }
            else {
                for (let j = 0; j < NewList.length; j++) {
                    if (String(collection.recipes[i]) === String(NewList[j])) {
                        console.log('1');
                        continue;
                    }
                    else {
                        console.log('2');
                        NewList.push(collection.recipes[i]);
                    }
                }
            }
        }
        // console.log(NewList);
        await userCollection_1.default.findOneAndUpdate({
            _id: collectionId,
        }, {
            recipes: NewList,
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "createNewUserRecipeWithCollection", null);
UserRecipeAndCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserRecipeAndCollectionResolver);
exports.default = UserRecipeAndCollectionResolver;
