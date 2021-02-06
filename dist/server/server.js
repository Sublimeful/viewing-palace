"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    constructor() {
        this._user_count = 0;
    }
    set user_count(newCount) {
        if (newCount < 0)
            return;
        this._user_count = newCount;
    }
    get user_count() {
        return this._user_count;
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map