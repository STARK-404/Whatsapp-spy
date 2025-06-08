"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = memoryStore;
const lru_cache_1 = require("lru-cache");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
function clone(object) {
    if (typeof object === 'object' && object !== null) {
        return (0, lodash_clonedeep_1.default)(object);
    }
    return object;
}
/**
 * Wrapper for lru-cache.
 */
function memoryStore(arguments_) {
    const shouldCloneBeforeSet = arguments_?.shouldCloneBeforeSet !== false; // Clone by default
    const isCacheable = arguments_?.isCacheable ?? (value => value !== undefined);
    const lruOptions = {
        ttlAutopurge: true,
        ...arguments_,
        max: arguments_?.max ?? 500,
        ttl: arguments_?.ttl === undefined ? 0 : arguments_.ttl,
    };
    const lruCache = new lru_cache_1.LRUCache(lruOptions);
    return {
        async del(key) {
            lruCache.delete(key);
        },
        get: async (key) => lruCache.get(key),
        keys: async () => [...lruCache.keys()],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        mget: async (...arguments_) => arguments_.map(x => lruCache.get(x)),
        async mset(arguments_, ttl) {
            const opt = { ttl: ttl ?? lruOptions.ttl };
            for (const [key, value] of arguments_) {
                if (!isCacheable(value)) {
                    throw new Error(`no cacheable value ${JSON.stringify(value)}`);
                }
                if (shouldCloneBeforeSet) {
                    lruCache.set(key, clone(value), opt);
                }
                else {
                    lruCache.set(key, value, opt);
                }
            }
        },
        async mdel(...arguments_) {
            for (const key of arguments_) {
                lruCache.delete(key);
            }
        },
        async reset() {
            lruCache.clear();
        },
        ttl: async (key) => lruCache.getRemainingTTL(key),
        async set(key, value, opt) {
            if (!isCacheable(value)) {
                throw new Error(`no cacheable value ${JSON.stringify(value)}`);
            }
            if (shouldCloneBeforeSet) {
                value = clone(value);
            }
            const ttl = opt ?? lruOptions.ttl;
            lruCache.set(key, value, { ttl });
        },
        get calculatedSize() {
            return lruCache.calculatedSize;
        },
        /**
     * This method is not available in the caching modules.
     */
        get size() {
            return lruCache.size;
        },
        /**
     * This method is not available in the caching modules.
     */
        dump: () => lruCache.dump(),
        /**
     * This method is not available in the caching modules.
     */
        load(...arguments_) {
            lruCache.load(...arguments_);
        },
    };
}
//# sourceMappingURL=memory.js.map