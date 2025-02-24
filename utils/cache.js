"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.setCache = void 0;
const cache = new Map();
const setCache = (key, value, ttl = 300) => {
    cache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
};
exports.setCache = setCache;
const getCache = (key) => {
    const cached = cache.get(key);
    if (!cached)
        return null;
    if (Date.now() > cached.expiresAt) {
        cache.delete(key);
        return null;
    }
    return cached.value;
};
exports.getCache = getCache;
