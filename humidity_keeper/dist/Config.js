"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knex = exports.API = exports.Server = exports.Database = void 0;
const tslib_1 = require("tslib");
const parse_database_url_1 = tslib_1.__importDefault(require("parse-database-url"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
var Database;
(function (Database) {
    Database.schema = 'api';
    Database.url = process.env.DATABASE_URL || 'sqlite3://db.sqlite3';
    Database.config = parse_database_url_1.default(Database.url);
    Database.driver = Database.config.driver, Database.user = Database.config.user, Database.password = Database.config.password, Database.hostname = Database.config.hostname, Database.host = Database.config.host, Database.port = Database.config.port, Database.database = Database.config.database, Database.filename = Database.config.filename;
    Database.poolMin = Number(process.env.DATABASE_POOL_MIN || '0');
    Database.poolMax = Number(process.env.DATABASE_POOL_MAX || '10');
    Database.poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000');
})(Database = exports.Database || (exports.Database = {}));
var Server;
(function (Server) {
    Server.port = Number(process.env.PORT || '8000');
    Server.bodyLimit = '100kb';
    Server.corsHeaders = ['Link'];
    Server.isDev = process.env.NODE_ENV === 'development';
})(Server = exports.Server || (exports.Server = {}));
var API;
(function (API) {
    API.authSecret = process.env.AUTH_SECRET || "My.Secret.1234";
})(API = exports.API || (exports.API = {}));
var Knex;
(function (Knex) {
    Knex.config = {
        client: Database.driver,
        connection: {
            host: process.env.DATABASE_HOSTNAME || Database.host,
            database: process.env.DATABASE_NAME || Database.database,
            user: process.env.DATABASE_USERNAME || Database.user,
            password: process.env.DATABASE_PASSWORD || Database.password,
            port: process.env.DATABASE_PORT || Database.port,
        },
        pool: {
            min: process.env.DATABASE_POOL_MIN,
            max: process.env.DATABASE_POOL_MAX,
            idle: process.env.DATABASE_POOL_IDLE,
        },
        migrations: {
            tableName: 'KnexMigrations',
        },
    };
})(Knex = exports.Knex || (exports.Knex = {}));
exports.default = { Database, Server, API, Knex };
