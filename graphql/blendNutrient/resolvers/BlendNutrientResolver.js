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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
let BlendNutrientResolver = class BlendNutrientResolver {
    async removeAllMapToBlend() {
        await mapToBlend_1.default.deleteMany({});
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    // async addBlendNutrients() {
    //   let obj = [
    //     {
    //       blendId: '1000',
    //       nutrientName: 'Calorie',
    //       category: '10',
    //       status: 'Active',
    //       parent: 10,
    //       rank: 1,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1001',
    //       nutrientName: 'Protien',
    //       category: '20',
    //       status: 'Active',
    //       parent: 20,
    //       rank: 1,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1002',
    //       nutrientName: 'Fats',
    //       category: '20',
    //       status: 'Active',
    //       parent: 20,
    //       rank: 2,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1003',
    //       nutrientName: 'Carbohydrates',
    //       category: 20,
    //       status: 'Active',
    //       parent: 20,
    //       rank: 3,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1004',
    //       nutrientName: 'Dietary Fiber',
    //       category: 20,
    //       status: 'Active',
    //       parent: 20,
    //       rank: 1,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1045',
    //       nutrientName: 'Fiber, soluble',
    //       category: 20,
    //       status: 'Active',
    //       parent: 1004,
    //       rank: 1,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1046',
    //       nutrientName: 'Fiber, insoluble',
    //       category: 20,
    //       status: 'Active',
    //       parent: 1004,
    //       rank: 2,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1005',
    //       nutrientName: 'Sugars',
    //       category: '20',
    //       status: 'Active',
    //       parent: 20,
    //       rank: 2,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1006',
    //       nutrientName: 'Sucrose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 1,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1007',
    //       nutrientName: 'Glucose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 2,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1008',
    //       nutrientName: 'Fructose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 3,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1009',
    //       nutrientName: 'Lactose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 4,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1010',
    //       nutrientName: 'Maltose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 5,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1011',
    //       nutrientName: 'Galactose',
    //       category: '20',
    //       status: 'Active',
    //       parent: 1005,
    //       rank: 6,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1012',
    //       nutrientName: 'Starch',
    //       category: 20,
    //       status: 'Active',
    //       parent: 1003,
    //       rank: 3,
    //       parentIsCategory: false,
    //     },
    //     {
    //       blendId: '1013',
    //       nutrientName: 'Vitamin C',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 1,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1014',
    //       nutrientName: 'Thiamin',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 2,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1015',
    //       nutrientName: 'Riboflavin',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 3,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1016',
    //       nutrientName: 'Niacin',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 4,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1017',
    //       nutrientName: 'Pantothenic acid',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 5,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1018',
    //       nutrientName: 'Vitamin B-6',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 6,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1019',
    //       nutrientName: 'Biotin',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 7,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1020',
    //       nutrientName: 'Folate',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 8,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1021',
    //       nutrientName: 'Choline',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 9,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1022',
    //       nutrientName: 'Betaine',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 10,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1023',
    //       nutrientName: 'Vitamin B-12',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 11,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1024',
    //       nutrientName: 'Vitamin A',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 12,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1025',
    //       nutrientName: 'Vitamin E',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 13,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1026',
    //       nutrientName: 'Vitamin D',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 14,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1027',
    //       nutrientName: 'Vitamin K',
    //       category: 30,
    //       status: 'Active',
    //       parent: 30,
    //       rank: 15,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1028',
    //       nutrientName: 'Calcium',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 1,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1029',
    //       nutrientName: 'Iron',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 2,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1030',
    //       nutrientName: 'Magnesium',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 3,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1031',
    //       nutrientName: 'Phosphorus, P',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 4,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1032',
    //       nutrientName: 'Potassium',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 5,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1033',
    //       nutrientName: 'Sodium',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 6,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1034',
    //       nutrientName: 'Zinc',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 7,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1035',
    //       nutrientName: 'Copper',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 8,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1036',
    //       nutrientName: 'Manganese',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 9,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1037',
    //       nutrientName: 'Iodine',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 10,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1038',
    //       nutrientName: 'Salenium',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 11,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1039',
    //       nutrientName: 'Sulfur',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 12,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1040',
    //       nutrientName: 'Nickel',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 13,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1041',
    //       nutrientName: 'Molybdenum',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 14,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1042',
    //       nutrientName: 'Cobalt',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 15,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1043',
    //       nutrientName: 'Boron',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 16,
    //       parentIsCategory: true,
    //     },
    //     {
    //       blendId: '1044',
    //       nutrientName: 'Fluoride',
    //       category: 40,
    //       status: 'Active',
    //       parent: 40,
    //       rank: 17,
    //       parentIsCategory: true,
    //     },
    //   ];
    //   for (let i = 0; i < obj.length; i++) {
    //     console.log(obj[i]);
    //     if (obj[i].parentIsCategory) {
    //       let blendCategory: any = await BlendNutrientCategoryModel.findOne({
    //         blendId: obj[i].category,
    //       });
    //       obj[i].category = blendCategory._id;
    //       obj[i].parent = null;
    //       await BlendNutrientModel.create(obj[i]);
    //     } else {
    //       let blendCategory: any = await BlendNutrientCategoryModel.findOne({
    //         blendId: obj[i].category,
    //       });
    //       obj[i].category = blendCategory._id;
    //       let parentNutrient = await BlendNutrientModel.findOne({
    //         blendId: String(obj[i].parent),
    //       });
    //       obj[i].parent = parentNutrient._id;
    //       await BlendNutrientModel.create(obj[i]);
    //     }
    //   }
    //   return 'done';
    // }
    // @Mutation(() => String)
    // async removeAllBlendNutrients() {
    //   await BlendNutrientModel.deleteMany({});
    //   return 'done';
    // }
    // @Mutation(() => String)
    // async mapToBlend() {
    //   let n = [
    //     { mapTo: 1000, nutrientName: 'Energy (Atwater General Factors)' },
    //     { mapTo: 1000, nutrientName: 'Energy' },
    //     { mapTo: 1001, nutrientName: 'Protein' },
    //     { mapTo: 1002, nutrientName: 'Total lipid (fat)' },
    //     { mapTo: 1003, nutrientName: 'Carbohydrate, by difference' },
    //     { mapTo: 1004, nutrientName: 'Fiber, total dietary' },
    //     { mapTo: 1045, nutrientName: 'Fiber, soluble' },
    //     { mapTo: 1046, nutrientName: 'Fiber, insoluble' },
    //     { mapTo: 1005, nutrientName: 'Sugars, Total NLEA' },
    //     { mapTo: 1005, nutrientName: 'Sugars, total including NLEA' },
    //     { mapTo: 1006, nutrientName: 'Sucrose' },
    //     { mapTo: 1007, nutrientName: 'Glucose' },
    //     { mapTo: 1008, nutrientName: 'Fructose' },
    //     { mapTo: 1009, nutrientName: 'Lactose' },
    //     { mapTo: 1010, nutrientName: 'Maltose' },
    //     { mapTo: 1011, nutrientName: 'Galactose' },
    //     { mapTo: 1012, nutrientName: 'Starch' },
    //     { mapTo: 1013, nutrientName: 'Vitamin C, total ascorbic acid' },
    //     { mapTo: 1014, nutrientName: 'Thiamin' },
    //     { mapTo: 1015, nutrientName: 'Riboflavin' },
    //     { mapTo: 1016, nutrientName: 'Niacin' },
    //     { mapTo: 1017, nutrientName: 'Pantothenic acid' },
    //     { mapTo: 1018, nutrientName: 'Vitamin B-6' },
    //     { mapTo: 1019, nutrientName: 'Biotin' },
    //     { mapTo: 1020, nutrientName: 'Folate, total' },
    //     { mapTo: 1021, nutrientName: 'Choline, total' },
    //     { mapTo: 1022, nutrientName: 'Betaine' },
    //     { mapTo: 1023, nutrientName: 'Vitamin B-12' },
    //     { mapTo: 1024, nutrientName: 'Vitamin A, IU' },
    //     { mapTo: 1024, nutrientName: 'Vitamin A, RAE' },
    //     { mapTo: 1025, nutrientName: 'Vitamin E (alpha-tocopherol)' },
    //     { mapTo: 1026, nutrientName: 'Vitamin D (D2 + D3), International Units' },
    //     { mapTo: 1027, nutrientName: 'Vitamin K (phylloquinone)' },
    //     { mapTo: 1027, nutrientName: 'Vitamin K (Dihydrophylloquinone)' },
    //     { mapTo: 1027, nutrientName: 'Vitamin K (Menaquinone-4)' },
    //     { mapTo: 1028, nutrientName: 'Calcium, Ca' },
    //     { mapTo: 1029, nutrientName: 'Iron, Fe' },
    //     { mapTo: 1030, nutrientName: 'Magnesium, Mg' },
    //     { mapTo: 1031, nutrientName: 'Phosphorus, P' },
    //     { mapTo: 1032, nutrientName: 'Potassium, K' },
    //     { mapTo: 1033, nutrientName: 'Sodium, Na' },
    //     { mapTo: 1034, nutrientName: 'Zinc, Zn' },
    //     { mapTo: 1035, nutrientName: 'Copper, Cu' },
    //     { mapTo: 1036, nutrientName: 'Manganese, Mn' },
    //     { mapTo: 1037, nutrientName: 'Iodine, I' },
    //     { mapTo: 1038, nutrientName: 'Selenium, Se' },
    //     { mapTo: 1039, nutrientName: 'Sulfur, S' },
    //     { mapTo: 1040, nutrientName: 'Nickel, Ni' },
    //     { mapTo: 1041, nutrientName: 'Molybdenum, Mo' },
    //     { mapTo: 1042, nutrientName: 'Cobalt, Co' },
    //     { mapTo: 1043, nutrientName: 'Boron, B' },
    //     { mapTo: 1044, nutrientName: 'Fluoride, F' },
    //     { mapTo: 1045, nutrientName: 'Fiber, soluble' },
    //     { mapTo: 1046, nutrientName: 'Fiber, insoluble' },
    //   ];
    //   for (let i = 0; i < n.length; i++) {
    //     let nutrient = await UniqueNutrientModel.findOne({
    //       nutrient: n[i].nutrientName,
    //     });
    //     if (!nutrient) {
    //       console.log(n[i]);
    //       continue;
    //     } else {
    //       let srcUniqueNutrientId = nutrient._id;
    //       let blendNutrient = await BlendNutrientModel.findOneAndUpdate(
    //         { blendId: String(n[i].mapTo) },
    //         {
    //           $set: {
    //             units: nutrient.units,
    //             related_sources: nutrient.related_sources,
    //             uniqueNutrientId: nutrient._id,
    //           },
    //         },
    //         { new: true }
    //       );
    //       let blendNutrientId = blendNutrient._id;
    //       console.log(blendNutrientId);
    //       await MapToBlendModel.create({ srcUniqueNutrientId, blendNutrientId });
    //     }
    //   }
    //   return 'done';
    // }
    ,
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "removeAllMapToBlend", null);
BlendNutrientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendNutrientResolver);
exports.default = BlendNutrientResolver;
