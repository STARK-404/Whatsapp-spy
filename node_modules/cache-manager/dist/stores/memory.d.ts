import { LRUCache } from 'lru-cache';
import { type Config, type Cache, type Store } from '../caching.js';
type LRU = LRUCache<string, any>;
type Pre = LRUCache.OptionsTTLLimit<string, any, unknown>;
type Options = Omit<Pre, 'ttlAutopurge'> & Partial<Pick<Pre, 'ttlAutopurge'>>;
export type MemoryConfig = {
    max?: number;
    sizeCalculation?: (value: unknown, key: string) => number;
    shouldCloneBeforeSet?: boolean;
} & Options & Config;
export type MemoryStore = Store & {
    dump: LRU['dump'];
    load: LRU['load'];
    calculatedSize: LRU['calculatedSize'];
    get size(): number;
};
export type MemoryCache = Cache<MemoryStore>;
/**
 * Wrapper for lru-cache.
 */
export declare function memoryStore(arguments_?: MemoryConfig): MemoryStore;
export {};
