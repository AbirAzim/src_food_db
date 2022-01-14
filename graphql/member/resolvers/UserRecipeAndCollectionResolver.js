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
const Collection_1 = __importDefault(require("../schemas/Collection"));
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
                await userCollection_1.default.findOneAndUpdate({ _id: collections[k]._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
                found = true;
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: data.collectionId });
                this.removeDuplicateRecipe(collections[k]._id);
                break;
            }
        }
        if (!found) {
            await userCollection_1.default.findOneAndUpdate({ _id: user.defaultCollection }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
            await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: user.defaultCollection });
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
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
        await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id });
        this.removeDuplicateRecipe(collection._id);
        return 'successfull';
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
    async changeRecipeCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        for (let j = 0; j < data.previousCollectionIds.length; j++) {
            await userCollection_1.default.findOneAndUpdate({ _id: data.previousCollectionIds[j] }, { $pull: { recipes: recipe._id } });
        }
        for (let i = 0; i < data.collectionIds.length; i++) {
            let collection = await userCollection_1.default.findOne({
                _id: data.collectionIds[i],
            });
            if (!collection) {
                return new AppError_1.default('Collection not found', 404);
            }
            // let previousCollection: any = await UserCollectoionModel.findOne({
            //   _id: data.previousCollectionId,
            // });
            // if (!previousCollection) {
            //   return new AppError('Previous collection not found', 404);
            // }
            await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
            await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id });
            this.removeDuplicateRecipe(collection._id);
        }
        return 'successfull';
    }
    async deleteCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        if (String(user.defaultCollection) === String(collection._id)) {
            return new AppError_1.default('You can not delete your default collection', 401);
        }
        if (String(user.lastModifiedCollection) === String(collection._id)) {
            if (user.collections.length === 1) {
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: user.defaultCollection });
            }
            else {
                let lastModifiedDate;
                let lastModifiedCollection;
                for (let i = 0; i < user.collections.length; i++) {
                    if (i === 0) {
                        lastModifiedDate = user.collections[i].updatedAt;
                        lastModifiedCollection = user.collections[i]._id;
                    }
                    else {
                        if (lastModifiedDate < user.collections[i].updatedAt) {
                            lastModifiedDate = user.collections[i].updatedAt;
                            lastModifiedCollection = user.collections[i]._id;
                        }
                    }
                }
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection });
            }
        }
        else {
            await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: user.defaultCollection });
        }
        await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { $pull: { collections: collection._id } });
        await userCollection_1.default.findOneAndRemove({ _id: collection._id });
        return 'successfull Deleted';
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
    (0, type_graphql_1.Mutation)(() => String),
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
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "changeRecipeCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
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
