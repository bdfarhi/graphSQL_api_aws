import { CfnResources, IntrinsicFunction } from '../types/cloudFormation';
import { ResolverConfig } from '../types/plugin';
import { Api } from './Api';
export declare class Resolver {
    private api;
    private config;
    constructor(api: Api, config: ResolverConfig);
    compile(): CfnResources;
    resolveJsCode: (filePath: string) => string | IntrinsicFunction;
    resolveMappingTemplate(type: 'request' | 'response'): string | IntrinsicFunction | undefined;
}
