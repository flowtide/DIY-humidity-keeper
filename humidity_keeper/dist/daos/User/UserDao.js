"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Instance_1 = require("@daos/Instance");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default("humidity-keeper:users");
const uuid_1 = require("uuid");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const saltRounds = 11;
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
            if (user.password) {
                let salt = yield bcrypt_1.default.genSalt(saltRounds);
                user.password = yield bcrypt_1.default.hash(user.password, salt);
            }
            yield Instance_1.knex('users').insert(user);
            return user;
        });
    }
    update(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let oldUser = yield this.getOne(user.id);
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
    login(userId, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield Instance_1.knex.select().from('users').where('userId', userId);
            if (users.length == 0) {
                debug(`user not found: userId=${userId}`);
                return null;
            }
            let user = users[0];
            if (!password && !user.password) {
                debug(`login with no password: id=${userId}`);
                delete user.password;
                return user;
            }
            else {
                if (yield bcrypt_1.default.compare(password, user.password)) {
                    delete user.password;
                    return user;
                }
                debug('password not matching:', userId, password);
            }
            return null;
        });
    }
    password(id, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield Instance_1.knex.select().from('users').where('id', id);
            if (users.length == 0) {
                debug(`user not found: id=${id}`);
                return null;
            }
            let user = { id: id, password: '' };
            if (password) {
                let salt = yield bcrypt_1.default.genSalt(saltRounds);
                password = yield bcrypt_1.default.hash(password, salt);
            }
            user.password = password;
            debug(`save password: id=${id} password=${password}`);
            return yield Instance_1.knex('users').where('id', user.id).update(user);
        });
    }
}
exports.default = UserDao;
