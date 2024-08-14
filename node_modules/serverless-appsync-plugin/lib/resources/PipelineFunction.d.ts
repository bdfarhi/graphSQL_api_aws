import { CfnResources, IntrinsicFunction } from '../types/cloudFormation';
import { PipelineFunctionConfig } from '../types/plugin';
import { Api } from './Api';
export declare class PipelineFunction {
    private api;
    private config;
    constructor(api: Api, config: PipelineFunctionConfig);
    compile(): CfnResources;
    resolveJsCode: (filePath: string) => string | IntrinsicFunction;
    resolveMappingTemplate(type: 'request' | 'response'): string | IntrinsicFunction | undefined;
}
