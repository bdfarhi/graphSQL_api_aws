import { TransformKeysToCfnCase } from './typeHelpers';
import { DateTime, Duration } from 'luxon';
export declare const timeUnits: {
    readonly y: "years";
    readonly q: "quarters";
    readonly M: "months";
    readonly w: "weeks";
    readonly d: "days";
    readonly h: "hours";
    readonly m: "minutes";
    readonly s: "seconds";
    readonly ms: "milliseconds";
};
declare const units: ("years" | "quarters" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds")[];
export type TimeUnit = typeof units[number];
export declare const toCfnKeys: <T extends Record<string, unknown>>(object: T) => { [K_3 in import("./typeHelpers").GetObjValues<{ [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; } extends infer T_2 ? { [K_1 in keyof T_2]: {
    key: K_1;
    value: { [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; }[K_1];
}; } : never>["value"]]: Extract<import("./typeHelpers").GetObjValues<{ [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; } extends infer T_2 ? { [K_1 in keyof T_2]: {
    key: K_1;
    value: { [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; }[K_1];
}; } : never>, {
    value: K_3;
}>["key"]; } extends infer T_1 ? { [K in keyof T_1]: import("./typeHelpers").CallRecursiveTransformIfObj<T[import("./typeHelpers").Cast<{ [K_3 in import("./typeHelpers").GetObjValues<{ [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; } extends infer T_2 ? { [K_1 in keyof T_2]: {
    key: K_1;
    value: { [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; }[K_1];
}; } : never>["value"]]: Extract<import("./typeHelpers").GetObjValues<{ [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; } extends infer T_2 ? { [K_1 in keyof T_2]: {
    key: K_1;
    value: { [K_2 in keyof T]: import("./typeHelpers").ToCfnCase<K_2>; }[K_1];
}; } : never>, {
    value: K_3;
}>["key"]; }[K], string>]>; } : never;
export declare const wait: (time: number) => Promise<void>;
export declare const parseDateTimeOrDuration: (input: string) => DateTime;
export declare const parseDuration: (input: string | number) => Duration;
export declare const getHostedZoneName: (domain: string) => string;
export declare const getWildCardDomainName: (domain: string) => string;
export declare const question: (question: string) => Promise<string>;
export declare const confirmAction: () => Promise<boolean>;
export {};
