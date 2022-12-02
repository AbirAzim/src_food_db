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
const CreateWikiComment_1 = __importDefault(require("./input-type/CreateWikiComment"));
const WikiComment_1 = __importDefault(require("../schemas/WikiComment"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const wikiComment_1 = __importDefault(require("../../../models/wikiComment"));
const CreateEditWikiComment_1 = __importDefault(require("./input-type/CreateEditWikiComment"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const ReturnWikiComment_1 = __importDefault(require("../schemas/ReturnWikiComment"));
let WikiCommentsResolver = class WikiCommentsResolver {
    async createWikiComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        if (data.type === 'Ingredient') {
            let ingredient = await blendIngredient_1.default.findOne({
                _id: data.entityId,
            });
            if (!ingredient) {
                return new AppError_1.default('Ingredient not found', 404);
            }
        }
        else if (data.type === 'Nutrient') {
            let nutrient = await blendNutrient_1.default.findOne({ _id: data.entityId });
            if (!nutrient) {
                return new AppError_1.default('Nutrient not found', 404);
            }
        }
        else {
            return new AppError_1.default('Invalid type', 400);
        }
        let comment = await wikiComment_1.default.findOne({
            entityId: data.entityId,
            userId: data.userId,
        }).select('_id');
        if (comment) {
            return new AppError_1.default('Comment already exists', 400);
        }
        let newComment = await wikiComment_1.default.create(data);
        return newComment;
    }
    async editWikiComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let comment = await wikiComment_1.default.findOne({
            entityId: data.entityId,
            userId: data.userId,
        }).select('_id');
        if (!comment) {
            return new AppError_1.default('Comment not found', 400);
        }
        let newComment = await wikiComment_1.default.findOneAndUpdate({
            entityId: data.entityId,
            userId: data.userId,
        }, { $set: { comment: data.comment, updatedAt: Date.now() } }, { new: true });
        return newComment;
    }
    async getAllWikiCommentsForAWikiEntity(entityId, userId) {
        let comments = await wikiComment_1.default.find({
            entityId,
            userId: { $ne: userId },
        }).populate({
            path: 'userId',
            model: 'User',
        });
        let UserComment = await wikiComment_1.default.findOne({
            entityId,
            userId,
        });
        return {
            userComment: UserComment,
            comments: comments,
        };
    }
    async removeAWikiComment(entityId, userId) {
        let comment = await wikiComment_1.default.findOne({ entityId, userId });
        if (!comment) {
            return new AppError_1.default('Comment not found', 400);
        }
        await wikiComment_1.default.findOneAndDelete({ entityId, userId });
        return 'success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => WikiComment_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateWikiComment_1.default]),
    __metadata("design:returntype", Promise)
], WikiCommentsResolver.prototype, "createWikiComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => WikiComment_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditWikiComment_1.default]),
    __metadata("design:returntype", Promise)
], WikiCommentsResolver.prototype, "editWikiComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReturnWikiComment_1.default),
    __param(0, (0, type_graphql_1.Arg)('entityId')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiCommentsResolver.prototype, "getAllWikiCommentsForAWikiEntity", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('entityId')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiCommentsResolver.prototype, "removeAWikiComment", null);
WikiCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiCommentsResolver);
exports.default = WikiCommentsResolver;
