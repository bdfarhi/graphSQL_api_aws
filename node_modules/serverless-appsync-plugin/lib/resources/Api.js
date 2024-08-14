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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
var lodash_1 = require("lodash");
var utils_1 = require("../utils");
var luxon_1 = require("luxon");
var Naming_1 = require("./Naming");
var DataSource_1 = require("./DataSource");
var Resolver_1 = require("./Resolver");
var PipelineFunction_1 = require("./PipelineFunction");
var Schema_1 = require("./Schema");
var Waf_1 = require("./Waf");
var Api = /** @class */ (function () {
    function Api(config, plugin) {
        this.config = config;
        this.plugin = plugin;
        this.functions = {};
        this.naming = new Naming_1.Naming(this.config.name);
    }
    Api.prototype.compile = function () {
        var _this = this;
        var resources = {};
        (0, lodash_1.merge)(resources, this.compileEndpoint());
        (0, lodash_1.merge)(resources, this.compileSchema());
        (0, lodash_1.merge)(resources, this.compileCustomDomain());
        (0, lodash_1.merge)(resources, this.compileCloudWatchLogGroup());
        (0, lodash_1.merge)(resources, this.compileLambdaAuthorizerPermission());
        (0, lodash_1.merge)(resources, this.compileWafRules());
        (0, lodash_1.merge)(resources, this.compileCachingResources());
        (0, lodash_1.forEach)(this.config.apiKeys, function (key) {
            (0, lodash_1.merge)(resources, _this.compileApiKey(key));
        });
        (0, lodash_1.forEach)(this.config.dataSources, function (ds) {
            (0, lodash_1.merge)(resources, _this.compileDataSource(ds));
        });
        (0, lodash_1.forEach)(this.config.pipelineFunctions, function (func) {
            (0, lodash_1.merge)(resources, _this.compilePipelineFunctionResource(func));
        });
        (0, lodash_1.forEach)(this.config.resolvers, function (resolver) {
            (0, lodash_1.merge)(resources, _this.compileResolver(resolver));
        });
        return resources;
    };
    Api.prototype.compileEndpoint = function () {
        var _a;
        var _this = this;
        var _b;
        var logicalId = this.naming.getApiLogicalId();
        var endpointResource = {
            Type: 'AWS::AppSync::GraphQLApi',
            Properties: {
                Name: this.config.name,
                XrayEnabled: this.config.xrayEnabled || false,
                Tags: this.getTagsConfig(),
                EnvironmentVariables: this.config.environment,
            },
        };
        (0, lodash_1.merge)(endpointResource.Properties, this.compileAuthenticationProvider(this.config.authentication));
        if (this.config.additionalAuthentications.length > 0) {
            (0, lodash_1.merge)(endpointResource.Properties, {
                AdditionalAuthenticationProviders: (_b = this.config.additionalAuthentications) === null || _b === void 0 ? void 0 : _b.map(function (provider) {
                    return _this.compileAuthenticationProvider(provider, true);
                }),
            });
        }
        if (this.config.logging && this.config.logging.enabled !== false) {
            var logicalIdCloudWatchLogsRole = this.naming.getLogGroupRoleLogicalId();
            (0, lodash_1.set)(endpointResource, 'Properties.LogConfig', {
                CloudWatchLogsRoleArn: this.config.logging.roleArn || {
                    'Fn::GetAtt': [logicalIdCloudWatchLogsRole, 'Arn'],
                },
                FieldLogLevel: this.config.logging.level,
                ExcludeVerboseContent: this.config.logging.excludeVerboseContent,
            });
        }
        if (this.config.visibility) {
            (0, lodash_1.merge)(endpointResource.Properties, {
                Visibility: this.config.visibility,
            });
        }
        if (this.config.introspection !== undefined) {
            (0, lodash_1.merge)(endpointResource.Properties, {
                IntrospectionConfig: this.config.introspection ? 'ENABLED' : 'DISABLED',
            });
        }
        if (this.config.queryDepthLimit !== undefined) {
            (0, lodash_1.merge)(endpointResource.Properties, {
                QueryDepthLimit: this.config.queryDepthLimit,
            });
        }
        if (this.config.resolverCountLimit !== undefined) {
            (0, lodash_1.merge)(endpointResource.Properties, {
                ResolverCountLimit: this.config.resolverCountLimit,
            });
        }
        var resources = (_a = {},
            _a[logicalId] = endpointResource,
            _a);
        return resources;
    };
    Api.prototype.compileCloudWatchLogGroup = function () {
        var _a;
        if (!this.config.logging || this.config.logging.enabled === false) {
            return {};
        }
        var logGroupLogicalId = this.naming.getLogGroupLogicalId();
        var roleLogicalId = this.naming.getLogGroupRoleLogicalId();
        var policyLogicalId = this.naming.getLogGroupPolicyLogicalId();
        var apiLogicalId = this.naming.getApiLogicalId();
        return _a = {},
            _a[logGroupLogicalId] = {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: {
                        'Fn::Join': [
                            '/',
                            ['/aws/appsync/apis', { 'Fn::GetAtt': [apiLogicalId, 'ApiId'] }],
                        ],
                    },
                    RetentionInDays: this.config.logging.retentionInDays ||
                        this.plugin.serverless.service.provider.logRetentionInDays,
                },
            },
            _a[policyLogicalId] = {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyName: "".concat(policyLogicalId),
                    Roles: [{ Ref: roleLogicalId }],
                    PolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: [
                                    'logs:CreateLogGroup',
                                    'logs:CreateLogStream',
                                    'logs:PutLogEvents',
                                ],
                                Resource: [
                                    {
                                        'Fn::GetAtt': [logGroupLogicalId, 'Arn'],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            _a[roleLogicalId] = {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['appsync.amazonaws.com'],
                                },
                                Action: ['sts:AssumeRole'],
                            },
                        ],
                    },
                },
            },
            _a;
    };
    Api.prototype.compileSchema = function () {
        var schema = new Schema_1.Schema(this, this.config.schema);
        return schema.compile();
    };
    Api.prototype.compileCustomDomain = function () {
        var _a, _b, _c;
        var domain = this.config.domain;
        if (!domain ||
            domain.enabled === false ||
            domain.useCloudFormation === false) {
            return {};
        }
        var domainNameLogicalId = this.naming.getDomainNameLogicalId();
        var domainAssocLogicalId = this.naming.getDomainAssociationLogicalId();
        var domainCertificateLogicalId = this.naming.getDomainCertificateLogicalId();
        var resources = (_a = {},
            _a[domainNameLogicalId] = {
                Type: 'AWS::AppSync::DomainName',
                DeletionPolicy: domain.retain ? 'Retain' : 'Delete',
                Properties: {
                    CertificateArn: domain.certificateArn || {
                        Ref: domainCertificateLogicalId,
                    },
                    DomainName: domain.name,
                },
            },
            _a[domainAssocLogicalId] = {
                Type: 'AWS::AppSync::DomainNameApiAssociation',
                DeletionPolicy: domain.retain ? 'Retain' : 'Delete',
                Properties: {
                    ApiId: this.getApiId(),
                    DomainName: domain.name,
                },
                DependsOn: [domainNameLogicalId],
            },
            _a);
        if (!domain.certificateArn) {
            (0, lodash_1.merge)(resources, (_b = {},
                _b[domainCertificateLogicalId] = {
                    Type: 'AWS::CertificateManager::Certificate',
                    DeletionPolicy: domain.retain ? 'Retain' : 'Delete',
                    Properties: {
                        DomainName: domain.name,
                        ValidationMethod: 'DNS',
                        DomainValidationOptions: [
                            {
                                DomainName: domain.name,
                                HostedZoneId: domain.hostedZoneId,
                            },
                        ],
                    },
                },
                _b));
        }
        if (domain.route53 !== false) {
            var hostedZoneName = domain.hostedZoneName || (0, utils_1.getHostedZoneName)(domain.name);
            var domainRoute53Record = this.naming.getDomainReoute53RecordLogicalId();
            (0, lodash_1.merge)(resources, (_c = {},
                _c[domainRoute53Record] = {
                    Type: 'AWS::Route53::RecordSet',
                    DeletionPolicy: domain.retain ? 'Retain' : 'Delete',
                    Properties: __assign(__assign({}, (domain.hostedZoneId
                        ? { HostedZoneId: domain.hostedZoneId }
                        : { HostedZoneName: hostedZoneName })), { Name: domain.name, Type: 'A', AliasTarget: {
                            HostedZoneId: {
                                'Fn::GetAtt': [domainNameLogicalId, 'HostedZoneId'],
                            },
                            DNSName: {
                                'Fn::GetAtt': [domainNameLogicalId, 'AppSyncDomainName'],
                            },
                            EvaluateTargetHealth: false,
                        } }),
                },
                _c));
        }
        return resources;
    };
    Api.prototype.compileLambdaAuthorizerPermission = function () {
        var _a;
        var lambdaAuth = __spreadArray(__spreadArray([], this.config.additionalAuthentications, true), [
            this.config.authentication,
        ], false).find(function (_a) {
            var type = _a.type;
            return type === 'AWS_LAMBDA';
        });
        if (!lambdaAuth) {
            return {};
        }
        var logicalId = this.naming.getLambdaAuthLogicalId();
        var apiLogicalId = this.naming.getApiLogicalId();
        return _a = {},
            _a[logicalId] = {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    Action: 'lambda:InvokeFunction',
                    FunctionName: this.getLambdaArn(lambdaAuth.config, this.naming.getAuthenticationEmbeddedLamdbaName()),
                    Principal: 'appsync.amazonaws.com',
                    SourceArn: { Ref: apiLogicalId },
                },
            },
            _a;
    };
    Api.prototype.compileApiKey = function (config) {
        var _a;
        var name = config.name, expiresAt = config.expiresAt, expiresAfter = config.expiresAfter, description = config.description, apiKeyId = config.apiKeyId;
        var startOfHour = luxon_1.DateTime.now().setZone('UTC').startOf('hour');
        var expires;
        if (expiresAfter) {
            var duration = (0, utils_1.parseDuration)(expiresAfter);
            // Minimum duration is 1 day from 'now'
            // However, api key expiry is rounded down to the hour.
            // meaning the minimum expiry date is in fact 25 hours
            // We accept 24h durations for simplicity of use
            // but fix them to be 25
            // Anything < 24h will be kept to make sure the validation fails later
            if (duration.as('hours') >= 24 && duration.as('hours') < 25) {
                duration = luxon_1.Duration.fromDurationLike({ hours: 25 });
            }
            expires = startOfHour.plus(duration);
        }
        else if (expiresAt) {
            expires = luxon_1.DateTime.fromISO(expiresAt);
        }
        else {
            // 1 year by default
            expires = startOfHour.plus({ days: 365 });
        }
        if (expires < luxon_1.DateTime.now().plus({ day: 1 }) ||
            expires > luxon_1.DateTime.now().plus({ years: 365 })) {
            throw new Error("Api Key ".concat(name, " must be valid for a minimum of 1 day and a maximum of 365 days."));
        }
        var logicalIdApiKey = this.naming.getApiKeyLogicalId(name);
        return _a = {},
            _a[logicalIdApiKey] = {
                Type: 'AWS::AppSync::ApiKey',
                Properties: {
                    ApiId: this.getApiId(),
                    Description: description || name,
                    Expires: Math.round(expires.toMillis() / 1000),
                    ApiKeyId: apiKeyId,
                },
            },
            _a;
    };
    Api.prototype.compileCachingResources = function () {
        var _a;
        if (this.config.caching && this.config.caching.enabled !== false) {
            var cacheConfig = this.config.caching;
            var logicalId = this.naming.getCachingLogicalId();
            return _a = {},
                _a[logicalId] = {
                    Type: 'AWS::AppSync::ApiCache',
                    Properties: {
                        ApiCachingBehavior: cacheConfig.behavior,
                        ApiId: this.getApiId(),
                        AtRestEncryptionEnabled: cacheConfig.atRestEncryption || false,
                        TransitEncryptionEnabled: cacheConfig.transitEncryption || false,
                        Ttl: cacheConfig.ttl || 3600,
                        Type: cacheConfig.type || 'T2_SMALL',
                    },
                },
                _a;
        }
        return {};
    };
    Api.prototype.compileDataSource = function (dsConfig) {
        var dataSource = new DataSource_1.DataSource(this, dsConfig);
        return dataSource.compile();
    };
    Api.prototype.compileResolver = function (resolverConfig) {
        var resolver = new Resolver_1.Resolver(this, resolverConfig);
        return resolver.compile();
    };
    Api.prototype.compilePipelineFunctionResource = function (config) {
        var func = new PipelineFunction_1.PipelineFunction(this, config);
        return func.compile();
    };
    Api.prototype.compileWafRules = function () {
        if (!this.config.waf || this.config.waf.enabled === false) {
            return {};
        }
        var waf = new Waf_1.Waf(this, this.config.waf);
        return waf.compile();
    };
    Api.prototype.getApiId = function () {
        var logicalIdGraphQLApi = this.naming.getApiLogicalId();
        return {
            'Fn::GetAtt': [logicalIdGraphQLApi, 'ApiId'],
        };
    };
    Api.prototype.getUserPoolConfig = function (auth, isAdditionalAuth) {
        if (isAdditionalAuth === void 0) { isAdditionalAuth = false; }
        var userPoolConfig = __assign({ AwsRegion: auth.config.awsRegion || { 'Fn::Sub': '${AWS::Region}' }, UserPoolId: auth.config.userPoolId, AppIdClientRegex: auth.config.appIdClientRegex }, (!isAdditionalAuth
            ? {
                // Default action is the one passed in the config
                // or 'ALLOW'
                DefaultAction: auth.config.defaultAction || 'ALLOW',
            }
            : {}));
        return userPoolConfig;
    };
    Api.prototype.getOpenIDConnectConfig = function (auth) {
        if (!auth.config) {
            return;
        }
        var openIdConnectConfig = {
            Issuer: auth.config.issuer,
            ClientId: auth.config.clientId,
            IatTTL: auth.config.iatTTL,
            AuthTTL: auth.config.authTTL,
        };
        return openIdConnectConfig;
    };
    Api.prototype.getLambdaAuthorizerConfig = function (auth) {
        if (!auth.config) {
            return;
        }
        var lambdaAuthorizerConfig = {
            AuthorizerUri: this.getLambdaArn(auth.config, this.naming.getAuthenticationEmbeddedLamdbaName()),
            IdentityValidationExpression: auth.config.identityValidationExpression,
            AuthorizerResultTtlInSeconds: auth.config.authorizerResultTtlInSeconds,
        };
        return lambdaAuthorizerConfig;
    };
    Api.prototype.getTagsConfig = function () {
        if (!this.config.tags || (0, lodash_1.isEmpty)(this.config.tags)) {
            return undefined;
        }
        var tags = this.config.tags;
        return Object.keys(this.config.tags).map(function (key) { return ({
            Key: key,
            Value: tags[key],
        }); });
    };
    Api.prototype.compileAuthenticationProvider = function (provider, isAdditionalAuth) {
        if (isAdditionalAuth === void 0) { isAdditionalAuth = false; }
        var type = provider.type;
        var authPrivider = {
            AuthenticationType: type,
        };
        if (type === 'AMAZON_COGNITO_USER_POOLS') {
            (0, lodash_1.merge)(authPrivider, {
                UserPoolConfig: this.getUserPoolConfig(provider, isAdditionalAuth),
            });
        }
        else if (type === 'OPENID_CONNECT') {
            (0, lodash_1.merge)(authPrivider, {
                OpenIDConnectConfig: this.getOpenIDConnectConfig(provider),
            });
        }
        else if (type === 'AWS_LAMBDA') {
            (0, lodash_1.merge)(authPrivider, {
                LambdaAuthorizerConfig: this.getLambdaAuthorizerConfig(provider),
            });
        }
        return authPrivider;
    };
    Api.prototype.getLambdaArn = function (config, embededFunctionName) {
        if ('functionArn' in config) {
            return config.functionArn;
        }
        else if ('functionName' in config) {
            return this.generateLambdaArn(config.functionName, config.functionAlias);
        }
        else if ('function' in config) {
            this.functions[embededFunctionName] = config.function;
            return this.generateLambdaArn(embededFunctionName);
        }
        throw new Error('You must specify either `functionArn`, `functionName` or `function` for lambda definitions.');
    };
    Api.prototype.generateLambdaArn = function (functionName, functionAlias) {
        var lambdaLogicalId = this.plugin.serverless
            .getProvider('aws')
            .naming.getLambdaLogicalId(functionName);
        var lambdaArn = { 'Fn::GetAtt': [lambdaLogicalId, 'Arn'] };
        return functionAlias
            ? { 'Fn::Join': [':', [lambdaArn, functionAlias]] }
            : lambdaArn;
    };
    Api.prototype.hasDataSource = function (name) {
        return name in this.config.dataSources;
    };
    Api.prototype.hasPipelineFunction = function (name) {
        return name in this.config.pipelineFunctions;
    };
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=Api.js.map