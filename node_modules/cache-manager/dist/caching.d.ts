import { type MemoryCache, type MemoryConfig, type MemoryStore } from './stores/index.js';
export type Config = {
    ttl?: Milliseconds;
    refreshThreshold?: Milliseconds;
    isCacheable?: (value: unknown) => boolean;
    onBackgroundRefreshError?: (error: unknown) => void;
};
export type Milliseconds = number;
/**
 * @deprecated will remove after 5.2.0. Use Milliseconds instead
 */
export type Ttl = Milliseconds;
export type Store = {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, data: T, ttl?: Milliseconds): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    mset(arguments_: Array<[string, unknown]>, ttl?: Milliseconds): Promise<void>;
    mget(...arguments_: string[]): Promise<unknown[]>;
    mdel(...arguments_: string[]): Promise<void>;
    keys(pattern?: string): Promise<string[]>;
    ttl(key: string): Promise<number>;
};
export type StoreConfig = Config;
export type FactoryConfig<T> = T & Config;
export type FactoryStore<S extends Store, T extends Record<string, unknown> = never> = (config?: FactoryConfig<T>) => S | Promise<S>;
export type Stores<S extends Store, T extends Record<string, unknown>> = 'memory' | Store | FactoryStore<S, T>;
export type CachingConfig<T> = MemoryConfig | StoreConfig | FactoryConfig<T>;
export type WrapTTL<T> = Milliseconds | ((v: T) => Milliseconds);
export type ErrorEvent<T = never> = {
    operation: 'get' | 'set' | 'del' | 'reset';
    error: unknown;
    key?: string;
    data?: T;
} | {
    operation: 'mget' | 'mset' | 'mdel';
    error: unknown;
    keys: string[];
    data?: T[];
};
export type ErrorEventHandler<T = unknown> = (event: ErrorEvent<T>) => void;
export type Cache<S extends Store = Store> = {
    store: S;
    set: (key: string, value: unknown, ttl?: Milliseconds) => Promise<void>;
    get: <T>(key: string) => Promise<T | undefined>;
    del: (key: string) => Promise<void>;
    reset: () => Promise<void>;
    on: <T>(event: 'error', handler: ErrorEventHandler<T>) => void;
    removeListener: <T>(event: 'error', handler: ErrorEventHandler<T>) => void;
    wrap<T>(key: string, function_: () => Promise<T>, ttl?: WrapTTL<T>, refreshThreshold?: Milliseconds, options?: WrapOptions): Promise<T>;
};
export type WrapOptions = {
    nonBlockingSet?: boolean;
};
export declare const defaultWrapOptions: WrapOptions;
export declare function caching(name: 'memory', arguments_?: MemoryConfig): Promise<MemoryCache>;
export declare function caching<S extends Store>(store: S): Promise<Cache<S>>;
export declare function caching<S extends Store, T extends Record<string, unknown> = never>(factory: FactoryStore<S, T>, arguments_?: FactoryConfig<T>): Promise<Cache<S>>;
export declare function createCache(store: MemoryStore, arguments_?: MemoryConfig): MemoryCache;
export declare function createCache(store: Store, arguments_?: Config): Cache;
