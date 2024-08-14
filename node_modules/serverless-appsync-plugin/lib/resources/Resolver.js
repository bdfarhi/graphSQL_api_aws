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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
var path_1 = __importDefault(require("path"));
var MappingTemplate_1 = require("./MappingTemplate");
var SyncConfig_1 = require("./SyncConfig");
var JsResolver_1 = require("./JsResolver");
// A decent default for pipeline JS resolvers
var DEFAULT_JS_RESOLVERS = "\nexport function request() {\n  return {};\n}\n\nexport function response(ctx) {\n  return ctx.prev.result;\n}\n";
var Resolver = /** @class */ (function () {
    function Resolver(api, config) {
        var _this = this;
        this.api = api;
        this.config = config;
        this.resolveJsCode = function (filePath) {
            var codePath = path_1.default.join(_this.api.plugin.serverless.config.servicePath, filePath);
            var template = new JsResolver_1.JsResolver(_this.api, {
                path: codePath,
                substitutions: _this.config.substitutions,
            });
            return template.compile();
        };
    }
    Resolver.prototype.compile = function () {
        var _a;
        var _this = this;
        var _b, _c;
        var Properties = {
            ApiId: this.api.getApiId(),
            TypeName: this.config.type,
            FieldName: this.config.field,
        };
        var isVTLResolver = 'request' in this.config || 'response' in this.config;
        var isJsResolver = 'code' in this.config || (!isVTLResolver && this.config.kind !== 'UNIT');
        if (isJsResolver) {
            if (this.config.code) {
                Properties.Code = this.resolveJsCode(this.config.code);
            }
            else {
                // default for pipeline JS resolvers
                Properties.Code = DEFAULT_JS_RESOLVERS;
            }
            Properties.Runtime = {
                Name: 'APPSYNC_JS',
                RuntimeVersion: '1.0.0',
            };
        }
        else if (isVTLResolver) {
            var requestMappingTemplates = this.resolveMappingTemplate('request');
            if (requestMappingTemplates) {
                Properties.RequestMappingTemplate = requestMappingTemplates;
            }
            var responseMappingTemplate = this.resolveMappingTemplate('response');
            if (responseMappingTemplate) {
                Properties.ResponseMappingTemplate = responseMappingTemplate;
            }
        }
        if (this.config.caching) {
            if (this.config.caching === true) {
                // Use defaults
                Properties.CachingConfig = {
                    Ttl: ((_b = this.api.config.caching) === null || _b === void 0 ? void 0 : _b.ttl) || 3600,
                };
            }
            else if (typeof this.config.caching === 'object') {
                Properties.CachingConfig = {
                    CachingKeys: this.config.caching.keys,
                    Ttl: this.config.caching.ttl || ((_c = this.api.config.caching) === null || _c === void 0 ? void 0 : _c.ttl) || 3600,
                };
            }
        }
        if (this.config.sync) {
            var asyncConfig = new SyncConfig_1.SyncConfig(this.api, this.config);
            Properties.SyncConfig = asyncConfig.compile();
        }
        if (this.config.kind === 'UNIT') {
            var dataSource = this.config.dataSource;
            if (!this.api.hasDataSource(dataSource)) {
                throw new this.api.plugin.serverless.classes.Error("Resolver '".concat(this.config.type, ".").concat(this.config.field, "' references unknown DataSource '").concat(dataSource, "'"));
            }
            var logicalIdDataSource = this.api.naming.getDataSourceLogicalId(dataSource);
            Properties = __assign(__assign({}, Properties), { Kind: 'UNIT', DataSourceName: { 'Fn::GetAtt': [logicalIdDataSource, 'Name'] }, MaxBatchSize: this.config.maxBatchSize });
        }
        else {
            Properties = __assign(__assign({}, Properties), { Kind: 'PIPELINE', PipelineConfig: {
                    Functions: this.config.functions.map(function (name) {
                        if (!_this.api.hasPipelineFunction(name)) {
                            throw new _this.api.plugin.serverless.classes.Error("Resolver '".concat(_this.config.type, ".").concat(_this.config.field, "' references unknown Pipeline function '").concat(name, "'"));
                        }
                        var logicalIdDataSource = _this.api.naming.getPipelineFunctionLogicalId(name);
                        return { 'Fn::GetAtt': [logicalIdDataSource, 'FunctionId'] };
                    }),
                } });
        }
        var logicalIdResolver = this.api.naming.getResolverLogicalId(this.config.type, this.config.field);
        var logicalIdGraphQLSchema = this.api.naming.getSchemaLogicalId();
        return _a = {},
            _a[logicalIdResolver] = {
                Type: 'AWS::AppSync::Resolver',
                DependsOn: [logicalIdGraphQLSchema],
                Properties: Properties,
            },
            _a;
    };
    Resolver.prototype.resolveMappingTemplate = function (type) {
        var templateName = this.config[type];
        if (templateName) {
            var templatePath = path_1.default.join(this.api.plugin.serverless.config.servicePath, templateName);
            var template = new MappingTemplate_1.MappingTemplate(this.api, {
                path: templatePath,
                substitutions: this.config.substitutions,
            });
            return template.compile();
        }
    };
    return Resolver;
}());
exports.Resolver = Resolver;
//# sourceMappingURL=Resolver.js.map