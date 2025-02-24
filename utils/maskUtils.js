"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskUsername = void 0;
const maskUsername = (username) => {
    return username.substring(0, 2) + '***' + username.substring(username.length - 1);
};
exports.maskUsername = maskUsername;
