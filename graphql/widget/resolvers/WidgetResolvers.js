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
const AddWidgetInput_1 = __importDefault(require("./input-type/AddWidgetInput"));
const WidgetCollection_1 = __importDefault(require("./input-type/WidgetCollection"));
const CreateEditWidgetCollection_1 = __importDefault(require("./input-type/CreateEditWidgetCollection"));
const EditWidget_1 = __importDefault(require("./input-type/EditWidget"));
const Widget_1 = __importDefault(require("../schemas/Widget"));
const Widget_2 = __importDefault(require("../../../models/Widget"));
let WigdetResolver = class WigdetResolver {
    async addNewWidget(data) {
        let widget = await Widget_2.default.create(data);
        return widget._id;
    }
    async addNewWidgetCollection(widgetId, widgetCollection) {
        let data = widgetCollection;
        if (widgetCollection.isPublished) {
            data.publishedAt = Date.now();
        }
        await Widget_2.default.findOneAndUpdate({ _id: widgetId }, {
            $push: { widgetCollections: data },
            $inc: { collectionCount: 1 },
        });
        return 'new widget collection added successfully';
    }
    async removeAWidgetCollection(widgetId, widgetCollectionId) {
        await Widget_2.default.findOneAndUpdate({ _id: widgetId }, {
            $pull: {
                widgetCollections: { _id: widgetCollectionId },
            },
            $inc: { collectionCount: -1 },
        });
        return 'widget collection removed successfully';
    }
    async editAWidgetCollection(widgetId, widgetCollection) {
        await Widget_2.default.findOneAndUpdate({ _id: widgetId }, {
            $pull: {
                widgetCollections: { _id: widgetCollection._id },
            },
        });
        let data = widgetCollection;
        if (widgetCollection.isPublished) {
            data.publishedAt = Date.now();
        }
        await Widget_2.default.findOneAndUpdate({ _id: widgetId }, {
            $push: { widgetCollections: data },
        });
        return 'widget collection edit successfully';
    }
    async removeAWidget(widgetId) {
        await Widget_2.default.findOneAndRemove({ _id: widgetId });
        return 'widget removed successfully';
    }
    // @Mutation(() => String)
    // async editWidget(widgetId: String, data: EditWidget) {
    //   await WidgetModel.findOneAndUpdate({ _id: widgetId }, data);
    //   return 'widget updated successfully';
    // }
    async getAllWidgets() {
        let widgets = await Widget_2.default.find();
        return widgets;
    }
    async editAWidget(data) {
        await Widget_2.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'new widget created successfully';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddWidgetInput_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "addNewWidget", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        WidgetCollection_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "addNewWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "removeAWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        CreateEditWidgetCollection_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "removeAWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Widget_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getAllWidgets", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditWidget_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidget", null);
WigdetResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WigdetResolver);
exports.default = WigdetResolver;
