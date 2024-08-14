import { CfnResources, CfnWafAction, CfnWafRule, CfnWafRuleStatement } from '../types/cloudFormation';
import { ApiKeyConfig, WafConfig, WafRule, WafRuleDisableIntrospection, WafThrottleConfig } from '../types/plugin';
import { Api } from './Api';
export declare class Waf {
    private api;
    private config;
    constructor(api: Api, config: WafConfig);
    compile(): CfnResources;
    buildWafRules(): {
        Priority: number;
        Action?: CfnWafAction | undefined;
        Name: string;
        OverrideAction?: CfnWafAction | undefined;
        Statement: CfnWafRuleStatement;
        VisibilityConfig: unknown;
    }[];
    buildWafRule(rule: WafRule, defaultNamePrefix?: string): CfnWafRule;
    buildApiKeysWafRules(): CfnWafRule[];
    buildApiKeyRules(key: ApiKeyConfig): CfnWafRule[];
    mergeWafRuleStatements(statements: CfnWafRuleStatement[]): CfnWafRuleStatement;
    getWafVisibilityConfig(visibilityConfig: Record<string, unknown> | undefined, defaultName: string): {
        CloudWatchMetricsEnabled: {};
        MetricName: {};
        SampledRequestsEnabled: {};
    };
    buildDisableIntrospectionRule(config: WafRuleDisableIntrospection['disableIntrospection'], defaultNamePrefix?: string): CfnWafRule;
    buildThrottleRule(config: WafThrottleConfig, defaultNamePrefix?: string): CfnWafRule;
}
