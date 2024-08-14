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
exports.MappingTemplate = void 0;
var fs_1 = __importDefault(require("fs"));
var MappingTemplate = /** @class */ (function () {
    function MappingTemplate(api, config) {
        this.api = api;
        this.config = config;
    }
    MappingTemplate.prototype.compile = function () {
        if (!fs_1.default.existsSync(this.config.path)) {
            throw new this.api.plugin.serverless.classes.Error("Mapping tempalte file '".concat(this.config.path, "' does not exist"));
        }
        var requestTemplateContent = fs_1.default.readFileSync(this.config.path, 'utf8');
        return this.processTemplateSubstitutions(requestTemplateContent);
    };
    MappingTemplate.prototype.processTemplateSubstitutions = function (template) {
        var substitutions = __assign(__assign({}, this.api.config.substitutions), this.config.substitutions);
        var availableVariables = Object.keys(substitutions);
        var templateVariables = [];
        var searchResult;
        var variableSyntax = RegExp(/\${([\w\d-_]+)}/g);
        while ((searchResult = variableSyntax.exec(template)) !== null) {
            templateVariables.push(searchResult[1]);
        }
        var replacements = availableVariables
            .filter(function (value) { return templateVariables.includes(value); })
            .filter(function (value, index, array) { return array.indexOf(value) === index; })
            .reduce(function (accum, value) {
            var _a;
            return Object.assign(accum, (_a = {}, _a[value] = substitutions[value], _a));
        }, {});
        // if there are substitutions for this template then add fn:sub
        if (Object.keys(replacements).length > 0) {
            return this.substituteGlobalTemplateVariables(template, replacements);
        }
        return template;
    };
    /**
     * Creates Fn::Join object from given template where all given substitutions
     * are wrapped in Fn::Sub objects. This enables template to have also
     * characters that are not only alphanumeric, underscores, periods, and colons.
     *
     * @param {*} template
     * @param {*} substitutions
     */
    MappingTemplate.prototype.substituteGlobalTemplateVariables = function (template, substitutions) {
        var _a;
        var variables = Object.keys(substitutions).join('|');
        var regex = new RegExp("\\${(".concat(variables, ")}"), 'g');
        var substituteTemplate = template.replace(regex, '|||$1|||');
        var templateJoin = substituteTemplate
            .split('|||')
            .filter(function (part) { return part !== ''; });
        var parts = [];
        for (var i = 0; i < templateJoin.length; i += 1) {
            if (templateJoin[i] in substitutions) {
                var subs = (_a = {}, _a[templateJoin[i]] = substitutions[templateJoin[i]], _a);
                parts[i] = { 'Fn::Sub': ["${".concat(templateJoin[i], "}"), subs] };
            }
            else {
                parts[i] = templateJoin[i];
            }
        }
        return { 'Fn::Join': ['', parts] };
    };
    return MappingTemplate;
}());
exports.MappingTemplate = MappingTemplate;
//# sourceMappingURL=MappingTemplate.js.map