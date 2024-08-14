"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncConfig = void 0;
var SyncConfig = /** @class */ (function () {
    function SyncConfig(api, config) {
        this.api = api;
        this.config = config;
    }
    SyncConfig.prototype.compile = function () {
        if (!this.config.sync) {
            return undefined;
        }
        var _a = this.config.sync, _b = _a.conflictDetection, conflictDetection = _b === void 0 ? 'VERSION' : _b, _c = _a.conflictHandler, conflictHandler = _c === void 0 ? 'OPTIMISTIC_CONCURRENCY' : _c;
        return __assign({ ConflictDetection: conflictDetection }, (conflictDetection === 'VERSION'
            ? __assign({ ConflictHandler: conflictHandler }, (conflictHandler === 'LAMBDA'
                ? {
                    LambdaConflictHandlerConfig: {
                        LambdaConflictHandlerArn: this.api.getLambdaArn(this.config.sync, this.api.naming.getResolverEmbeddedSyncLambdaName(this.config)),
                    },
                }
                : {})) : {}));
    };
    return SyncConfig;
}());
exports.SyncConfig = SyncConfig;
//# sourceMappingURL=SyncConfig.js.map