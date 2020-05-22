"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const PostgresProvider_1 = tslib_1.__importDefault(require("./PostgresProvider"));
const Sqlite3Provider_1 = tslib_1.__importDefault(require("./Sqlite3Provider"));
function create(dbClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (dbClient === "sqlite3")
            return yield Sqlite3Provider_1.default.create();
        else
            return yield PostgresProvider_1.default.create();
    });
}
exports.create = create;
exports.default = { create };
