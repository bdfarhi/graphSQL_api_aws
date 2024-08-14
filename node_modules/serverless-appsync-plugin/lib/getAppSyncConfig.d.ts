import { AppSyncConfig } from './types';
import { AppSyncConfig as PluginAppSyncConfig } from './types/plugin';
export declare const isUnitResolver: (resolver: {
    kind?: 'UNIT' | 'PIPELINE';
}) => resolver is {
    kind: 'UNIT';
};
export declare const isPipelineResolver: (resolver: {
    kind?: 'UNIT' | 'PIPELINE';
}) => resolver is {
    kind: 'PIPELINE';
};
export declare const getAppSyncConfig: (config: AppSyncConfig) => PluginAppSyncConfig;
