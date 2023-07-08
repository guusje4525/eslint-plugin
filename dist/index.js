"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const index_1 = __importDefault(require("./mui-import-checker/index"));
const index_2 = __importDefault(require("./no-inline-functions-in-jsx/index"));
exports.rules = {
    'mui-import-checker': index_1.default,
    'no-inline-functions-in-jsx': index_2.default
};
//# sourceMappingURL=index.js.map