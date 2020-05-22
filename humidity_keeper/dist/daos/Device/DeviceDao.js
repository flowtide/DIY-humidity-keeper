"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Instance_1 = require("@daos/Instance");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:devices");
const uuid_1 = require("uuid");
class DeviceDao {
    getOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.findOne('id', id);
        });
    }
    findOne(columnName, columnValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let devices = yield Instance_1.knex.select().from('devices').where(columnName, columnValue);
            return devices.length > 0 ? devices[0] : null;
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let devices = yield Instance_1.knex.select().from('devices');
            return devices;
        });
    }
    add(device) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!device.id)
                device.id = uuid_1.v4();
            let devices = yield Instance_1.knex('devices').insert(device);
            return device;
        });
    }
    update(device) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Instance_1.knex('devices').where('id', device.id).update(device);
            return {};
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Instance_1.knex('devices').where('id', id).delete();
            yield Instance_1.knex('readings').where('deviceId', id).delete();
            return {};
        });
    }
}
exports.default = DeviceDao;
