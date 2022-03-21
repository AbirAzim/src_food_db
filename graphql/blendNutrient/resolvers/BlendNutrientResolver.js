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
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const uniqueNutrient_1 = __importDefault(require("../../../models/uniqueNutrient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const AddNewBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrient"));
const EditBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/EditBlendNutrient"));
const AddNewBlendNutrientFromSrc_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrientFromSrc"));
const BlendNutrientData_1 = __importDefault(require("../schemas/BlendNutrientData"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let BlendNutrientResolver = class BlendNutrientResolver {
    async addNewBlendNutrient(data) {
        let checkBlendId = await blendNutrient_1.default.findOne({
            blendId: data.blendId,
        });
        if (checkBlendId) {
            return new AppError_1.default('Blend Id already exists', 400);
        }
        await blendNutrient_1.default.create(data);
        return 'BlendNutrient Created Successfull';
    }
    async getAllBlendNutrients() {
        let blendNutrients = await blendNutrient_1.default.find()
            .populate('parent')
            .populate('category');
        return blendNutrients;
    }
    async getASingleBlendNutrient(id) {
        let blendNutrient = await blendNutrient_1.default.findById(id)
            .populate('parent')
            .populate('category');
        return blendNutrient;
    }
    async editBlendNutrient(data) {
        if (data.editableObject.category === null) {
            return new AppError_1.default('Category can not be null.', 400);
        }
        await blendNutrient_1.default.findByIdAndUpdate(data.editId, data.editableObject);
        return 'BlendNutrient Updated';
    }
    async addNewBlendNutrientFromSrc(data) {
        let un = await uniqueNutrient_1.default.findOne({
            _id: data.srcNutrientId,
        });
        if (!un) {
            return new AppError_1.default('Nutrient not found in source', 400);
        }
        let checkBlendId = await blendNutrient_1.default.findOne({
            uniqueNutrientId: data.srcNutrientId,
        });
        if (checkBlendId) {
            return new AppError_1.default('Unique Nutrient Id already exists', 400);
        }
        let newBlendNutrient = {
            nutrientName: un.nutrient,
            altName: '',
            category: null,
            status: 'Review',
            parent: null,
            uniqueNutrientId: un._id,
            parentIsCategory: false,
            rank: un.rank,
            unitName: un.unitName,
            units: '',
            min_measure: '',
            related_sources: un.related_sources,
        };
        newBlendNutrient.related_sources[0].sourceId = un._id;
        let newBlendNutrientData = await blendNutrient_1.default.create(newBlendNutrient);
        await mapToBlend_1.default.create({
            blendNutrientId: newBlendNutrientData._id,
            srcUniqueNutrientId: un._id,
        });
        return 'BlendNutrient Created Successfull';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlendNutrient_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "addNewBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendNutrientData_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "getAllBlendNutrients", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendNutrientData_1.default),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "getASingleBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendNutrient_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "editBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlendNutrientFromSrc_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "addNewBlendNutrientFromSrc", null);
BlendNutrientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendNutrientResolver);
exports.default = BlendNutrientResolver;
