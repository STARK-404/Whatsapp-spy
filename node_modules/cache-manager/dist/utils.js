"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalAwait = void 0;
/**
 * If blocking is true, it will await the function before returning.
 * Otherwise, it will fire the execution and return before it ends.
 * Consumer of this function should await the returned promise.
 * @param function_
 * @param blocking
 */
const conditionalAwait = async (function_, blocking) => {
    if (blocking) {
        await function_();
    }
    else {
        void function_().then();
    }
};
exports.conditionalAwait = conditionalAwait;
//# sourceMappingURL=utils.js.map