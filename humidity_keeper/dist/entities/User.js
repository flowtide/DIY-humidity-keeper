"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(user) {
        if (user === null) {
            this.id = '';
            this.userId = '';
            this.name = '';
            this.email = '';
            this.created = new Date();
            this.password = '';
            this.isAdmin = false;
        }
        else {
            this.id = user.id;
            this.userId = user.userId;
            this.name = user.name;
            this.email = user.email;
            this.created = user.created;
            this.password = user.password;
            this.isAdmin = user.isAdmin;
        }
    }
}
exports.default = User;
