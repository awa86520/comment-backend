const cache = new Map<string, any>();

export const setCache = (key: string, value: any, ttl: number = 300) => {
    cache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
};

export const getCache = (key: string) => {
    const cached = cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
        cache.delete(key);
        return null;
    }

    return cached.value;
};
