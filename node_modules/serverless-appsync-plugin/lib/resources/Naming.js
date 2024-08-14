"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naming = void 0;
var Naming = /** @class */ (function () {
    function Naming(apiName) {
        this.apiName = apiName;
    }
    Naming.prototype.getCfnName = function (name) {
        return name.replace(/[^a-zA-Z0-9]/g, '');
    };
    Naming.prototype.getLogicalId = function (name) {
        return this.getCfnName(name);
    };
    Naming.prototype.getApiLogicalId = function () {
        return this.getLogicalId("GraphQlApi");
    };
    Naming.prototype.getSchemaLogicalId = function () {
        return this.getLogicalId("GraphQlSchema");
    };
    Naming.prototype.getDomainNameLogicalId = function () {
        return this.getLogicalId("GraphQlDomainName");
    };
    Naming.prototype.getDomainCertificateLogicalId = function () {
        return this.getLogicalId("GraphQlDomainCertificate");
    };
    Naming.prototype.getDomainAssociationLogicalId = function () {
        return this.getLogicalId("GraphQlDomainAssociation");
    };
    Naming.prototype.getDomainReoute53RecordLogicalId = function () {
        return this.getLogicalId("GraphQlDomainRoute53Record");
    };
    Naming.prototype.getLogGroupLogicalId = function () {
        return this.getLogicalId("GraphQlApiLogGroup");
    };
    Naming.prototype.getLogGroupRoleLogicalId = function () {
        return this.getLogicalId("GraphQlApiLogGroupRole");
    };
    Naming.prototype.getLogGroupPolicyLogicalId = function () {
        return this.getLogicalId("GraphQlApiLogGroupPolicy");
    };
    Naming.prototype.getCachingLogicalId = function () {
        return this.getLogicalId("GraphQlCaching");
    };
    Naming.prototype.getLambdaAuthLogicalId = function () {
        return this.getLogicalId("LambdaAuthorizerPermission");
    };
    Naming.prototype.getApiKeyLogicalId = function (name) {
        return this.getLogicalId("GraphQlApi".concat(name));
    };
    // Warning: breaking change.
    // api name added
    Naming.prototype.getDataSourceLogicalId = function (name) {
        return "GraphQlDs".concat(this.getLogicalId(name));
    };
    Naming.prototype.getDataSourceRoleLogicalId = function (name) {
        return this.getDataSourceLogicalId("".concat(name, "Role"));
    };
    Naming.prototype.getResolverLogicalId = function (type, field) {
        return this.getLogicalId("GraphQlResolver".concat(type).concat(field));
    };
    Naming.prototype.getPipelineFunctionLogicalId = function (name) {
        return this.getLogicalId("GraphQlFunctionConfiguration".concat(name));
    };
    Naming.prototype.getWafLogicalId = function () {
        return this.getLogicalId('GraphQlWaf');
    };
    Naming.prototype.getWafAssociationLogicalId = function () {
        return this.getLogicalId('GraphQlWafAssoc');
    };
    Naming.prototype.getDataSourceEmbeddedLambdaResolverName = function (config) {
        return config.name;
    };
    Naming.prototype.getResolverEmbeddedSyncLambdaName = function (config) {
        if ('name' in config) {
            return "".concat(config.name, "_Sync");
        }
        else {
            return "".concat(config.type, "_").concat(config.field, "_Sync");
        }
    };
    Naming.prototype.getAuthenticationEmbeddedLamdbaName = function () {
        return "".concat(this.apiName, "Authorizer");
    };
    return Naming;
}());
exports.Naming = Naming;
//# sourceMappingURL=Naming.js.map