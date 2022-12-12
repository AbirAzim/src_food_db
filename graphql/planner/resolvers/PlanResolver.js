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
let PlanResolver = class PlanResolver {
    async createAPlan(input) {
        let myPlan = input;
        if (input.startDateString) {
            myPlan.startDate = new Date(new Date(input.startDateString.toString()).toISOString().slice(0, 10));
        }
        if (input.endDateString) {
            myPlan.endDate = new Date(new Date(input.endDateString.toString()).toISOString().slice(0, 10));
        }
        myPlan.planData = input.planData.map((pd) => {
            return {
                recipes: pd.recipes,
                assignDate: new Date(new Date(pd.assignDateString.toString()).toISOString().slice(0, 10)),
                assignDateString: pd.assignDateString,
            };
        });
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
        if (input.editableObject.planData) {
            myPlan.planData = input.editableObject.planData.map((pd) => {
                return {
                    recipes: pd.recipes,
                    assignDate: new Date(new Date(pd.assignDateString.toString()).toISOString().slice(0, 10)),
                    assignDateString: pd.assignDateString,
                };
            });
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
        }).populate('planData.recipes');
        return plan;
    }
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
    async getAllGlobalPlans() {
        let plans = await Plan_1.default.find({ isGlobal: true }).populate('planData.recipes');
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
    (0, type_graphql_1.Query)(() => Plan_2.default),
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
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllGlobalPlans", null);
PlanResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanResolver);
exports.default = PlanResolver;
