"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWrapOptions = void 0;
exports.caching = caching;
exports.createCache = createCache;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const promise_coalesce_1 = require("promise-coalesce");
const index_js_1 = require("./stores/index.js");
const utils_js_1 = require("./utils.js");
exports.defaultWrapOptions = {
    nonBlockingSet: false,
};
/**
 * Generic caching interface that wraps any caching library with a compatible interface.
 */
async function caching(factory, arguments_) {
    if (factory === 'memory') {
        const store = (0, index_js_1.memoryStore)(arguments_);
        return createCache(store, arguments_);
    }
    if (typeof factory === 'function') {
        const store = await factory(arguments_);
        return createCache(store, arguments_);
    }
    const store = factory;
    return createCache(store, arguments_);
}
let cacheIndex = 0;
/**
 * Create cache instance by store (non-async).
 */
function createCache(store, arguments_) {
    const eventEmitter = new eventemitter3_1.default();
    const coalescePrefix = `cache-manager-index-${cacheIndex++}`;
    return {
        /**
         * Wraps a function in cache. I.e., the first time the function is run,
         * its results are stored in cache so subsequent calls retrieve from cache
         * instead of calling the function.

         * @example
         * const result = await cache.wrap('key', () => Promise.resolve(1));
         *
         */
        // eslint-disable-next-line max-params
        async wrap(key, function_, ttl, refreshThreshold, options = {}) {
            const options_ = { ...exports.defaultWrapOptions, ...options };
            const refreshThresholdConfig = refreshThreshold ?? arguments_?.refreshThreshold ?? 0;
            return (0, promise_coalesce_1.coalesceAsync)(`${coalescePrefix}:${key}`, async () => {
                const value = await store.get(key).catch(error => {
                    const errorEvent = { error, key, operation: 'get' };
                    eventEmitter.emit('error', errorEvent);
                });
                if (value === undefined) {
                    const result = await function_();
                    const cacheTtl = typeof ttl === 'function' ? ttl(result) : ttl;
                    await (0, utils_js_1.conditionalAwait)(async () => store.set(key, result, cacheTtl).catch(error => {
                        const errorEvent = {
                            error, key, operation: 'set', data: result,
                        };
                        eventEmitter.emit('error', errorEvent);
                    }), !options_.nonBlockingSet);
                    return result;
                }
                if (refreshThresholdConfig) {
                    const cacheTtl = typeof ttl === 'function' ? ttl(value) : ttl;
                    const remainingTtl = await store.ttl(key);
                    if (remainingTtl !== -1 && remainingTtl < refreshThresholdConfig) {
                        (0, promise_coalesce_1.coalesceAsync)(`+++${coalescePrefix}:${key}`, function_)
                            .then(async (result) => store.set(key, result, cacheTtl))
                            .catch(async (error) => {
                            const errorEvent = {
                                error, key, operation: 'set', data: value,
                            };
                            eventEmitter.emit('error', errorEvent);
                            eventEmitter.emit('onBackgroundRefreshError', error);
                            if (arguments_?.onBackgroundRefreshError) {
                                arguments_.onBackgroundRefreshError(error);
                            }
                            else {
                                throw error;
                            }
                        });
                    }
                }
                return value;
            });
        },
        store,
        del: async (key) => store.del(key),
        get: async (key) => store.get(key),
        set: async (key, value, ttl) => store.set(key, value, ttl),
        reset: async () => store.reset(),
        on: (event, handler) => eventEmitter.on('error', handler),
        removeListener: (event, handler) => eventEmitter.removeListener(event, handler),
    };
}
//# sourceMappingURL=caching.js.map