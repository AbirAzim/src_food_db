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
const planCollection_1 = __importDefault(require("../../../models/planCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const PlanCollection_1 = __importDefault(require("../schemas/PlanCollection/PlanCollection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const AddNewPlanCollection_1 = __importDefault(require("./input-type/PlanCollection/AddNewPlanCollection"));
let PlanCollectionResolver = class PlanCollectionResolver {
    async getAllPlanCollection(memberId) {
        let collections = await planCollection_1.default.find({
            memberId: memberId,
        });
        if (collections.length === 0) {
            let defaultBlogCollection = await planCollection_1.default.create({
                name: 'PLAN',
                slug: 'plan',
                memberId: memberId,
                isDefault: true,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedPlanCollection: defaultBlogCollection._id,
            });
        }
        else {
            return collections;
        }
        return await planCollection_1.default.find({
            memberId: memberId,
        });
    }
    async addOrRemovePlanCollection(collectionId, memberId, planId, previousPlanCollection) {
        let collection;
        let myCollectionId;
        if (collectionId) {
            collection = await planCollection_1.default.findOne({
                _id: collectionId,
                memberId: memberId,
            });
            myCollectionId = collectionId;
        }
        else {
            let member = await memberModel_1.default.findOne({
                _id: memberId,
            }).select('lastModifiedPlanCollection');
            myCollectionId = member.lastModifiedBlogCollection;
            collection = await planCollection_1.default.findOne({
                _id: member.lastModifiedBlogCollection,
            });
        }
        if (!collectionId && previousPlanCollection) {
            let hasInCollection = collection.blogs.filter((blog) => String(blog) === String(planId))[0];
            if (!hasInCollection) {
                return new AppError_1.default('Blog not found in collection', 404);
            }
            await planCollection_1.default.findOneAndUpdate({
                _id: previousPlanCollection,
                memberId: memberId,
            }, {
                $pull: {
                    plans: planId,
                },
                collectionDataCount: collection.blogs.length - 1,
            });
            return 'Removed from collection';
        }
        if (previousPlanCollection) {
            await planCollection_1.default.findOneAndUpdate({
                _id: previousPlanCollection,
                memberId: memberId,
            }, {
                $pull: {
                    plans: planId,
                },
                collectionDataCount: collection.blogs.length - 1,
            });
        }
        console.log(myCollectionId);
        await planCollection_1.default.findOneAndUpdate({
            _id: myCollectionId,
            memberId: memberId,
        }, {
            $push: {
                plans: planId,
            },
            collectionDataCount: collection.blogs.length + 1,
        });
        await memberModel_1.default.findOneAndUpdate({
            _id: memberId,
        }, {
            lastModifiedPlanCollection: collectionId,
        });
        return 'Added to collection';
    }
    async addNewPlanCollection(data) {
        let newPlanCollection = await planCollection_1.default.create(data);
        return newPlanCollection;
    }
    async deletePlanCollection(collectionId, memberId) {
        let collection = await planCollection_1.default.findOne({
            _id: collectionId,
            memberId: memberId,
        }).select('isDefault');
        if (collection.isDefault) {
            return new AppError_1.default('Cannot delete default collection', 400);
        }
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedPlanCollection');
        if (String(member.lastModifiedPlanCollection) === String(collectionId)) {
            let defaultCollection = await planCollection_1.default.findOne({
                memberId: memberId,
                isDefault: true,
            }).select('_id');
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedPlanCollection: defaultCollection._id,
            });
        }
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await planCollection_1.default.findOneAndDelete({
            _id: collectionId,
        });
        return 'Collection Deleted';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [PlanCollection_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "getAllPlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('collectionId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('planId')),
    __param(3, (0, type_graphql_1.Arg)('previousPlanCollection', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "addOrRemovePlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewPlanCollection_1.default]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "addNewPlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "deletePlanCollection", null);
PlanCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanCollectionResolver);
exports.default = PlanCollectionResolver;
