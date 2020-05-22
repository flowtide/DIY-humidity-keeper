"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const knex_1 = tslib_1.__importDefault(require("knex"));
const Config_1 = require("../../Config");
function create() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const knex = knex_1.default({
            client: 'pg',
            connection: {
                user: Config_1.Database.user,
                password: Config_1.Database.password,
                host: Config_1.Database.hostname,
                port: Config_1.Database.port,
                database: Config_1.Database.database
            },
            pool: {
                min: Config_1.Database.poolMin,
                max: Config_1.Database.poolMax,
                idleTimeoutMillis: Config_1.Database.poolIdle
            },
            acquireConnectionTimeout: 2000
        });
        try {
            yield knex.raw('SELECT now()');
            return knex;
        }
        catch (error) {
            throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.');
        }
    });
}
exports.create = create;
exports.default = { create };
