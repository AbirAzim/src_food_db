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
const AddExistingRecipeInput_1 = __importDefault(require("./input-type/AddExistingRecipeInput"));
const ChangeRecipeCollectionInput_1 = __importDefault(require("./input-type/ChangeRecipeCollectionInput"));
const RemoveACollectionInput_1 = __importDefault(require("./input-type/RemoveACollectionInput"));
const EditCollection_1 = __importDefault(require("./input-type/EditCollection"));
const AddToLastModifiedCollection_1 = __importDefault(require("./input-type/AddToLastModifiedCollection"));
const Collection_1 = __importDefault(require("../schemas/Collection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const Collection_2 = __importDefault(require("../schemas/Collection"));
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
                await userCollection_1.default.findOneAndUpdate({ _id: collections[k]._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
                found = true;
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: data.collectionId });
                // this.removeDuplicateRecipe(collections[k]._id);
                break;
            }
        }
        if (!found) {
            await userCollection_1.default.findOneAndUpdate({ _id: user.defaultCollection }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
            await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: user.defaultCollection });
            // this.removeDuplicateRecipe(user.defaultCollection);
        }
        return 'successfull';
    }
    async addExistingRecipeToACollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let found = false;
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
        let member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id }, { new: true }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async getLastModifieldCollection(userEmail) {
        let user = await memberModel_1.default.findOne({ email: userEmail })
            .populate('defaultCollection')
            .populate('lastModifiedCollection');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        return user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
    }
    async addTolastModifiedCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let collectionId = user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
        let collection = await userCollection_1.default.findOne({ _id: collectionId });
        let found = false;
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collectionId }, {
            $push: { recipes: recipe._id },
            $set: { updatedAt: Date.now(), lastModifiedCollection: collection._id },
        });
        let member = await memberModel_1.default.findOne({ email: data.userEmail }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async addRecipeToAUserCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let found = false;
        let collection;
        for (let k = 0; k < user.collections.length; k++) {
            if (String(user.collections[k]._id) === String(data.collectionId)) {
                collection = user.collections[k];
                found = true;
            }
        }
        if (!found) {
            return new AppError_1.default('Collection not found', 404);
        }
        let found2 = false;
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found2 = true;
                break;
            }
        }
        if (found2) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
        let member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id }, { new: true }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async removeRecipeFromAColection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let found = false;
        let collection;
        for (let k = 0; k < user.collections.length; k++) {
            if (String(user.collections[k]._id) === String(data.collectionId)) {
                collection = user.collections[k];
                found = true;
            }
        }
        if (!found) {
            return new AppError_1.default('Collection not found', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $pull: { recipes: recipe._id } });
        let member = await memberModel_1.default.findOne({ _id: user._id }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async deleteCollection(data) {
        let getUser = await memberModel_1.default.findOne({
            email: data.userEmail,
        }).populate('collections');
        if (!getUser) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        let user = getUser;
        if (String(user.defaultCollection) === String(collection._id)) {
            return new AppError_1.default('You can not delete your default collection', 401);
        }
        if (String(user.lastModifiedCollection) === String(collection._id)) {
            if (user.collections.length === 1) {
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: user.defaultCollection });
            }
            // await MemberModel.findOneAndUpdate(
            //   { _id: user._id },
            //   { lastModifiedCollection }
            // );
        }
        await userCollection_1.default.findOneAndRemove({ _id: collection._id });
        let member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, {
            $pull: { collections: collection._id },
            $set: { updatedAt: Date.now() },
        }, { new: true }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async editACollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        if (String(data.collectionId) === String(user.defaultCollection)) {
            return new AppError_1.default('You can not edit your default collection', 401);
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, {
            name: data.newName,
        });
        return 'successfull';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "createNewUserRecipeWithCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddExistingRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addExistingRecipeToACollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getLastModifieldCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddToLastModifiedCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addTolastModifiedCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addRecipeToAUserCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "removeRecipeFromAColection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveACollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "deleteCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "editACollection", null);
UserRecipeAndCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserRecipeAndCollectionResolver);
exports.default = UserRecipeAndCollectionResolver;
