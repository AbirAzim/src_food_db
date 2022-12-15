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
const CreateNewPlan_1 = __importDefault(require("./input-type/planInput/CreateNewPlan"));
const Plan_1 = __importDefault(require("../../../models/Plan"));
const EditPlan_1 = __importDefault(require("./input-type/planInput/EditPlan"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const Plan_2 = __importDefault(require("../schemas/PlanSchema/Plan"));
const PlanIngredientAndCategory_1 = __importDefault(require("../schemas/PlanSchema/PlanIngredientAndCategory"));
const getRecipeCategoryPercentage_1 = __importDefault(require("./utils/getRecipeCategoryPercentage"));
const getIngredientStats_1 = __importDefault(require("./utils/getIngredientStats"));
const PlanWithTotal_1 = __importDefault(require("../schemas/PlanSchema/PlanWithTotal"));
let PlanResolver = class PlanResolver {
    async createAPlan(input) {
        let myPlan = input;
        if (input.startDateString) {
            myPlan.startDate = new Date(new Date(input.startDateString.toString()).toISOString().slice(0, 10));
        }
        if (input.endDateString) {
            myPlan.endDate = new Date(new Date(input.endDateString.toString()).toISOString().slice(0, 10));
        }
        //TODO
        myPlan.isGlobal = true;
        await Plan_1.default.create(myPlan);
        return 'Plan created';
    }
    async updateAPlan(input) {
        let plan = await Plan_1.default.findOne({ _id: input.editId }).select('memberId');
        if (String(plan.memberId) !== input.memberId) {
            return new AppError_1.default('You are not authorized to edit this plan', 401);
        }
        let myPlan = input.editableObject;
        if (input.editableObject.startDateString) {
            myPlan.startDate = new Date(new Date(input.editableObject.startDateString.toString())
                .toISOString()
                .slice(0, 10));
        }
        if (input.editableObject.endDateString) {
            myPlan.endDate = new Date(new Date(input.editableObject.endDateString.toString())
                .toISOString()
                .slice(0, 10));
        }
        myPlan.updatedAt = Date.now();
        console.log(myPlan);
        await Plan_1.default.findOneAndUpdate({
            _id: input.editId,
        }, myPlan);
        return 'Plan updated';
    }
    async getMyPlans(memberId) {
        let plans = await Plan_1.default.find({ memberId: memberId }).populate('planData.recipes');
        return plans;
    }
    async getAPlan(planId) {
        let plan = await Plan_1.default.findOne({
            _id: planId,
        }).populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        });
        let recipeCategories = [];
        let ingredients = [];
        for (let i = 0; i < plan.planData.length; i++) {
            if (plan.planData[i].recipes.length > 0) {
                for (let j = 0; j < plan.planData[i].recipes.length; j++) {
                    recipeCategories.push({
                        _id: plan.planData[i].recipes[j].recipeBlendCategory._id,
                        name: plan.planData[i].recipes[j].recipeBlendCategory.name,
                    });
                    //defaultVersion
                    //ingredients
                    for (let k = 0; k < plan.planData[i].recipes[j].defaultVersion.ingredients.length; k++) {
                        ingredients.push({
                            _id: plan.planData[i].recipes[j].defaultVersion.ingredients[k]
                                .ingredientId._id,
                            name: plan.planData[i].recipes[j].defaultVersion.ingredients[k]
                                .ingredientId.ingredientName,
                        });
                    }
                }
            }
        }
        let categoryPercentages = await (0, getRecipeCategoryPercentage_1.default)(recipeCategories);
        let ingredientsStats = await (0, getIngredientStats_1.default)(ingredients);
        return {
            plan: plan,
            topIngredients: ingredientsStats,
            recipeCategoriesPercentage: categoryPercentages,
        };
    }
    // async getIngredientsStats(recipes: any[]) {
    //   let ingredients: any = {};
    //   for (let i = 0; i < recipes.length; i++) {
    //     if (ingredients[recipes[i].name]) {
    //       ingredients[recipes[i].name].count += 1;
    //     } else {
    //       ingredients[recipes[i].name] = {
    //         ...recipes[i],
    //         count: 1,
    //       };
    //     }
    //   }
    //   let keys = Object.keys(ingredients);
    //   let sortedIngredients = keys
    //     .map((key: any) => ingredients[key])
    //     .sort((a: any, b: any) => b.count - a.count)
    //     .slice(0, 5);
    //   console.log(sortedIngredients);
    //   return sortedIngredients;
    // }
    // async getRecipeCategoryPercentage(recipeIds: any[]) {
    //   let categories: any = {};
    //   for (let i = 0; i < recipeIds.length; i++) {
    //     if (categories[recipeIds[i].name]) {
    //       categories[recipeIds[i].name].count += 1;
    //       let percentage =
    //         (categories[recipeIds[i].name].count / recipeIds.length) * 100;
    //       categories[recipeIds[i].name].percentage = percentage;
    //     } else {
    //       categories[recipeIds[i].name] = {
    //         ...recipeIds[i],
    //         count: 1,
    //         percentage: (1 / recipeIds.length) * 100,
    //       };
    //     }
    //   }
    //   let keys = Object.keys(categories);
    //   let sortedCategories = keys
    //     .map((key: any) => categories[key])
    //     .sort((a, b) => b.percentage - a.percentage);
    //   console.log(sortedCategories);
    //   return sortedCategories;
    // }
    async deletePlan(planId, memberId) {
        let plan = await Plan_1.default.findOne({ _id: planId }).select('memberId');
        if (String(plan.memberId) !== memberId) {
            return new AppError_1.default('You are not authorized to edit this plan', 401);
        }
        await Plan_1.default.findOneAndDelete({
            _id: planId,
        });
        return 'Plan deleted';
    }
    async getAllGlobalPlans(page, limit) {
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        return {
            plans: plans,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
        };
    }
    async getAllRecentPlans(limit) {
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit);
        return plans;
    }
    async getAllRecommendedPlans(limit) {
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit);
        return plans;
    }
    async getAllPopularPlans(limit) {
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(limit);
        return plans;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewPlan_1.default]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "createAPlan", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditPlan_1.default]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "updateAPlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getMyPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanIngredientAndCategory_1.default),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAPlan", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "deletePlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('page')),
    __param(1, (0, type_graphql_1.Arg)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllGlobalPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllRecentPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllRecommendedPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllPopularPlans", null);
PlanResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanResolver);
exports.default = PlanResolver;
