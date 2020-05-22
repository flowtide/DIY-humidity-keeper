"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const knex_1 = tslib_1.__importDefault(require("knex"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:daos");
const Config_1 = require("../../Config");
const uuid_1 = require("uuid");
function create() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug(`sqlite3: filename=${Config_1.Database.filename}`);
        var dbDir = path_1.default.dirname(Config_1.Database.filename);
        fs_1.default.mkdirSync(dbDir, { recursive: true });
        const knex = knex_1.default({
            client: 'sqlite3',
            connection: {
                filename: Config_1.Database.filename
            },
            useNullAsDefault: true
        });
        try {
            if (!(yield knex.schema.hasTable('devices'))) {
                debug("table creating: 'devices'");
                yield knex.schema.createTable('devices', (table) => {
                    table.uuid('id').notNullable().primary();
                    table.string('name').notNullable();
                    table.string('desc');
                    table.string('address');
                    table.integer('type').defaultTo(0);
                    table.dateTime('registerAt');
                    table.dateTime('updateAt');
                });
            }
            if (!(yield knex.schema.hasTable('readings'))) {
                debug("table creating: 'readings'");
                yield knex.schema.createTable('readings', (table) => {
                    table.dateTime('created').notNullable();
                    table.uuid('deviceId').notNullable();
                    table.float('temperature');
                    table.float('humidity');
                    table.float('battery');
                    table.unique(['created', 'deviceId']);
                    table.foreign('deviceId').references('devices.id');
                });
            }
            if (!(yield knex.schema.hasTable('users'))) {
                debug("table creating: 'users'");
                yield knex.schema.createTable('users', (table) => {
                    table.uuid('id').notNullable().primary();
                    table.dateTime('created').notNullable();
                    table.string('userId').notNullable();
                    table.string('name').notNullable();
                    table.string('email').defaultTo('');
                    table.string('password').defaultTo('');
                    table.boolean('isAdmin').defaultTo(false);
                    table.unique(['userId']);
                });
                yield knex('users').insert({
                    id: uuid_1.v4(),
                    created: new Date(),
                    userId: 'admin',
                    name: 'System Admin',
                    isAdmin: true,
                });
            }
            return knex;
        }
        catch (error) {
            Logger_1.default.error('DB connect error:', error);
            throw new Error(`Unable to connect to sqlite3 via Knex. ${error}`);
        }
    });
}
exports.create = create;
exports.default = { create };
