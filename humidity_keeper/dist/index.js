"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const tslib_1 = require("tslib");
require("./LoadEnv");
const _server_1 = tslib_1.__importDefault(require("@server"));
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const Config_1 = require("./Config");
const Instance_1 = require("@daos/Instance");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:index");
function connectDatabase() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug(`connect database: ${Config_1.Database.driver}`);
        const knexInstance = yield Instance_1.openDatabase(Config_1.Database.driver);
        return knexInstance;
    });
}
exports.connectDatabase = connectDatabase;
var dbHandle = connectDatabase();
dbHandle.then((knexInstance) => {
    knexInstance.count().from('users').then((numUsers) => {
        debug('DB ACCESS CHECKING: numUsers=', numUsers);
    });
    _server_1.default.listen(Config_1.Server.port, () => {
        Logger_1.default.info(`Web server started on port: ${Config_1.Server.port}`);
    });
}).catch((error) => {
    Logger_1.default.error('app error:', error);
});
