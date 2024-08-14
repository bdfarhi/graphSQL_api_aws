import { PipelineFunctionConfig, ResolverConfig } from '../types/plugin';
import { Api } from './Api';
export declare class SyncConfig {
    private api;
    private config;
    constructor(api: Api, config: ResolverConfig | PipelineFunctionConfig);
    compile(): {
        LambdaConflictHandlerConfig?: {
            LambdaConflictHandlerArn: string | import("../types/cloudFormation").IntrinsicFunction;
        } | undefined;
        ConflictHandler?: "OPTIMISTIC_CONCURRENCY" | "AUTOMERGE" | "LAMBDA" | undefined;
        ConflictDetection: "NONE" | "VERSION";
    } | undefined;
}
