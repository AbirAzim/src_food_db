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
const CreateUserChallenge_1 = __importDefault(require("./input-type/CreateUserChallenge"));
const CreateEditUserChallenge_1 = __importDefault(require("./input-type/CreateEditUserChallenge"));
const UserChallenge_1 = __importDefault(require("../schemas/UserChallenge"));
const challenge_1 = __importDefault(require("../../../models/challenge"));
const shareChallengeGlobal_1 = __importDefault(require("../../../models/shareChallengeGlobal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const FormateDate_1 = __importDefault(require("../../../utils/FormateDate"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const challengeInfoForId_1 = __importDefault(require("../schemas/challengeInfoForId"));
let ChallengeResolver = class ChallengeResolver {
    async createUserChallenge(data) {
        let userChallenges = await challenge_1.default.find({
            memberId: data.memberId,
        });
        // var Difference_In_Time = Math.abs(
        //   data.startDate.getTime() - data.endDate.getTime()
        // );
        // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        // data.days = Difference_In_Days;
        if (userChallenges.length === 0) {
            let modifiedData = data;
            modifiedData.isActive = true;
            let userChallenge = await challenge_1.default.create(modifiedData);
            return userChallenge._id;
        }
        let userChallenge = await challenge_1.default.create(data);
        return userChallenge._id;
    }
    async editUserChallenge(data) {
        if (data.isActive) {
            await challenge_1.default.updateMany({
                memberId: data.memberId,
            }, {
                isActive: false,
            });
        }
        let userChallenge = await challenge_1.default.findOneAndUpdate({ _id: data.challengeId }, data, { new: true });
        return userChallenge._id;
    }
    async getMyChallengeList(memberId) {
        let userChallenges = await challenge_1.default.find({
            memberId: memberId,
        });
        let list = [];
        for (let i = 0; i < userChallenges.length; i++) {
            list.push({
                _id: userChallenges[i]._id,
                challengeName: userChallenges[i].challengeName,
                memberId: userChallenges[i].memberId,
                description: userChallenges[i].description,
                notification: userChallenges[i].notification,
                startingDate: userChallenges[i].startDate.toLocaleString('default', {
                    month: 'short',
                }) +
                    ' ' +
                    userChallenges[i].startDate.getDate() +
                    ', ' +
                    userChallenges[i].startDate.getFullYear(),
                startDate: (0, FormateDate_1.default)(userChallenges[i].startDate),
                endDate: (0, FormateDate_1.default)(userChallenges[i].endDate),
                days: userChallenges[i].days,
                isActive: userChallenges[i].isActive,
            });
        }
        return list;
    }
    async getChallengeInfoById(challengeId, token) {
        let userChallenge = await challenge_1.default.findOne({
            _id: challengeId,
        });
        if (!userChallenge) {
            return new AppError_1.default('Challenge not found', 404);
        }
        let memberInfo = await memberModel_1.default.findOne({
            _id: userChallenge.memberId,
        }).select('image displayName');
        let data = {
            challengeName: userChallenge.challengeName,
            memberInfo,
        };
        return data;
    }
    async getChallengeById(challengeId) {
        let userChallenge = await challenge_1.default.findOne({
            _id: challengeId,
        });
        let data = {
            _id: userChallenge._id,
            challengeName: userChallenge.challengeName,
            memberId: userChallenge.memberId,
            description: userChallenge.description,
            notification: userChallenge.notification,
            startDate: userChallenge.startDate.toLocaleString('default', {
                month: 'short',
            }) +
                ' ' +
                userChallenge.start.getDate() +
                ', ' +
                userChallenge.start.getFullYear(),
            endDate: userChallenge.endDate.toLocaleString('default', {
                month: 'short',
            }) +
                ' ' +
                userChallenge.endDate.getDate() +
                ', ' +
                userChallenge.endDate.getFullYear(),
            days: userChallenge.days,
            isActive: userChallenge.isActive,
        };
        return userChallenge;
    }
    async deleteUserChallenge(challengeId) {
        await challenge_1.default.findOneAndDelete({
            _id: challengeId,
        });
        return 'successfully deleted';
    }
    async shareGlobalChallenge(challengeId, memberId) {
        let challenge = await challenge_1.default.findOne({ _id: challengeId });
        if (String(challenge.memberId) !== memberId) {
            return new AppError_1.default('You are not authorized to share this challenge', 401);
        }
        let shareChallengeGlobal = await shareChallengeGlobal_1.default.create({
            challengeId: challengeId,
        });
        return shareChallengeGlobal._id;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserChallenge_1.default]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "createUserChallenge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditUserChallenge_1.default]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "editUserChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserChallenge_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getMyChallengeList", null);
__decorate([
    (0, type_graphql_1.Query)(() => challengeInfoForId_1.default),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getChallengeInfoById", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserChallenge_1.default),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getChallengeById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "deleteUserChallenge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "shareGlobalChallenge", null);
ChallengeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ChallengeResolver);
exports.default = ChallengeResolver;
