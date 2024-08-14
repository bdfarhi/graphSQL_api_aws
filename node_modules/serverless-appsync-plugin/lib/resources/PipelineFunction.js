"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineFunction = void 0;
var path_1 = __importDefault(require("path"));
var MappingTemplate_1 = require("./MappingTemplate");
var SyncConfig_1 = require("./SyncConfig");
var JsResolver_1 = require("./JsResolver");
var PipelineFunction = /** @class */ (function () {
    function PipelineFunction(api, config) {
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
    PipelineFunction.prototype.compile = function () {
        var _a;
        var _b = this.config, dataSource = _b.dataSource, code = _b.code;
        if (!this.api.hasDataSource(dataSource)) {
            throw new this.api.plugin.serverless.classes.Error("Pipeline Function '".concat(this.config.name, "' references unknown DataSource '").concat(dataSource, "'"));
        }
        var logicalId = this.api.naming.getPipelineFunctionLogicalId(this.config.name);
        var logicalIdDataSource = this.api.naming.getDataSourceLogicalId(this.config.dataSource);
        var Properties = {
            ApiId: this.api.getApiId(),
            Name: this.config.name,
            DataSourceName: { 'Fn::GetAtt': [logicalIdDataSource, 'Name'] },
            Description: this.config.description,
            FunctionVersion: '2018-05-29',
            MaxBatchSize: this.config.maxBatchSize,
        };
        if (code) {
            Properties.Code = this.resolveJsCode(code);
            Properties.Runtime = {
                Name: 'APPSYNC_JS',
                RuntimeVersion: '1.0.0',
            };
        }
        else {
            var requestMappingTemplates = this.resolveMappingTemplate('request');
            if (requestMappingTemplates) {
                Properties.RequestMappingTemplate = requestMappingTemplates;
            }
            var responseMappingTemplate = this.resolveMappingTemplate('response');
            if (responseMappingTemplate) {
                Properties.ResponseMappingTemplate = responseMappingTemplate;
            }
        }
        if (this.config.sync) {
            var asyncConfig = new SyncConfig_1.SyncConfig(this.api, this.config);
            Properties.SyncConfig = asyncConfig.compile();
        }
        return _a = {},
            _a[logicalId] = {
                Type: 'AWS::AppSync::FunctionConfiguration',
                Properties: Properties,
            },
            _a;
    };
    PipelineFunction.prototype.resolveMappingTemplate = function (type) {
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
    return PipelineFunction;
}());
exports.PipelineFunction = PipelineFunction;
//# sourceMappingURL=PipelineFunction.js.map