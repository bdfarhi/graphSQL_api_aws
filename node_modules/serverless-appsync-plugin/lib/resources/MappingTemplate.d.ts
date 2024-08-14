import { IntrinsicFunction } from '../types/cloudFormation';
import { Substitutions } from '../types/plugin';
import { Api } from './Api';
type MappingTemplateConfig = {
    path: string;
    substitutions?: Substitutions;
};
export declare class MappingTemplate {
    private api;
    private config;
    constructor(api: Api, config: MappingTemplateConfig);
    compile(): string | IntrinsicFunction;
    processTemplateSubstitutions(template: string): string | IntrinsicFunction;
    /**
     * Creates Fn::Join object from given template where all given substitutions
     * are wrapped in Fn::Sub objects. This enables template to have also
     * characters that are not only alphanumeric, underscores, periods, and colons.
     *
     * @param {*} template
     * @param {*} substitutions
     */
    substituteGlobalTemplateVariables(template: string, substitutions: Substitutions): IntrinsicFunction;
}
export {};
