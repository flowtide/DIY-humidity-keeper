"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Instance_1 = require("@daos/Instance");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:users");
const uuid_1 = require("uuid");
class UserDao {
    getOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield Instance_1.knex.select().from('users').where('id', id);
            return users.length > 0 ? users.length[0] : null;
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield Instance_1.knex.select().from('users');
            return users;
        });
    }
    add(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!user.id)
                user.id = uuid_1.v4();
            yield Instance_1.knex('users').insert(user);
            return user;
        });
    }
    update(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Instance_1.knex('users').where('id', user.id).update(user);
            return {};
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Instance_1.knex('users').where('id', id).delete();
            return {};
        });
    }
}
exports.default = UserDao;
