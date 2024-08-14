import { IntrinsicFunction } from '../types/cloudFormation';
import { Substitutions } from '../types/plugin';
import { Api } from './Api';
type JsResolverConfig = {
    path: string;
    substitutions?: Substitutions;
};
export declare class JsResolver {
    private api;
    private config;
    constructor(api: Api, config: JsResolverConfig);
    compile(): string | IntrinsicFunction;
    getResolverContent(): string;
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
