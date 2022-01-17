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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const comment_1 = __importDefault(require("../../../models/comment"));
let UserCommentsResolver = class UserCommentsResolver {
    async addNewComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.commnetedBy });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.create(data);
        await recipe_1.default.findByIdAndUpdate(data.recipeId, {
            $push: { comments: comment._id },
        });
        return 'Comment added successfully';
    }
    async deleteComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.findOne({
            _id: data.commentId,
            recipeId: data.recipeId,
            commnetedBy: data.userId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        await comment_1.default.findByIdAndDelete(data.commentId);
        await recipe_1.default.findByIdAndUpdate(data.recipeId, {
            $pull: { comments: data.commentId },
        });
        return 'Comment deleted successfully';
    }
    async updateComment(data) {
        let user = await memberModel_1.default.findOne({
            _id: data.editableObject.commnetedBy,
        });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({
            _id: data.editableObject.recipeId,
        });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.findOne({
            _id: data.editId,
            recipeId: data.editableObject.recipeId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        let newData = data.editableObject;
        newData.modifiedAt = Date.now();
        await comment_1.default.findByIdAndUpdate(data.editId, newData);
        return 'Comment updated successfully';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "addNewComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "deleteComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "updateComment", null);
UserCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserCommentsResolver);
exports.default = UserCommentsResolver;
