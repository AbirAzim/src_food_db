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
const CreateNewDaily_1 = __importDefault(require("./input-type/CreateNewDaily"));
const EditDaily_1 = __importDefault(require("./input-type/EditDaily"));
const Daily_1 = __importDefault(require("../../../models/Daily"));
const GetDaily_1 = __importDefault(require("../schemas/GetDaily"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let UserDailyResolver = class UserDailyResolver {
    async createNewDaily(data) {
        await Daily_1.default.create(data);
        return 'Done';
    }
    async editADaily(data) {
        let daily = await Daily_1.default.findOne({ _id: data.editId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        await Daily_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async getDailyByUserId(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let config = await memberConfiguiration_1.default.findOne({
            _id: user.configuration,
        });
        let daily = await this.getDaily(config.age.month, Number(config.age.quantity), config.activity, config.gender, Number(config.weightInKilograms), Number(config.heightInCentimeters));
        return daily;
    }
    async getDaily(isAgeInMonth, ageInNumber, activity, gender, weightInKG, heightInCM) {
        if (isAgeInMonth) {
            ageInNumber = Number(ageInNumber) * 0.0833334;
        }
        let bmi = await this.bmiCalculation(Number(weightInKG), Number(heightInCM));
        let calories = await this.getDailyCalorie(activity.toLowerCase(), ageInNumber, bmi, gender.toLowerCase(), weightInKG, heightInCM);
        let nutrients = await this.getDailyNutrition(ageInNumber, calories);
        let retunrData = {
            bmi: {
                value: bmi,
                units: 'kg/m2',
            },
            calories: {
                value: calories,
                units: 'N/A',
            },
            nutrients: nutrients,
        };
        return retunrData;
    }
    async getDailyNutrition(ageInNumber, calories) {
        let Energy = [];
        let Minerals = [];
        let Vitamins = [];
        let daily = await Daily_1.default.find();
        for (let i = 0; i < daily.length; i++) {
            if (daily[i].categoryName === 'Energy') {
                Energy.push({
                    nutrientName: daily[i].nutrientName,
                    data: await this.getDataFromRanges(JSON.stringify(daily[i].ranges), ageInNumber, calories),
                    blendNutrientRef: daily[i].blendNutrientRef,
                });
            }
            else if (daily[i].categoryName === 'Minerals') {
                Minerals.push({
                    nutrientName: daily[i].nutrientName,
                    data: await this.getDataFromRanges(JSON.stringify(daily[i].ranges), ageInNumber, calories),
                    blendNutrientRef: daily[i].blendNutrientRef,
                });
            }
            else if (daily[i].categoryName === 'Vitamins') {
                Vitamins.push({
                    nutrientName: daily[i].nutrientName,
                    data: await this.getDataFromRanges(JSON.stringify(daily[i].ranges), ageInNumber, calories),
                    blendNutrientRef: daily[i].blendNutrientRef,
                });
            }
        }
        return { Energy, Minerals, Vitamins };
    }
    async getDataFromRanges(ranges, ageInNumber, calories) {
        let convertedRanges = JSON.parse(String(ranges));
        let value = {};
        for (let i = 0; i < convertedRanges.length; i++) {
            if (convertedRanges[i].ageInRange &&
                convertedRanges[i].ageRangeFrom <= ageInNumber &&
                convertedRanges[i].ageRangeTo >= ageInNumber) {
                if (convertedRanges[i].dailyPercentageInRange) {
                    let value1 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeFrom;
                    let value2 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeTo;
                    value = {
                        value: `${value1} - ${value2}`,
                        units: convertedRanges[i].units ? convertedRanges[i].units : 'N/A',
                    };
                    break;
                }
                else {
                    value = {
                        value: convertedRanges[i].value,
                        units: convertedRanges[i].units,
                    };
                    break;
                }
            }
            else if (convertedRanges[i].ageMorethan < ageInNumber) {
                if (convertedRanges[i].dailyPercentageInRange) {
                    let value1 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeFrom;
                    let value2 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeTo;
                    value = {
                        value: `${value1} - ${value2}`,
                        units: convertedRanges[i].units ? convertedRanges[i].units : 'N/A',
                    };
                    break;
                }
                else {
                    value = {
                        value: convertedRanges[i].value,
                        units: convertedRanges[i].units ? convertedRanges[i].units : 'N/A',
                    };
                    break;
                }
            }
        }
        return value;
    }
    async bmiCalculation(weightInKilograms, heightInCentimeters) {
        let heightInMeters = Number(heightInCentimeters) * 0.01;
        let bmi = Number(weightInKilograms) / (heightInMeters * heightInMeters);
        return bmi;
    }
    async getDailyCalorie(activity, ageInYears, bmi, gender, weightInKG, heightInCM) {
        let heightInMeters = Number(heightInCM) * 0.01;
        let totalCaloriesNeeded;
        if (bmi >= 18.5 && bmi <= 25) {
            if (ageInYears >= 9 && ageInYears <= 18) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.13;
                    }
                    else if (activity === 'high') {
                        pal = 1.26;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.42;
                    }
                    //113.5 - 61.9*age (years) + PAL * (26.7 * weight (kg) + 903 * height (m)), where PAL = 1 if sedentary, 1.13 if low active, 1.26 if active, and 1.42 if very active.
                    totalCaloriesNeeded =
                        113.5 -
                            61.9 * Number(ageInYears) +
                            Number(pal) * (26.7 * Number(weightInKG) + 903 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender === 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.16;
                    }
                    else if (activity === 'high') {
                        pal = 1.31;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.48;
                    }
                    //160.3 - 30.8*age (years) + PAL * (10 * weight (kg) + 934 * height (m)), where PAL = 1 if sedentary, 1.16 if low active, 1.31 if active, and 1.56 if very active.
                    totalCaloriesNeeded =
                        160.3 -
                            30.8 * Number(ageInYears) +
                            Number(pal) * (10 * Number(weightInKG) + 934 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
            else if (ageInYears >= 19) {
                if (gender == 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.11;
                    }
                    else if (activity === 'high') {
                        pal = 1.25;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.48;
                    }
                    //661.8 - 9.53*age (years) + PAL*(15.91* weight (kg) + 539.6* height (m)), where PAL = 1 if sedentary, 1.11 if low active, 1.25 if active, and 1.48 if very active.
                    totalCaloriesNeeded =
                        661.8 -
                            9.53 * Number(ageInYears) +
                            Number(pal) * (15.91 * Number(weightInKG) + 539.6 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender == 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.27;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //354.1 - 6.91*age (years) + PAL*(9.36* weight (kg) + 726* height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.27 if active, and 1.45 if very active.
                    totalCaloriesNeeded =
                        354.1 -
                            6.91 * Number(ageInYears) +
                            Number(pal) * (9.36 * Number(weightInKG) + 726 * heightInMeters);
                }
            }
        }
        else if (bmi > 25) {
            if (ageInYears >= 9 && ageInYears <= 18) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //-114.1-50.9*age (years) + PAL * (19.5*weight (kg) + 1161.4*height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.24 if active, and 1.45 if very active
                    totalCaloriesNeeded =
                        -114.1 -
                            50.9 * Number(ageInYears) +
                            Number(pal) * (19.5 * Number(weightInKG) + 1161.4 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender == 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //389.2 - 41.2*age (years) + PAL * (15 * weight (kg) + 701.6 * height (m)), where PAL = 1 if sedentary, 1.18 if low active, 1.35 if active, and 1.60 if very active
                    totalCaloriesNeeded =
                        389.2 -
                            41.2 * Number(ageInYears) +
                            Number(pal) * (15 * Number(weightInKG) + 701.6 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
            else if (ageInYears >= 19) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //1085.6 - 10.08*age (years) + PAL*(13.7* weight (kg) + 416* height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.29 if active and 1.59 if very active.
                    totalCaloriesNeeded =
                        1085.6 -
                            10.08 * Number(ageInYears) +
                            Number(pal) * (13.7 * Number(weightInKG) + 416 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender === 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //447.6 - 7.95*age (years) + PAL*(11.4* weight (kg) + 619* height (m)), where PAL = 1 if sedentary, 1.16 if low active, 1.27 if active and 1.44 if very active.
                    totalCaloriesNeeded =
                        445.6 -
                            7.95 * Number(ageInYears) +
                            Number(pal) * (11.4 * Number(weightInKG) + 619 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewDaily_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "createNewDaily", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditDaily_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "editADaily", null);
__decorate([
    (0, type_graphql_1.Query)(() => GetDaily_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyByUserId", null);
__decorate([
    (0, type_graphql_1.Query)(() => GetDaily_1.default),
    __param(0, (0, type_graphql_1.Arg)('isAgeInMonth')),
    __param(1, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(2, (0, type_graphql_1.Arg)('activity')),
    __param(3, (0, type_graphql_1.Arg)('gender')),
    __param(4, (0, type_graphql_1.Arg)('weightInKG')),
    __param(5, (0, type_graphql_1.Arg)('heightInCM')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean,
        Number,
        String,
        String,
        Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDaily", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(1, (0, type_graphql_1.Arg)('calories')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyNutrition", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('ranges')),
    __param(1, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(2, (0, type_graphql_1.Arg)('calories')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDataFromRanges", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('weightInKG')),
    __param(1, (0, type_graphql_1.Arg)('heightInCM')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "bmiCalculation", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('activity')),
    __param(1, (0, type_graphql_1.Arg)('ageInYears')),
    __param(2, (0, type_graphql_1.Arg)('bmi')),
    __param(3, (0, type_graphql_1.Arg)('gender')),
    __param(4, (0, type_graphql_1.Arg)('weightInKG')),
    __param(5, (0, type_graphql_1.Arg)('heightInCM')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number,
        Number,
        String,
        Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyCalorie", null);
UserDailyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserDailyResolver);
exports.default = UserDailyResolver;
// @Field()
// nutrientName: String;
// @Field()
// ageInMonth: Boolean;
// @Field()
// ageInRange: Boolean;
// @Field()
// dailyPercentage: Boolean;
// @Field()
// dailyPercentageInRange: Boolean;
// @Field()
// range: Range;
