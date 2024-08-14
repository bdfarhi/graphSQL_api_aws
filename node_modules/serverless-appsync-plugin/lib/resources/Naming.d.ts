import { DataSourceConfig, PipelineFunctionConfig, ResolverConfig } from '../types/plugin';
export declare class Naming {
    private apiName;
    constructor(apiName: string);
    getCfnName(name: string): string;
    getLogicalId(name: string): string;
    getApiLogicalId(): string;
    getSchemaLogicalId(): string;
    getDomainNameLogicalId(): string;
    getDomainCertificateLogicalId(): string;
    getDomainAssociationLogicalId(): string;
    getDomainReoute53RecordLogicalId(): string;
    getLogGroupLogicalId(): string;
    getLogGroupRoleLogicalId(): string;
    getLogGroupPolicyLogicalId(): string;
    getCachingLogicalId(): string;
    getLambdaAuthLogicalId(): string;
    getApiKeyLogicalId(name: string): string;
    getDataSourceLogicalId(name: string): string;
    getDataSourceRoleLogicalId(name: string): string;
    getResolverLogicalId(type: string, field: string): string;
    getPipelineFunctionLogicalId(name: string): string;
    getWafLogicalId(): string;
    getWafAssociationLogicalId(): string;
    getDataSourceEmbeddedLambdaResolverName(config: DataSourceConfig): string;
    getResolverEmbeddedSyncLambdaName(config: ResolverConfig | PipelineFunctionConfig): string;
    getAuthenticationEmbeddedLamdbaName(): string;
}
