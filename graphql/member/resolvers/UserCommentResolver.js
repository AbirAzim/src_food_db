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
const CreateComment_1 = __importDefault(require("./input-type/CreateComment"));
const RemoveComment_1 = __importDefault(require("./input-type/RemoveComment"));
const EditComment_1 = __importDefault(require("./input-type/EditComment"));
const GetAllComments_1 = __importDefault(require("./input-type/GetAllComments"));
const RecipeComments_1 = __importDefault(require("../schemas/RecipeComments"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const comment_1 = __importDefault(require("../../../models/comment"));
let UserCommentsResolver = class UserCommentsResolver {
    async createComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comments = await comment_1.default.find({
            recipeId: data.recipeId,
        }).select('userId');
        for (let i = 0; i < comments.length; i++) {
            if (String(comments[i].userId) === String(data.userId)) {
                return new AppError_1.default('Comment already exists with that recipe for this user', 400);
            }
        }
        await comment_1.default.create(data);
        let averageRating = (recipe.totalRating + data.rating) / (recipe.numberOfRating + 1);
        await recipe_1.default.findOneAndUpdate({ _id: data.recipeId }, {
            $inc: { numberOfRating: 1, totalRating: data.rating },
            $set: { averageRating },
        });
        let otherComments = await comment_1.default.find({
            userId: { $ne: data.userId },
            recipeId: data.recipeId,
        });
        let userComment = await comment_1.default.findOne({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return { userComment, comments: otherComments };
    }
    async getAllCommentsForARecipe(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comments = await comment_1.default.find({
            userId: { $ne: data.userId },
            recipeId: data.recipeId,
        });
        let userComment = await comment_1.default.findOne({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return { userComment, comments };
    }
    async removeComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ recipeId: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.findOne({
            _id: data.commentId,
            userId: data.userId,
            recipeId: data.recipeId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        let totalRating = recipe.totalRating - comment.rating;
        let numberOfRating = recipe.numberOfRating - 1;
        let averageRating;
        if (numberOfRating === 0) {
            averageRating = 0;
        }
        else {
            averageRating = totalRating / numberOfRating;
        }
        await comment_1.default.deleteOne({ _id: data.commentId });
        await recipe_1.default.updateOne({ _id: data.recipeId }, { numberOfRating, totalRating, averageRating });
        let comments = await comment_1.default.find({ recipeId: data.recipeId });
        return { comments };
    }
    async editComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.findOne({
            _id: data.editId,
            userId: data.userId,
            recipeId: data.recipeId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        let totalRating = recipe.totalRating - comment.rating + data.editableObject.rating;
        let averageRating;
        if (totalRating === 0) {
            averageRating = 0;
        }
        else {
            averageRating = totalRating / recipe.numberOfRating;
        }
        await recipe_1.default.findOneAndUpdate({ _id: data.recipeId }, { totalRating, averageRating });
        let newData = data.editableObject;
        newData.updatedAt = Date.now();
        let newComment = await comment_1.default.findOneAndUpdate({ _id: data.editId }, newData, { new: true });
        console.log(newComment);
        console.log(data.editId);
        let comments = await comment_1.default.find({
            _id: { $ne: data.editId },
            recipeId: data.recipeId,
        });
        return { userComment: newComment, comments };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "createComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllComments_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "getAllCommentsForARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "removeComment", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "editComment", null);
UserCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserCommentsResolver);
exports.default = UserCommentsResolver;
