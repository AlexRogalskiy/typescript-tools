import {PlatformDeps} from '../../typings/domain-types'

export const platformDeps: PlatformDeps = {
    readFileFromPath: () => {
        throw new Error("not implemented");
    },
    getRequestToken: () => {
        throw new Error("not implemented");
    },
    getDefaultAuth: () => {
        throw new Error("not implemented");
    },
    buildPlatformDependentConfig: () => {
        throw new Error("not implemented");
    },
    buildHeaders: () => {
        throw new Error("not implemented");
    },
    buildFormDataValue: () => {
        throw new Error("not implemented");
    },
    buildBaseUrl: () => {
        throw new Error("not implemented");
    },
    getVersion: () => {
        throw new Error("not implemented");
    },
}

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
    platformDeps.readFileFromPath = deps.readFileFromPath!;
    platformDeps.getRequestToken = deps.getRequestToken!;
    platformDeps.getDefaultAuth = deps.getDefaultAuth!;
    platformDeps.buildPlatformDependentConfig =
        deps.buildPlatformDependentConfig!;
    platformDeps.buildHeaders = deps.buildHeaders!;
    platformDeps.buildFormDataValue = deps.buildFormDataValue!;
    platformDeps.buildBaseUrl = deps.buildBaseUrl!;
    platformDeps.getVersion = deps.getVersion!;
}
