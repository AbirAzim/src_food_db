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
const adminCollection_1 = __importDefault(require("../../../models/adminCollection"));
const CreateAdminCollection_1 = __importDefault(require("./input-type/CreateAdminCollection"));
const EditAdminCollection_1 = __importDefault(require("./input-type/EditAdminCollection"));
const AdminCollection_1 = __importDefault(require("./schemas/AdminCollection"));
let AdminCollectionResolver = class AdminCollectionResolver {
    async addNewAdminCollection(data) {
        await adminCollection_1.default.create(data);
        return 'Collection added successfully';
    }
    async editAdminCollectionByID(data) {
        const collection = await adminCollection_1.default.findById(data.editId);
        if (!collection) {
            throw new Error('Collection not found');
        }
        await adminCollection_1.default.findByIdAndUpdate(data.editId, data.editableObject);
        return 'Collection updated successfully';
    }
    async removeAdminCollection(collectionId) {
        const collection = await adminCollection_1.default.findById(collectionId);
        if (!collection) {
            throw new Error('Collection not found');
        }
        await adminCollection_1.default.findByIdAndDelete(collectionId);
        return 'Collection deleted successfully';
    }
    async getAllAdminCollection() {
        const collections = await adminCollection_1.default.find();
        return collections;
    }
    async getAllAdminCollectionType() {
        return ['Recipe', 'Ingredient'];
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAdminCollection_1.default]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "addNewAdminCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAdminCollection_1.default]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "editAdminCollectionByID", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "removeAdminCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [AdminCollection_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "getAllAdminCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "getAllAdminCollectionType", null);
AdminCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminCollectionResolver);
exports.default = AdminCollectionResolver;
