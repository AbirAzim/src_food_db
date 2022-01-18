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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const CreateNewNote_1 = __importDefault(require("./input-type/CreateNewNote"));
const GetMyNote_1 = __importDefault(require("./input-type/GetMyNote"));
const UserNote_1 = __importDefault(require("../schemas/UserNote"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let UserNotesResolver = class UserNotesResolver {
    async createNewNote(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        await userNote_1.default.create(data);
        return 'Note added successfully';
    }
    async getMyNotesForARecipe(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let Notes = await userNote_1.default.find({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return Notes;
    }
    async getAllMyNotes(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let Notes = await userNote_1.default.find({ userId: data.userId });
        return Notes;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "createNewNote", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserNote_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetMyNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "getMyNotesForARecipe", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserNote_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetMyNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "getAllMyNotes", null);
UserNotesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserNotesResolver);
exports.default = UserNotesResolver;
