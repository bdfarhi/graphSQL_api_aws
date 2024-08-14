import { CfnDataSource, CfnResources, IntrinsicFunction } from '../types/cloudFormation';
import { DataSourceConfig, DsDynamoDBConfig, DsOpenSearchConfig, DsHttpConfig, DsRelationalDbConfig, IamStatement, DsEventBridgeConfig } from '../types/plugin';
import { Api } from './Api';
export declare class DataSource {
    private api;
    private config;
    constructor(api: Api, config: DataSourceConfig);
    compile(): CfnResources;
    getDynamoDbConfig(config: DsDynamoDBConfig): CfnDataSource['Properties']['DynamoDBConfig'];
    getDeltaSyncConfig(config: DsDynamoDBConfig): {
        Versioned: boolean;
        DeltaSyncConfig: {
            BaseTableTTL: number;
            DeltaSyncTableName: string;
            DeltaSyncTableTTL: number;
        };
    } | undefined;
    getEventBridgeConfig(config: DsEventBridgeConfig): CfnDataSource['Properties']['EventBridgeConfig'];
    getOpenSearchConfig(config: DsOpenSearchConfig): CfnDataSource['Properties']['OpenSearchServiceConfig'];
    getRelationalDbConfig(config: DsRelationalDbConfig): CfnDataSource['Properties']['RelationalDatabaseConfig'];
    getHttpConfig(config: DsHttpConfig): CfnDataSource['Properties']['HttpConfig'];
    getHttpAuthorizationConfig(config: DsHttpConfig): {
        AuthorizationConfig: {
            AuthorizationType: "AWS_IAM";
            AwsIamConfig: {
                SigningRegion: string | IntrinsicFunction;
                SigningServiceName: string | IntrinsicFunction | undefined;
            };
        };
    } | undefined;
    compileDataSourceIamRole(): CfnResources | undefined;
    getDefaultDataSourcePolicyStatements(): IamStatement[] | undefined;
}
