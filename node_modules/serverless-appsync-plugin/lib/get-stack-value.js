"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = exports.getServerlessStackName = void 0;
function getServerlessStackName(provider) {
    return provider.naming.getStackName();
}
exports.getServerlessStackName = getServerlessStackName;
function getValue(provider, value, name) {
    if (typeof value === 'string') {
        return Promise.resolve(value);
    }
    else if (value && typeof value.Ref === 'string') {
        return provider
            .request('CloudFormation', 'listStackResources', {
            StackName: getServerlessStackName(provider),
        })
            .then(function (result) {
            var resource = result.StackResourceSummaries.find(function (r) { return r.LogicalResourceId === value.Ref; });
            if (!resource) {
                throw new Error("".concat(name, ": Ref \"").concat(value.Ref, " not found"));
            }
            return resource.PhysicalResourceId;
        });
    }
    return Promise.reject(new Error("".concat(value, " is not a valid ").concat(name)));
}
exports.getValue = getValue;
//# sourceMappingURL=get-stack-value.js.map