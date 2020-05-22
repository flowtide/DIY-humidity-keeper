"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDatabase = exports.knex = void 0;
const tslib_1 = require("tslib");
const DataProvider_1 = tslib_1.__importDefault(require("./DataProvider"));
function openDatabase(dbClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        exports.knex = yield DataProvider_1.default.create(dbClient);
        return exports.knex;
    });
}
exports.openDatabase = openDatabase;
