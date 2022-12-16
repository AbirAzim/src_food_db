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
const generalBlogCollection_1 = __importDefault(require("../../../models/generalBlogCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const BlogCollection_1 = __importDefault(require("../schema/blogCollection/BlogCollection"));
const AddNewBlogCollection_1 = __importDefault(require("./inputType/BlogCollection/AddNewBlogCollection"));
let GeneralBlogCollectionResolver = class GeneralBlogCollectionResolver {
    async getAllBlogCollections(memberId) {
        let collections = await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
        if (collections.length === 0) {
            let defaultBlogCollection = await generalBlogCollection_1.default.create({
                name: 'My Favorite',
                slug: 'my-favorite',
                memberId: memberId,
                isDefault: true,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedBlogCollection: defaultBlogCollection._id,
            });
        }
        else {
            return collections;
        }
        return await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
    }
    async addToBlogCollection(collectionId, memberId, blogId, previousBlogCollection) {
        let collection = await generalBlogCollection_1.default.findOne({
            _id: collectionId,
            memberId: memberId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        if (!blogId && !previousBlogCollection) {
            return new AppError_1.default('No blog id or previous blog collection provided', 404);
        }
        if (!blogId && previousBlogCollection) {
            await generalBlogCollection_1.default.findOneAndUpdate({
                _id: previousBlogCollection,
                memberId: memberId,
            }, {
                $pull: {
                    blogs: blogId,
                },
            });
            return 'Removed from collection';
        }
        let myCollectionId;
        if (previousBlogCollection) {
            await generalBlogCollection_1.default.findOneAndUpdate({
                _id: previousBlogCollection,
                memberId: memberId,
            }, {
                $pull: {
                    blogs: blogId,
                },
            });
        }
        if (collectionId) {
            myCollectionId = collectionId;
        }
        else {
            let member = await memberModel_1.default.findOne({
                _id: memberId,
            }).select('lastModifiedBlogCollection');
            myCollectionId = member.lastModifiedPlanCollection;
        }
        await generalBlogCollection_1.default.findOneAndUpdate({
            _id: myCollectionId,
            memberId: memberId,
        }, {
            $push: {
                plans: blogId,
            },
        });
        await memberModel_1.default.findOneAndUpdate({
            _id: memberId,
        }, {
            lastModifiedBlogCollection: collectionId,
        });
        return 'Added to collection';
    }
    async addNewBlogCollection(data) {
        await generalBlogCollection_1.default.create(data);
        return 'new blog collection added';
    }
    async deleteBlogCollection(collectionId, memberId) {
        let blogCollection = await generalBlogCollection_1.default.findOne({
            _id: collectionId,
            memberId: memberId,
        }).select('isDefault');
        if (blogCollection.isDefault) {
            return new AppError_1.default('Default collection cannot be deleted', 400);
        }
        if (!blogCollection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await generalBlogCollection_1.default.findOneAndDelete({
            _id: collectionId,
        });
        return 'Collection deleted';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [BlogCollection_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "getAllBlogCollections", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('collectionId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('blogId', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('previousBlogCollection', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "addToBlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlogCollection_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "addNewBlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "deleteBlogCollection", null);
GeneralBlogCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GeneralBlogCollectionResolver);
exports.default = GeneralBlogCollectionResolver;
