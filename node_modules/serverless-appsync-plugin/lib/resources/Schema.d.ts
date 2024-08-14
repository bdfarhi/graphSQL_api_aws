import { CfnResources } from '../types/cloudFormation';
import { Api } from './Api';
export declare class Schema {
    private api;
    private schemas;
    constructor(api: Api, schemas: string[]);
    compile(): CfnResources;
    valdiateSchema(schema: string): void;
    generateSchema(): string;
}
