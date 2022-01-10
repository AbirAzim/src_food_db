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
const Member_1 = __importDefault(require("../schemas/Member"));
const Collection_1 = __importDefault(require("../schemas/Collection"));
const NewUserInput_1 = __importDefault(require("./input-type/NewUserInput"));
const EditUser_1 = __importDefault(require("./input-type/EditUser"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const CreateNewCollection_1 = __importDefault(require("./input-type/CreateNewCollection"));
let MemberResolver = class MemberResolver {
    async createNewUser(data) {
        let user = await memberModel_1.default.findOne({ email: data.email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        console.log(user);
        if (!user) {
            let configuration = await memberConfiguiration_1.default.create({});
            let collection = await userCollection_1.default.create({
                name: 'Default',
            });
            let pushedData = data;
            pushedData.configuration = configuration._id;
            pushedData.collections = [collection._id];
            pushedData.defaultCollection = collection._id;
            let user2 = await memberModel_1.default.create(pushedData);
            let user3 = await memberModel_1.default.findOne({ _id: user2._id })
                .populate('configuration')
                .populate({
                path: 'collections',
                populate: {
                    path: 'recipes',
                    model: 'Recipe',
                },
            });
            return user3;
        }
        return user;
    }
    async getASingleUserByEmail(email) {
        let user = await memberModel_1.default.findOne({ email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return user;
    }
    async createNewCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.UserEmail }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.UserEmail} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
            if (user.collections[i].name === data.collection.name) {
                return new AppError_1.default(`Collection ${data.collection.name} already exists`, 402);
            }
        }
        let collection = await userCollection_1.default.create(data.collection);
        await memberModel_1.default.findOneAndUpdate({ email: data.UserEmail }, { $push: { collections: collection._id } });
        return collection;
    }
    async getAllusers() {
        let users = await memberModel_1.default.find().populate('configuration');
        return users;
    }
    async removeAUserById(userId) {
        await memberModel_1.default.findByIdAndRemove(userId);
        return 'successfullRemoved';
    }
    async removeAUserByemail(email) {
        await memberModel_1.default.findOneAndRemove({ email: email });
        return 'successfullRemoved';
    }
    async getSingleUSerById(userId) {
        let user = await memberModel_1.default.findById(userId).populate('configuration');
        return user;
    }
    async editUserByEmail(data) {
        await memberModel_1.default.findOneAndUpdate({ email: data.editId }, data.editableObject);
        return 'Success';
    }
    async editUserById(data) {
        await memberModel_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserInput_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createNewUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASingleUserByEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewCollection_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createNewCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Member_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllusers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "removeAUserById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "removeAUserByemail", null);
__decorate([
    (0, type_graphql_1.Query)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getSingleUSerById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditUser_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editUserByEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditUser_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editUserById", null);
MemberResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberResolver);
exports.default = MemberResolver;
