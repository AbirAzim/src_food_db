"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    roleName: {
        type: String,
        required: [true, 'rolename is requires'],
        unique: true,
    },
    Users: {
        delete: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
    },
    Shop: {
        delete: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
    },
    Dashboard: {
        delete: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
    },
    Blend: {
        delete: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
    },
    Admin: {
        delete: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
    },
    createdAt: { type: Date, default: Date.now },
});
const role = (0, mongoose_1.model)('Role', roleSchema);
exports.default = role;
