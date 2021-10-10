import { IncomingMessage } from "http";

export type KubernetesError = {
    statusCode: number;
    message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const kubernetesError = (e: any): KubernetesError => {
    let statusCode = -1;
    const message = JSON.stringify(e);
    const err = e.response as IncomingMessage;

    if (err && "statusCode" in err && err.statusCode) {
        statusCode = err.statusCode;
    }

    return { statusCode, message };
};

export class KubernetesApiNotAvailableError extends Error {
    constructor(...args: (string | undefined)[]) {
        super(...args);
        Error.captureStackTrace(this, KubernetesApiNotAvailableError);
    }
}

function dryRun(): boolean {
    return process.env.DRY_RUN_UPGRADES === "true";
}
