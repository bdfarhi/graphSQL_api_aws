import ServerlessAppsyncPlugin from '..';
import { CfnResources, IntrinsicFunction } from '../types/cloudFormation';
import { ApiKeyConfig, AppSyncConfig, Auth, CognitoAuth, DataSourceConfig, PipelineFunctionConfig, LambdaAuth, LambdaConfig, OidcAuth, ResolverConfig } from '../types/plugin';
import { Naming } from './Naming';
export declare class Api {
    config: AppSyncConfig;
    plugin: ServerlessAppsyncPlugin;
    naming: Naming;
    functions: Record<string, Record<string, unknown>>;
    constructor(config: AppSyncConfig, plugin: ServerlessAppsyncPlugin);
    compile(): {
        [k: string]: {
            Type: string;
            Properties?: {
                [k: string]: unknown;
            } | undefined;
            CreationPolicy?: {
                [k: string]: unknown;
            } | undefined;
            DeletionPolicy?: string | undefined;
            DependsOn?: import("@serverless/typescript").AwsResourceDependsOn | undefined;
            Metadata?: {
                [k: string]: unknown;
            } | undefined;
            UpdatePolicy?: {
                [k: string]: unknown;
            } | undefined;
            UpdateReplacePolicy?: string | undefined;
            Condition?: string | undefined;
        };
        "Fn::Transform"?: {
            Name: string;
            Parameters?: {
                [k: string]: unknown;
            } | undefined;
        } | undefined;
    };
    compileEndpoint(): CfnResources;
    compileCloudWatchLogGroup(): CfnResources;
    compileSchema(): {
        [k: string]: {
            Type: string;
            Properties?: {
                [k: string]: unknown;
            } | undefined;
            CreationPolicy?: {
                [k: string]: unknown;
            } | undefined;
            DeletionPolicy?: string | undefined;
            DependsOn?: import("@serverless/typescript").AwsResourceDependsOn | undefined;
            Metadata?: {
                [k: string]: unknown;
            } | undefined;
            UpdatePolicy?: {
                [k: string]: unknown;
            } | undefined;
            UpdateReplacePolicy?: string | undefined;
            Condition?: string | undefined;
        };
        "Fn::Transform"?: {
            Name: string;
            Parameters?: {
                [k: string]: unknown;
            } | undefined;
        } | undefined;
    };
    compileCustomDomain(): CfnResources;
    compileLambdaAuthorizerPermission(): CfnResources;
    compileApiKey(config: ApiKeyConfig): {
        [x: string]: {
            Type: string;
            Properties: {
                ApiId: {
                    'Fn::GetAtt': string[];
                };
                Description: string;
                Expires: number;
                ApiKeyId: string | undefined;
            };
        };
    };
    compileCachingResources(): CfnResources;
    compileDataSource(dsConfig: DataSourceConfig): CfnResources;
    compileResolver(resolverConfig: ResolverConfig): CfnResources;
    compilePipelineFunctionResource(config: PipelineFunctionConfig): CfnResources;
    compileWafRules(): {
        [k: string]: {
            Type: string;
            Properties?: {
                [k: string]: unknown;
            } | undefined;
            CreationPolicy?: {
                [k: string]: unknown;
            } | undefined;
            DeletionPolicy?: string | undefined;
            DependsOn?: import("@serverless/typescript").AwsResourceDependsOn | undefined;
            Metadata?: {
                [k: string]: unknown;
            } | undefined;
            UpdatePolicy?: {
                [k: string]: unknown;
            } | undefined;
            UpdateReplacePolicy?: string | undefined;
            Condition?: string | undefined;
        };
        "Fn::Transform"?: {
            Name: string;
            Parameters?: {
                [k: string]: unknown;
            } | undefined;
        } | undefined;
    };
    getApiId(): {
        'Fn::GetAtt': string[];
    };
    getUserPoolConfig(auth: CognitoAuth, isAdditionalAuth?: boolean): {
        DefaultAction?: "ALLOW" | "DENY" | undefined;
        AwsRegion: string | import("../types/cloudFormation").FnGetAtt | import("../types/cloudFormation").FnJoin | import("../types/cloudFormation").FnRef | import("../types/cloudFormation").FnSub | {
            'Fn::Sub': string;
        };
        UserPoolId: string | IntrinsicFunction;
        AppIdClientRegex: string | IntrinsicFunction | undefined;
    };
    getOpenIDConnectConfig(auth: OidcAuth): {
        Issuer: string;
        ClientId: string;
        IatTTL: number | undefined;
        AuthTTL: number | undefined;
    } | undefined;
    getLambdaAuthorizerConfig(auth: LambdaAuth): {
        AuthorizerUri: string | IntrinsicFunction;
        IdentityValidationExpression: string | undefined;
        AuthorizerResultTtlInSeconds: number | undefined;
    } | undefined;
    getTagsConfig(): {
        Key: string;
        Value: string;
    }[] | undefined;
    compileAuthenticationProvider(provider: Auth, isAdditionalAuth?: boolean): {
        AuthenticationType: "AWS_LAMBDA" | "AMAZON_COGNITO_USER_POOLS" | "AWS_IAM" | "OPENID_CONNECT" | "API_KEY";
    };
    getLambdaArn(config: LambdaConfig, embededFunctionName: string): string | IntrinsicFunction;
    generateLambdaArn(functionName: string, functionAlias?: string): IntrinsicFunction;
    hasDataSource(name: string): boolean;
    hasPipelineFunction(name: string): boolean;
}
