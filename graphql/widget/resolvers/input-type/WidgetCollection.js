"use strict";
//       icon: String,
//       banner: String,
//       hasIcon: Boolean,
//       hasBanner: Boolean,
//       collections: [{ type: Schema.Types.ObjectId, ref: 'AdminCollection' }],
//       isPublished: Boolean,
//       publishedAt: Date,
//       publishedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
let WidgetCollection = class WidgetCollection {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "icon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "banner", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], WidgetCollection.prototype, "hasIcon", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], WidgetCollection.prototype, "hasBanner", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID]),
    __metadata("design:type", Array)
], WidgetCollection.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], WidgetCollection.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], WidgetCollection.prototype, "publishedBy", void 0);
WidgetCollection = __decorate([
    (0, type_graphql_1.InputType)()
], WidgetCollection);
exports.default = WidgetCollection;
