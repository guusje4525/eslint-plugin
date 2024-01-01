"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const index_1 = __importDefault(require("./mui-import-checker/index"));
const index_2 = __importDefault(require("./no-inline-functions-in-jsx/index"));
const jsx_key_1 = __importDefault(require("./jsx-key"));
const electrodb_go_params_1 = __importDefault(require("./electrodb-go-params"));
const correct_store_name_1 = __importDefault(require("./correct-store-name"));
exports.rules = {
    'mui-import-checker': index_1.default,
    'no-inline-functions-in-jsx': index_2.default,
    'jsx-key': jsx_key_1.default,
    'go-method-should-have-pages': electrodb_go_params_1.default,
    'useCorrectStoreName': correct_store_name_1.default
};
//# sourceMappingURL=index.js.map