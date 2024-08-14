"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAction = exports.question = exports.getWildCardDomainName = exports.getHostedZoneName = exports.parseDuration = exports.parseDateTimeOrDuration = exports.wait = exports.toCfnKeys = exports.timeUnits = void 0;
var lodash_1 = require("lodash");
var luxon_1 = require("luxon");
var util_1 = require("util");
var readline = __importStar(require("readline"));
exports.timeUnits = {
    y: 'years',
    q: 'quarters',
    M: 'months',
    w: 'weeks',
    d: 'days',
    h: 'hours',
    m: 'minutes',
    s: 'seconds',
    ms: 'milliseconds',
};
var units = (0, lodash_1.values)(exports.timeUnits);
var isRecord = function (value) {
    return typeof value === 'object';
};
var toCfnKeys = function (object) {
    return (0, lodash_1.transform)(object, function (acc, value, key) {
        var newKey = typeof key === 'string' ? (0, lodash_1.upperFirst)(key) : key;
        acc[newKey] = isRecord(value) ? (0, exports.toCfnKeys)(value) : value;
        return acc;
    });
};
exports.toCfnKeys = toCfnKeys;
var wait = function (time) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.wait = wait;
var parseDateTimeOrDuration = function (input) {
    try {
        // Try to parse a date
        var date = luxon_1.DateTime.fromISO(input);
        if (!date.isValid) {
            // try to parse duration
            date = luxon_1.DateTime.now().minus((0, exports.parseDuration)(input));
        }
        return date;
    }
    catch (error) {
        throw new Error('Invalid date or duration');
    }
};
exports.parseDateTimeOrDuration = parseDateTimeOrDuration;
var parseDuration = function (input) {
    var _a;
    var duration;
    if (typeof input === 'number') {
        duration = luxon_1.Duration.fromDurationLike({ hours: input });
    }
    else if (typeof input === 'string') {
        var regexp = new RegExp("^(\\d+)(".concat(Object.keys(exports.timeUnits).join('|'), ")?$"));
        var match = input.match(regexp);
        if (match) {
            var amount = parseInt(match[1], 10);
            var unit = exports.timeUnits[match[2]] || 'hours';
            // 1 year could be 366 days on or before leap year,
            // which would fail. Swap for 365 days
            if (input.match(/^1y(ears?)?$/)) {
                amount = 365;
                unit = 'days';
            }
            duration = luxon_1.Duration.fromDurationLike((_a = {}, _a[unit] = amount, _a));
        }
        else {
            throw new Error("Could not parse ".concat(input, " as a valid duration"));
        }
    }
    else {
        throw new Error("Could not parse ".concat(input, " as a valid duration"));
    }
    return duration;
};
exports.parseDuration = parseDuration;
var getHostedZoneName = function (domain) {
    var parts = domain.split('.');
    if (parts.length > 2) {
        parts.shift();
    }
    return "".concat(parts.join('.'), ".");
};
exports.getHostedZoneName = getHostedZoneName;
var getWildCardDomainName = function (domain) {
    return "*.".concat(domain.split('.').slice(1).join('.'));
};
exports.getWildCardDomainName = getWildCardDomainName;
var question = function (question) { return __awaiter(void 0, void 0, void 0, function () {
    var rl, q, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                q = (0, util_1.promisify)(function (question, cb) {
                    rl.question(question, function (a) {
                        cb(null, a);
                    });
                }).bind(rl);
                return [4 /*yield*/, q("".concat(question, ": "))];
            case 1:
                answer = _a.sent();
                rl.close();
                return [2 /*return*/, answer];
        }
    });
}); };
exports.question = question;
var confirmAction = function () { return __awaiter(void 0, void 0, void 0, function () {
    var answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.question)('Do you want to continue? y/N')];
            case 1:
                answer = _a.sent();
                return [2 /*return*/, answer.toLowerCase() === 'y'];
        }
    });
}); };
exports.confirmAction = confirmAction;
//# sourceMappingURL=utils.js.map