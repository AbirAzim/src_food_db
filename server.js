"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
require("reflect-metadata");
const FoodResolver_1 = __importDefault(require("./graphql/src_food/resolvers/FoodResolver"));
const RecipeResolver_1 = __importDefault(require("./graphql/recipe/resolvers/RecipeResolver"));
const RecipeCategoryResolver_1 = __importDefault(require("./graphql/recipe/resolvers/RecipeCategoryResolver"));
const BrandResolver_1 = __importDefault(require("./graphql/recipe/resolvers/BrandResolver"));
const AdminResolver_1 = __importDefault(require("./graphql/admin/resolvers/AdminResolver"));
const RoleResolver_1 = __importDefault(require("./graphql/admin/resolvers/RoleResolver"));
const MemberResolver_1 = __importDefault(require("./graphql/member/resolvers/MemberResolver"));
const ConfigurationResolver_1 = __importDefault(require("./graphql/configuiration/resolvers/ConfigurationResolver"));
const UserRecipeAndCollectionResolver_1 = __importDefault(require("./graphql/member/resolvers/UserRecipeAndCollectionResolver"));
const UserCommentResolver_1 = __importDefault(require("./graphql/member/resolvers/UserCommentResolver"));
const AdminCollectionResolver_1 = __importDefault(require("./graphql/admin/resolvers/AdminCollectionResolver"));
const UserNoteResolver_1 = __importDefault(require("./graphql/member/resolvers/UserNoteResolver"));
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
const database = process.env.DATABASE;
mongoose_1.default
    .connect(database)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
    console.log(err);
});
async function bootstrap() {
    let schema;
    // ... Building schema here
    try {
        schema = await (0, type_graphql_1.buildSchema)({
            resolvers: [
                FoodResolver_1.default,
                RecipeResolver_1.default,
                RecipeCategoryResolver_1.default,
                BrandResolver_1.default,
                AdminResolver_1.default,
                RoleResolver_1.default,
                MemberResolver_1.default,
                ConfigurationResolver_1.default,
                UserRecipeAndCollectionResolver_1.default,
                UserCommentResolver_1.default,
                AdminCollectionResolver_1.default,
                UserNoteResolver_1.default,
            ],
        });
    }
    catch (e) {
        console.log(e);
    }
    // Create the GraphQL server
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
        playground: true,
        introspection: true,
    });
    server.applyMiddleware({ app: app_1.default });
    const port = process.env.PORT || '4000';
    app_1.default.listen(Number(port) || 5000, () => {
        console.log('🚀 App is running on http://localhost:' + port + '/graphql');
    });
}
bootstrap();
// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   process.exit(1);
// });
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    console.log('💥 Process terminated!');
});
