export declare const appSyncSchema: {
    type: string;
    definitions: {
        stringOrIntrinsicFunction: {
            oneOf: ({
                type: string;
                required?: undefined;
                additionalProperties?: undefined;
            } | {
                type: string;
                required: never[];
                additionalProperties: boolean;
            })[];
            errorMessage: string;
        };
        lambdaFunctionConfig: {
            oneOf: ({
                type: string;
                properties: {
                    functionName: {
                        type: string;
                    };
                    functionAlias: {
                        type: string;
                    };
                    functionArn?: undefined;
                    function?: undefined;
                };
                required: string[];
            } | {
                type: string;
                properties: {
                    functionArn: {
                        $ref: string;
                    };
                    functionName?: undefined;
                    functionAlias?: undefined;
                    function?: undefined;
                };
                required: string[];
            } | {
                type: string;
                properties: {
                    function: {
                        type: string;
                    };
                    functionName?: undefined;
                    functionAlias?: undefined;
                    functionArn?: undefined;
                };
                required: string[];
            })[];
            errorMessage: string;
        };
        auth: {
            type: string;
            title: string;
            description: string;
            properties: {
                type: {
                    type: string;
                    enum: readonly ["AMAZON_COGNITO_USER_POOLS", "AWS_LAMBDA", "OPENID_CONNECT", "AWS_IAM", "API_KEY"];
                    errorMessage: string;
                };
            };
            if: {
                properties: {
                    type: {
                        const: string;
                    };
                };
            };
            then: {
                properties: {
                    config: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            else: {
                if: {
                    properties: {
                        type: {
                            const: string;
                        };
                    };
                };
                then: {
                    properties: {
                        config: {
                            $ref: string;
                        };
                    };
                    required: string[];
                };
                else: {
                    if: {
                        properties: {
                            type: {
                                const: string;
                            };
                        };
                    };
                    then: {
                        properties: {
                            config: {
                                $ref: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
            required: string[];
        };
        cognitoAuth: {
            type: string;
            properties: {
                userPoolId: {
                    $ref: string;
                };
                awsRegion: {
                    $ref: string;
                };
                defaultAction: {
                    type: string;
                    enum: string[];
                    errorMessage: string;
                };
                appIdClientRegex: {
                    $ref: string;
                };
            };
            required: string[];
        };
        lambdaAuth: {
            type: string;
            oneOf: {
                $ref: string;
            }[];
            properties: {
                functionName: {
                    type: string;
                };
                functionArn: {
                    type: string;
                };
                identityValidationExpression: {
                    type: string;
                };
                authorizerResultTtlInSeconds: {
                    type: string;
                };
            };
            required: never[];
        };
        oidcAuth: {
            type: string;
            properties: {
                issuer: {
                    type: string;
                };
                clientId: {
                    type: string;
                };
                iatTTL: {
                    type: string;
                };
                authTTL: {
                    type: string;
                };
            };
            required: string[];
        };
        iamAuth: {
            type: string;
            properties: {
                type: {
                    type: string;
                    const: string;
                };
            };
            required: string[];
            errorMessage: string;
        };
        apiKeyAuth: {
            type: string;
            properties: {
                type: {
                    type: string;
                    const: string;
                };
            };
            required: string[];
            errorMessage: string;
        };
        visibilityConfig: {
            type: string;
            properties: {
                cloudWatchMetricsEnabled: {
                    type: string;
                };
                name: {
                    type: string;
                };
                sampledRequestsEnabled: {
                    type: string;
                };
            };
            required: never[];
        };
        wafRule: {
            anyOf: ({
                type: string;
                enum: string[];
                properties?: undefined;
                required?: undefined;
                $ref?: undefined;
            } | {
                type: string;
                properties: {
                    disableIntrospection: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            priority: {
                                type: string;
                            };
                            visibilityConfig: {
                                $ref: string;
                            };
                        };
                    };
                    throttle?: undefined;
                };
                required: string[];
                enum?: undefined;
                $ref?: undefined;
            } | {
                type: string;
                properties: {
                    throttle: {
                        oneOf: ({
                            type: string;
                            minimum: number;
                            properties?: undefined;
                            required?: undefined;
                        } | {
                            type: string;
                            properties: {
                                name: {
                                    type: string;
                                };
                                action: {
                                    type: string;
                                    enum: string[];
                                };
                                aggregateKeyType: {
                                    type: string;
                                    enum: string[];
                                };
                                limit: {
                                    type: string;
                                    minimum: number;
                                };
                                priority: {
                                    type: string;
                                };
                                scopeDownStatement: {
                                    type: string;
                                };
                                forwardedIPConfig: {
                                    type: string;
                                    properties: {
                                        headerName: {
                                            type: string;
                                            pattern: string;
                                        };
                                        fallbackBehavior: {
                                            type: string;
                                            enum: string[];
                                        };
                                    };
                                    required: string[];
                                };
                                visibilityConfig: {
                                    $ref: string;
                                };
                            };
                            required: never[];
                            minimum?: undefined;
                        })[];
                    };
                    disableIntrospection?: undefined;
                };
                required: string[];
                enum?: undefined;
                $ref?: undefined;
            } | {
                $ref: string;
                type?: undefined;
                enum?: undefined;
                properties?: undefined;
                required?: undefined;
            })[];
            errorMessage: string;
        };
        customWafRule: {
            type: string;
            properties: {
                name: {
                    type: string;
                };
                priority: {
                    type: string;
                };
                action: {
                    type: string;
                    enum: string[];
                };
                statement: {
                    type: string;
                    required: never[];
                };
                visibilityConfig: {
                    $ref: string;
                };
            };
            required: string[];
        };
        substitutions: {
            type: string;
            additionalProperties: {
                $ref: string;
            };
            required: never[];
            errorMessage: string;
        };
        environment: {
            type: string;
            additionalProperties: {
                $ref: string;
            };
            required: never[];
            errorMessage: string;
        };
        dataSource: {
            if: {
                type: string;
            };
            then: {
                $ref: string;
            };
            else: {
                type: string;
                errorMessage: string;
            };
        };
        resolverConfig: {
            type: string;
            properties: {
                kind: {
                    type: string;
                    enum: string[];
                    errorMessage: string;
                };
                type: {
                    type: string;
                };
                field: {
                    type: string;
                };
                maxBatchSize: {
                    type: string;
                    minimum: number;
                    maximum: number;
                };
                code: {
                    type: string;
                };
                request: {
                    type: string;
                };
                response: {
                    type: string;
                };
                sync: {
                    $ref: string;
                };
                substitutions: {
                    $ref: string;
                };
                caching: {
                    $ref: string;
                };
            };
            if: {
                properties: {
                    kind: {
                        const: string;
                    };
                };
                required: string[];
            };
            then: {
                properties: {
                    dataSource: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            else: {
                properties: {
                    functions: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            required: never[];
        };
        resolverConfigMap: {
            type: string;
            patternProperties: {
                '^[_A-Za-z][_0-9A-Za-z]*\\.[_A-Za-z][_0-9A-Za-z]*$': {
                    $ref: string;
                };
            };
            additionalProperties: {
                $merge: {
                    source: {
                        $ref: string;
                    };
                    with: {
                        required: string[];
                    };
                };
                errorMessage: {
                    required: {
                        type: string;
                        field: string;
                    };
                };
            };
            required: never[];
        };
        pipelineFunctionConfig: {
            type: string;
            properties: {
                dataSource: {
                    $ref: string;
                };
                description: {
                    type: string;
                };
                request: {
                    type: string;
                };
                response: {
                    type: string;
                };
                sync: {
                    $ref: string;
                };
                maxBatchSize: {
                    type: string;
                    minimum: number;
                    maximum: number;
                };
                substitutions: {
                    $ref: string;
                };
            };
            required: string[];
        };
        pipelineFunction: {
            if: {
                type: string;
            };
            then: {
                $ref: string;
            };
            else: {
                type: string;
                errorMessage: string;
            };
        };
        pipelineFunctionConfigMap: {
            type: string;
            additionalProperties: {
                if: {
                    type: string;
                };
                then: {
                    $ref: string;
                };
                else: {
                    type: string;
                    errorMessage: string;
                };
            };
            required: never[];
        };
        resolverCachingConfig: {
            oneOf: ({
                type: string;
                properties?: undefined;
                required?: undefined;
            } | {
                type: string;
                properties: {
                    ttl: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    keys: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: never[];
            })[];
            errorMessage: string;
        };
        syncConfig: {
            type: string;
            if: {
                properties: {
                    conflictHandler: {
                        const: string[];
                    };
                };
            };
            then: {
                $ref: string;
            };
            properties: {
                functionArn: {
                    type: string;
                };
                functionName: {
                    type: string;
                };
                conflictDetection: {
                    type: string;
                    enum: string[];
                };
                conflictHandler: {
                    type: string;
                    enum: string[];
                };
            };
            required: never[];
        };
        iamRoleStatements: {
            type: string;
            items: {
                type: string;
                properties: {
                    Effect: {
                        type: string;
                        enum: string[];
                    };
                    Action: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    Resource: {
                        oneOf: ({
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        } | {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        })[];
                        errorMessage: string;
                    };
                };
                required: string[];
                errorMessage: string;
            };
        };
        dataSourceConfig: {
            type: string;
            properties: {
                type: {
                    type: string;
                    enum: readonly ["AMAZON_DYNAMODB", "AMAZON_OPENSEARCH_SERVICE", "AWS_LAMBDA", "HTTP", "NONE", "RELATIONAL_DATABASE", "AMAZON_EVENTBRIDGE"];
                    errorMessage: string;
                };
                description: {
                    type: string;
                };
            };
            if: {
                properties: {
                    type: {
                        const: string;
                    };
                };
            };
            then: {
                properties: {
                    config: {
                        $ref: string;
                    };
                };
                required: string[];
            };
            else: {
                if: {
                    properties: {
                        type: {
                            const: string;
                        };
                    };
                };
                then: {
                    properties: {
                        config: {
                            $ref: string;
                        };
                    };
                    required: string[];
                };
                else: {
                    if: {
                        properties: {
                            type: {
                                const: string;
                            };
                        };
                    };
                    then: {
                        properties: {
                            config: {
                                $ref: string;
                            };
                        };
                        required: string[];
                    };
                    else: {
                        if: {
                            properties: {
                                type: {
                                    const: string;
                                };
                            };
                        };
                        then: {
                            properties: {
                                config: {
                                    $ref: string;
                                };
                            };
                            required: string[];
                        };
                        else: {
                            if: {
                                properties: {
                                    type: {
                                        const: string;
                                    };
                                };
                            };
                            then: {
                                properties: {
                                    config: {
                                        $ref: string;
                                    };
                                };
                                required: string[];
                            };
                            else: {
                                if: {
                                    properties: {
                                        type: {
                                            const: string;
                                        };
                                    };
                                };
                                then: {
                                    properties: {
                                        config: {
                                            $ref: string;
                                        };
                                    };
                                    required: string[];
                                };
                            };
                        };
                    };
                };
            };
            required: string[];
        };
        dataSourceHttpConfig: {
            type: string;
            properties: {
                endpoint: {
                    $ref: string;
                };
                serviceRoleArn: {
                    $ref: string;
                };
                iamRoleStatements: {
                    $ref: string;
                };
                authorizationConfig: {
                    type: string;
                    properties: {
                        authorizationType: {
                            type: string;
                            enum: string[];
                            errorMessage: string;
                        };
                        awsIamConfig: {
                            type: string;
                            properties: {
                                signingRegion: {
                                    $ref: string;
                                };
                                signingServiceName: {
                                    $ref: string;
                                };
                            };
                            required: string[];
                        };
                    };
                    required: string[];
                };
            };
            required: string[];
        };
        dataSourceDynamoDb: {
            type: string;
            properties: {
                tableName: {
                    $ref: string;
                };
                useCallerCredentials: {
                    type: string;
                };
                serviceRoleArn: {
                    $ref: string;
                };
                region: {
                    $ref: string;
                };
                iamRoleStatements: {
                    $ref: string;
                };
                versioned: {
                    type: string;
                };
                deltaSyncConfig: {
                    type: string;
                    properties: {
                        deltaSyncTableName: {
                            type: string;
                        };
                        baseTableTTL: {
                            type: string;
                        };
                        deltaSyncTableTTL: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
            required: string[];
        };
        datasourceRelationalDbConfig: {
            type: string;
            properties: {
                region: {
                    $ref: string;
                };
                relationalDatabaseSourceType: {
                    type: string;
                    enum: string[];
                };
                serviceRoleArn: {
                    $ref: string;
                };
                dbClusterIdentifier: {
                    $ref: string;
                };
                databaseName: {
                    $ref: string;
                };
                schema: {
                    type: string;
                };
                awsSecretStoreArn: {
                    $ref: string;
                };
                iamRoleStatements: {
                    $ref: string;
                };
            };
            required: string[];
        };
        datasourceLambdaConfig: {
            type: string;
            oneOf: {
                $ref: string;
            }[];
            properties: {
                functionName: {
                    type: string;
                };
                functionArn: {
                    $ref: string;
                };
                serviceRoleArn: {
                    $ref: string;
                };
                iamRoleStatements: {
                    $ref: string;
                };
            };
            required: never[];
        };
        datasourceEsConfig: {
            type: string;
            oneOf: {
                oneOf: ({
                    type: string;
                    properties: {
                        endpoint: {
                            $ref: string;
                        };
                        domain?: undefined;
                    };
                    required: string[];
                } | {
                    type: string;
                    properties: {
                        domain: {
                            $ref: string;
                        };
                        endpoint?: undefined;
                    };
                    required: string[];
                })[];
                errorMessage: string;
            }[];
            properties: {
                endpoint: {
                    $ref: string;
                };
                domain: {
                    $ref: string;
                };
                region: {
                    $ref: string;
                };
                serviceRoleArn: {
                    $ref: string;
                };
                iamRoleStatements: {
                    $ref: string;
                };
            };
            required: never[];
        };
        datasourceEventBridgeConfig: {
            type: string;
            properties: {
                eventBusArn: {
                    $ref: string;
                };
            };
            required: string[];
        };
    };
    properties: {
        name: {
            type: string;
        };
        authentication: {
            $ref: string;
        };
        schema: {
            anyOf: ({
                type: string;
                items?: undefined;
            } | {
                type: string;
                items: {
                    type: string;
                };
            })[];
            errorMessage: string;
        };
        domain: {
            type: string;
            properties: {
                enabled: {
                    type: string;
                };
                useCloudFormation: {
                    type: string;
                };
                retain: {
                    type: string;
                };
                name: {
                    type: string;
                    pattern: string;
                    errorMessage: string;
                };
                certificateArn: {
                    $ref: string;
                };
                hostedZoneId: {
                    $ref: string;
                };
                hostedZoneName: {
                    type: string;
                    pattern: string;
                    errorMessage: string;
                };
                route53: {
                    type: string;
                };
            };
            required: string[];
            if: {
                anyOf: ({
                    not: {
                        properties: {
                            useCloudFormation: {
                                const: boolean;
                            };
                        };
                        required?: undefined;
                    };
                } | {
                    not: {
                        required: string[];
                        properties?: undefined;
                    };
                })[];
            };
            then: {
                anyOf: {
                    required: string[];
                }[];
                errorMessage: string;
            };
        };
        xrayEnabled: {
            type: string;
        };
        visibility: {
            type: string;
            enum: string[];
            errorMessage: string;
        };
        introspection: {
            type: string;
        };
        queryDepthLimit: {
            type: string;
            minimum: number;
            maximum: number;
        };
        resolverCountLimit: {
            type: string;
            minimum: number;
            maximum: number;
        };
        substitutions: {
            $ref: string;
        };
        environment: {
            $ref: string;
        };
        waf: {
            type: string;
            properties: {
                enabled: {
                    type: string;
                };
            };
            if: {
                required: string[];
            };
            then: {
                properties: {
                    arn: {
                        $ref: string;
                    };
                };
            };
            else: {
                properties: {
                    name: {
                        type: string;
                    };
                    defaultAction: {
                        type: string;
                        enum: string[];
                        errorMessage: string;
                    };
                    description: {
                        type: string;
                    };
                    rules: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
        };
        tags: {
            type: string;
            additionalProperties: {
                type: string;
            };
        };
        caching: {
            type: string;
            properties: {
                enabled: {
                    type: string;
                };
                behavior: {
                    type: string;
                    enum: string[];
                    errorMessage: string;
                };
                type: {
                    enum: string[];
                    errorMessage: string;
                };
                ttl: {
                    type: string;
                    minimum: number;
                    maximum: number;
                };
                atRestEncryption: {
                    type: string;
                };
                transitEncryption: {
                    type: string;
                };
            };
            required: string[];
        };
        additionalAuthentications: {
            type: string;
            items: {
                $ref: string;
            };
        };
        apiKeys: {
            type: string;
            items: {
                if: {
                    type: string;
                };
                then: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        expiresAfter: {
                            type: string[];
                            pattern: string;
                            errorMessage: string;
                        };
                        expiresAt: {
                            type: string;
                            format: string;
                            errorMessage: string;
                        };
                        wafRules: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                    };
                    required: string[];
                };
                else: {
                    type: string;
                };
            };
        };
        logging: {
            type: string;
            properties: {
                roleArn: {
                    $ref: string;
                };
                level: {
                    type: string;
                    enum: string[];
                    errorMessage: string;
                };
                retentionInDays: {
                    type: string;
                };
                excludeVerboseContent: {
                    type: string;
                };
                enabled: {
                    type: string;
                };
            };
            required: string[];
        };
        dataSources: {
            oneOf: ({
                type: string;
                additionalProperties: {
                    $ref: string;
                };
                items?: undefined;
            } | {
                type: string;
                items: {
                    type: string;
                    additionalProperties: {
                        $ref: string;
                    };
                };
                additionalProperties?: undefined;
            })[];
            errorMessage: string;
        };
        resolvers: {
            oneOf: ({
                $ref: string;
                type?: undefined;
                items?: undefined;
            } | {
                type: string;
                items: {
                    $ref: string;
                };
                $ref?: undefined;
            })[];
            errorMessage: string;
        };
        pipelineFunctions: {
            oneOf: ({
                $ref: string;
                type?: undefined;
                items?: undefined;
            } | {
                type: string;
                items: {
                    $ref: string;
                };
                $ref?: undefined;
            })[];
            errorMessage: string;
        };
        esbuild: {
            oneOf: ({
                type: string;
                const?: undefined;
            } | {
                const: boolean;
                type?: undefined;
            })[];
            errorMessage: string;
        };
    };
    required: string[];
    additionalProperties: {
        not: boolean;
        errorMessage: string;
    };
};
export declare const validateConfig: (data: Record<string, unknown>) => boolean;
export declare class AppSyncValidationError extends Error {
    validationErrors: {
        path: string;
        message: string;
    }[];
    constructor(validationErrors: {
        path: string;
        message: string;
    }[]);
}
