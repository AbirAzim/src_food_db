"use strict";
// ingredients: [
//   {
//     ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
//     portion: {
//       measurementQuantity: Number,
//       measurement: String,
//       meausermentWeight: String,
//     },
//   },
// ],
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const SelectedPortion_1 = __importDefault(require("./SelectedPortion"));
const ReturnPortion_1 = __importDefault(require("./ReturnPortion"));
let IngredientData = class IngredientData {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], IngredientData.prototype, "ingredientId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], IngredientData.prototype, "weightInGram", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", SelectedPortion_1.default)
], IngredientData.prototype, "selectedPortion", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ReturnPortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], IngredientData.prototype, "portions", void 0);
IngredientData = __decorate([
    (0, type_graphql_1.ObjectType)()
], IngredientData);
exports.default = IngredientData;
