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
exports.DataSource = void 0;
var lodash_1 = require("lodash");
var DataSource = /** @class */ (function () {
    function DataSource(api, config) {
        this.api = api;
        this.config = config;
    }
    DataSource.prototype.compile = function () {
        var _a;
        var resource = {
            Type: 'AWS::AppSync::DataSource',
            Properties: {
                ApiId: this.api.getApiId(),
                Name: this.config.name,
                Description: this.config.description,
                Type: this.config.type,
            },
        };
        if (this.config.type === 'AWS_LAMBDA') {
            resource.Properties.LambdaConfig = {
                LambdaFunctionArn: this.api.getLambdaArn(this.config.config, this.api.naming.getDataSourceEmbeddedLambdaResolverName(this.config)),
            };
        }
        else if (this.config.type === 'AMAZON_DYNAMODB') {
            resource.Properties.DynamoDBConfig = this.getDynamoDbConfig(this.config);
        }
        else if (this.config.type === 'AMAZON_OPENSEARCH_SERVICE') {
            resource.Properties.OpenSearchServiceConfig = this.getOpenSearchConfig(this.config);
        }
        else if (this.config.type === 'RELATIONAL_DATABASE') {
            resource.Properties.RelationalDatabaseConfig = this.getRelationalDbConfig(this.config);
        }
        else if (this.config.type === 'HTTP') {
            resource.Properties.HttpConfig = this.getHttpConfig(this.config);
        }
        else if (this.config.type === 'AMAZON_EVENTBRIDGE') {
            resource.Properties.EventBridgeConfig = this.getEventBridgeConfig(this.config);
        }
        var logicalId = this.api.naming.getDataSourceLogicalId(this.config.name);
        var resources = (_a = {},
            _a[logicalId] = resource,
            _a);
        if ('config' in this.config && this.config.config.serviceRoleArn) {
            resource.Properties.ServiceRoleArn = this.config.config.serviceRoleArn;
        }
        else {
            var role = this.compileDataSourceIamRole();
            if (role) {
                var roleLogicalId = this.api.naming.getDataSourceRoleLogicalId(this.config.name);
                resource.Properties.ServiceRoleArn = {
                    'Fn::GetAtt': [roleLogicalId, 'Arn'],
                };
                (0, lodash_1.merge)(resources, role);
            }
        }
        return resources;
    };
    DataSource.prototype.getDynamoDbConfig = function (config) {
        return __assign({ AwsRegion: config.config.region || { Ref: 'AWS::Region' }, TableName: config.config.tableName, UseCallerCredentials: !!config.config.useCallerCredentials }, this.getDeltaSyncConfig(config));
    };
    DataSource.prototype.getDeltaSyncConfig = function (config) {
        if (config.config.versioned && config.config.deltaSyncConfig) {
            return {
                Versioned: true,
                DeltaSyncConfig: {
                    BaseTableTTL: config.config.deltaSyncConfig.baseTableTTL || 43200,
                    DeltaSyncTableName: config.config.deltaSyncConfig.deltaSyncTableName,
                    DeltaSyncTableTTL: config.config.deltaSyncConfig.deltaSyncTableTTL || 1440,
                },
            };
        }
    };
    DataSource.prototype.getEventBridgeConfig = function (config) {
        return {
            EventBusArn: config.config.eventBusArn,
        };
    };
    DataSource.prototype.getOpenSearchConfig = function (config) {
        var endpoint = config.config.endpoint ||
            (config.config.domain && {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        { 'Fn::GetAtt': [config.config.domain, 'DomainEndpoint'] },
                    ],
                ],
            });
        // FIXME: can we validate this and make TS infer mutually eclusive types?
        if (!endpoint) {
            throw new Error('Specify eithe rendpoint or domain');
        }
        return {
            AwsRegion: config.config.region || { Ref: 'AWS::Region' },
            Endpoint: endpoint,
        };
    };
    DataSource.prototype.getRelationalDbConfig = function (config) {
        return {
            RdsHttpEndpointConfig: {
                AwsRegion: config.config.region || { Ref: 'AWS::Region' },
                DbClusterIdentifier: {
                    'Fn::Join': [
                        ':',
                        [
                            'arn',
                            'aws',
                            'rds',
                            config.config.region || { Ref: 'AWS::Region' },
                            { Ref: 'AWS::AccountId' },
                            'cluster',
                            config.config.dbClusterIdentifier,
                        ],
                    ],
                },
                DatabaseName: config.config.databaseName,
                Schema: config.config.schema,
                AwsSecretStoreArn: config.config.awsSecretStoreArn,
            },
            RelationalDatabaseSourceType: config.config.relationalDatabaseSourceType || 'RDS_HTTP_ENDPOINT',
        };
    };
    DataSource.prototype.getHttpConfig = function (config) {
        return __assign({ Endpoint: config.config.endpoint }, this.getHttpAuthorizationConfig(config));
    };
    DataSource.prototype.getHttpAuthorizationConfig = function (config) {
        var authConfig = config.config.authorizationConfig;
        if (authConfig) {
            return {
                AuthorizationConfig: {
                    AuthorizationType: authConfig.authorizationType,
                    AwsIamConfig: {
                        SigningRegion: authConfig.awsIamConfig.signingRegion || {
                            Ref: 'AWS::Region',
                        },
                        SigningServiceName: authConfig.awsIamConfig.signingServiceName,
                    },
                },
            };
        }
    };
    DataSource.prototype.compileDataSourceIamRole = function () {
        var _a;
        if ('config' in this.config && this.config.config.serviceRoleArn) {
            return;
        }
        var statements;
        if (this.config.type === 'HTTP' &&
            this.config.config &&
            this.config.config.authorizationConfig &&
            this.config.config.authorizationConfig.authorizationType === 'AWS_IAM' &&
            !this.config.config.iamRoleStatements) {
            throw new Error("".concat(this.config.name, ": When using AWS_IAM signature, you must also specify the required iamRoleStatements"));
        }
        if ('config' in this.config && this.config.config.iamRoleStatements) {
            statements = this.config.config.iamRoleStatements;
        }
        else {
            // Try to generate default statements for the given this.config.
            statements = this.getDefaultDataSourcePolicyStatements();
        }
        if (!statements || statements.length === 0) {
            return;
        }
        var logicalId = this.api.naming.getDataSourceRoleLogicalId(this.config.name);
        return _a = {},
            _a[logicalId] = {
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
                    Policies: [
                        {
                            PolicyName: "AppSync-Datasource-".concat(this.config.name),
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: statements,
                            },
                        },
                    ],
                },
            },
            _a;
    };
    DataSource.prototype.getDefaultDataSourcePolicyStatements = function () {
        switch (this.config.type) {
            case 'AWS_LAMBDA': {
                var lambdaArn = this.api.getLambdaArn(this.config.config, this.api.naming.getDataSourceEmbeddedLambdaResolverName(this.config));
                // Allow "invoke" for the Datasource's function and its aliases/versions
                var defaultLambdaStatement = {
                    Action: ['lambda:invokeFunction'],
                    Effect: 'Allow',
                    Resource: [lambdaArn, { 'Fn::Join': [':', [lambdaArn, '*']] }],
                };
                return [defaultLambdaStatement];
            }
            case 'AMAZON_DYNAMODB': {
                var dynamoDbResourceArn = {
                    'Fn::Join': [
                        ':',
                        [
                            'arn',
                            'aws',
                            'dynamodb',
                            this.config.config.region || { Ref: 'AWS::Region' },
                            { Ref: 'AWS::AccountId' },
                            "table",
                        ],
                    ],
                };
                // Allow any action on the Datasource's table
                var defaultDynamoDBStatement = {
                    Action: [
                        'dynamodb:DeleteItem',
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:Query',
                        'dynamodb:Scan',
                        'dynamodb:UpdateItem',
                        'dynamodb:BatchGetItem',
                        'dynamodb:BatchWriteItem',
                        'dynamodb:ConditionCheckItem',
                    ],
                    Effect: 'Allow',
                    Resource: [
                        {
                            'Fn::Join': [
                                '/',
                                [dynamoDbResourceArn, this.config.config.tableName],
                            ],
                        },
                        {
                            'Fn::Join': [
                                '/',
                                [dynamoDbResourceArn, this.config.config.tableName, '*'],
                            ],
                        },
                    ],
                };
                return [defaultDynamoDBStatement];
            }
            case 'RELATIONAL_DATABASE': {
                var dDbResourceArn = {
                    'Fn::Join': [
                        ':',
                        [
                            'arn',
                            'aws',
                            'rds',
                            this.config.config.region || { Ref: 'AWS::Region' },
                            { Ref: 'AWS::AccountId' },
                            'cluster',
                            this.config.config.dbClusterIdentifier,
                        ],
                    ],
                };
                var dbStatement = {
                    Effect: 'Allow',
                    Action: [
                        'rds-data:DeleteItems',
                        'rds-data:ExecuteSql',
                        'rds-data:ExecuteStatement',
                        'rds-data:GetItems',
                        'rds-data:InsertItems',
                        'rds-data:UpdateItems',
                    ],
                    Resource: [
                        dDbResourceArn,
                        { 'Fn::Join': [':', [dDbResourceArn, '*']] },
                    ],
                };
                var secretManagerStatement = {
                    Effect: 'Allow',
                    Action: ['secretsmanager:GetSecretValue'],
                    Resource: [
                        this.config.config.awsSecretStoreArn,
                        { 'Fn::Join': [':', [this.config.config.awsSecretStoreArn, '*']] },
                    ],
                };
                return [dbStatement, secretManagerStatement];
            }
            case 'AMAZON_OPENSEARCH_SERVICE': {
                var arn = void 0;
                if (this.config.config.endpoint &&
                    typeof this.config.config.endpoint === 'string') {
                    // FIXME: Do new domains have a different API? (opensearch)
                    var rx = /^https:\/\/([a-z0-9-]+\.(\w{2}-[a-z]+-\d)\.es\.amazonaws\.com)$/;
                    var result = rx.exec(this.config.config.endpoint);
                    if (!result) {
                        throw new Error("Invalid AWS OpenSearch endpoint: '".concat(this.config.config.endpoint));
                    }
                    arn = {
                        'Fn::Join': [
                            ':',
                            [
                                'arn',
                                'aws',
                                'es',
                                result[2],
                                { Ref: 'AWS::AccountId' },
                                "domain/".concat(result[1], "/*"),
                            ],
                        ],
                    };
                }
                else if (this.config.config.domain) {
                    arn = {
                        'Fn::Join': [
                            '/',
                            [{ 'Fn::GetAtt': [this.config.config.domain, 'Arn'] }, '*'],
                        ],
                    };
                }
                else {
                    throw new Error("Could not determine the Arn for dataSource '".concat(this.config.name));
                }
                // Allow any action on the Datasource's ES endpoint
                var defaultESStatement = {
                    Action: [
                        'es:ESHttpDelete',
                        'es:ESHttpGet',
                        'es:ESHttpHead',
                        'es:ESHttpPost',
                        'es:ESHttpPut',
                        'es:ESHttpPatch',
                    ],
                    Effect: 'Allow',
                    Resource: [arn],
                };
                return [defaultESStatement];
            }
            case 'AMAZON_EVENTBRIDGE': {
                // Allow PutEvents on the EventBridge bus
                var defaultEventBridgeStatement = {
                    Action: ['events:PutEvents'],
                    Effect: 'Allow',
                    Resource: [this.config.config.eventBusArn],
                };
                return [defaultEventBridgeStatement];
            }
        }
    };
    return DataSource;
}());
exports.DataSource = DataSource;
//# sourceMappingURL=DataSource.js.map