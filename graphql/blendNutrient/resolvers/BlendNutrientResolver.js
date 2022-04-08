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
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const uniqueNutrient_1 = __importDefault(require("../../../models/uniqueNutrient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const AddNewBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrient"));
const EditBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/EditBlendNutrient"));
const AddNewBlendNutrientFromSrc_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrientFromSrc"));
const BlendNutrientData_1 = __importDefault(require("../schemas/BlendNutrientData"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let allUnits = {
    Kilojoules: { unit: 'kJ', unitName: 'Kilojoules' },
    Gram: { unit: 'G', unitName: 'Gram' },
    Milligram: { unit: 'MG', unitName: 'Milligram' },
    Microgram: { unit: 'UG', unitName: 'Microgram' },
    Kilogram: { unit: 'KG', unitName: 'Kilogram' },
    Millilitre: { unit: 'ML', unitName: 'Millilitre' },
    Ounces: { unit: 'OZ', unitName: 'Ounces' },
};
let BlendNutrientResolver = class BlendNutrientResolver {
    async addNewBlendNutrient(data) {
        let checkBlendId = await blendNutrient_1.default.findOne({
            blendId: data.blendId,
        });
        if (checkBlendId) {
            return new AppError_1.default('Blend Id already exists', 400);
        }
        if (!data.parent || data.parent === '') {
            data.parent = null;
            data.parentIsCategory = true;
            let searchBlendNutrient = await blendNutrient_1.default.find({
                category: data.category,
                parentIsCategory: true,
            });
            data.rank = searchBlendNutrient.length + 1;
            data.blendId = (+searchBlendNutrient[searchBlendNutrient.length - 1].blendId + 1).toString();
        }
        else {
            data.parentIsCategory = false;
            let searchBlendNutrient = await blendNutrient_1.default.find({
                parent: data.parent,
                parentIsCategory: false,
            });
            data.rank = searchBlendNutrient.length + 1;
            data.blendId = (+searchBlendNutrient[searchBlendNutrient.length - 1].blendId + 1).toString();
        }
        await blendNutrient_1.default.create(data);
        return 'BlendNutrient Created Successfull';
    }
    // @Mutation(() => String)
    // async hello() {
    //   let blendNutrient: any = await BlendNutrientModel.findOne({
    //     _id: '62407412305947996ac265eb',
    //   });
    //   let blendIngredints = await BlendNutrientModel.findOne({
    //     _id: '624076f2305947996ac266e7',
    //   });
    //   console.log('hello', blendIngredints.blendId);
    //   if (blendNutrient.parentIsCategory) {
    //     let allBlendNutrients = await BlendNutrientModel.find({
    //       category: blendNutrient.category,
    //       parentIsCategory: true,
    //     });
    //     console.log(allBlendNutrients[allBlendNutrients.length - 1].blendId);
    //   }
    // }
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
        let modifiedData = data.editableObject;
        if (!modifiedData.parent || modifiedData.parent === '') {
            modifiedData.parent = null;
            modifiedData.parentIsCategory = true;
        }
        else {
            modifiedData.parentIsCategory = false;
        }
        if (
        //@ts-ignore
        modifiedData.unitName !== '' ||
            //@ts-ignore
            modifiedData.unitName === null ||
            //@ts-ignore
            modifiedData.unitName === undefined) {
            //@ts-ignore
            modifiedData.units = allUnits[modifiedData.unitName].unit;
        }
        await blendNutrient_1.default.findByIdAndUpdate(data.editId, modifiedData);
        return 'BlendNutrient Updated';
    }
    async addNewBlendNutrientFromSrc(data) {
        let un = await uniqueNutrient_1.default.findOne({
            _id: data.srcNutrientId,
        });
        if (!un) {
            return new AppError_1.default('Nutrient not found in source', 400);
        }
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: data.blendNutrientIdForMaping,
        });
        if (!blendNutrient) {
            return new AppError_1.default('Blend Nutrient not found', 400);
        }
        // if (checkBlendId) {
        //   return new AppError('Unique Nutrient Id already exists', 400);
        // }
        let checkBlendId = await mapToBlend_1.default.findOne({
            blendNutrientId: data.blendNutrientIdForMaping,
            srcUniqueNutrientId: data.srcNutrientId,
        });
        if (checkBlendId) {
            console.log(checkBlendId);
            return new AppError_1.default('This Mapping is already exist', 400);
        }
        await mapToBlend_1.default.create({
            blendNutrientId: data.blendNutrientIdForMaping,
            srcUniqueNutrientId: un._id,
        });
        await this.makeNotBlendNutrientToBlendNutrient(un._id, data.blendNutrientIdForMaping);
        return 'BlendNutrient Created Successfull';
    }
    async makeNotBlendNutrientToBlendNutrient(uniqueNutrientReferrence, blendNutrientRefference) {
        let blendIngredints = await blendIngredient_1.default.find({
            'notBlendNutrients.uniqueNutrientRefference': uniqueNutrientReferrence,
        }).select('notBlendNutrients');
        for (let i = 0; i < blendIngredints.length; i++) {
            let index = blendIngredints[i].notBlendNutrients.filter(
            //@ts-ignore
            (x) => {
                return (String(x.uniqueNutrientRefference) ===
                    String(uniqueNutrientReferrence));
            })[0];
            if (index) {
                let value = {
                    value: index.value,
                    blendNutrientRefference: blendNutrientRefference,
                };
                await blendIngredient_1.default.findOneAndUpdate({ _id: blendIngredints[i]._id }, {
                    $push: {
                        blendNutrients: value,
                    },
                });
            }
        }
    }
    async makeBlendNutrientToNotBlendNutrient(blendNutrientId) {
        await blendIngredient_1.default.updateMany({
            'blendNutrient.blendNutrientRefference': blendNutrientId,
        }, {
            $pull: { blendNutrients: { blendNutrientRefference: blendNutrientId } },
        });
        await mapToBlend_1.default.deleteMany({ blendNutrientId });
    }
    async removeBlendNutrient(id) {
        await blendNutrient_1.default.findByIdAndDelete(id);
        await mapToBlend_1.default.deleteMany({
            blendNutrientId: id,
        });
        await this.makeBlendNutrientToNotBlendNutrient(id);
        return 'BlendNutrient Deleted';
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
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "removeBlendNutrient", null);
BlendNutrientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendNutrientResolver);
exports.default = BlendNutrientResolver;
