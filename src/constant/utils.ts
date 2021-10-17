const between = (min: number, max: number) => (num: number) => num >= min && num < max;
const isK = between(1000, 1000000);
const isM = between(1000000, 1000000000);

const isInfinite = (num: number) => !isFinite(num);
const toK = (num: number) => `${(num / 1000).toFixed(1)}k`;
const toM = (num: number) => `${(num / 1000000).toFixed(1)}m`;
const toG = (num: number) => `${(num / 1000000000).toFixed(1)}g`;

export function prettyNumber(num: number) {
    if (isNaN(num) || isInfinite(num) || num < 1000) return String(num);
    if (isK(num)) return toK(num);
    if (isM(num)) return toM(num);
    return toG(num);
}

/**
 * Create string representation of command and arguments, removing
 * sensitive information.
 *
 * @param cmd command
 * @param args command arguments
 * @return sanitized string representing command
 */
export function cleanCommandString(cmd: string, args?: string[]): string {
    const cmdString = cmd + ((args && args.length > 0) ? ` '${args.join("' '")}'` : "");
    return cmdString.replace(/Authorization:\s+\w+\s+\w+/g, "Authorization: <hidden>");
}

export function nonce(length: number = 40): string {
    const crypto = require("crypto");
    return crypto
        .randomBytes(Math.ceil((length * 3) / 4))
        .toString("base64") // convert to base64 format
        .slice(0, length) // return required number of characters
        .replace(/\+/g, "0") // replace '+' with '0'
        .replace(/\//g, "0"); // replace '/' with '0'
}

/**
 * Mask secret string.
 * @param secret string to mask
 * @return masked string
 */
export function maskString(s: string): string {
    if (s.length > 10) {
        return s.charAt(0) + "*".repeat(s.length - 2) + s.charAt(s.length - 1);
    }
    return "*".repeat(s.length);
}

export type TermsDefinition<PARAMS, K extends keyof PARAMS = keyof PARAMS> =
    Record<K, AllowableTermDef<PARAMS>> & Partial<WhiteSpaceHandler> & Partial<SkipCapable>
    & { [index: string]: any };

/**
 * Options used by spawnPromise to execute a command.
 */
export interface SpawnPromiseOptions {
    /** Executable to spawn */
    command: string;
    /** Arguments to pass to executable */
    args?: string[];
    /** Directory to launch executable process in, default is process process.cwd */
    cwd?: string;
    /** If true, ensure package.json exist in cwd before running command */
    checkPackageJson?: boolean;
}

/**
 * Run a command and return a promise supplying the exit value of
 * the command.
 *
 * @param options see SpawnPromiseoptions
 * @return a Promise of the return value of the spawned command
 */
export async function spawnPromise(options: SpawnPromiseOptions): Promise<number> {
    const signals: { [key: string]: number } = {
        SIGHUP: 1,
        SIGINT: 2,
        SIGQUIT: 3,
        SIGILL: 4,
        SIGTRAP: 5,
        SIGABRT: 6,
        SIGBUS: 7,
        SIGFPE: 8,
        SIGKILL: 9,
        SIGUSR1: 10,
        SIGSEGV: 11,
        SIGUSR2: 12,
        SIGPIPE: 13,
        SIGALRM: 14,
        SIGTERM: 15,
        SIGCHLD: 17,
        SIGCONT: 18,
        SIGSTOP: 19,
        SIGTSTP: 20,
        SIGTTIN: 21,
        SIGTTOU: 22,
        SIGURG: 23,
        SIGXCPU: 24,
        SIGXFSZ: 25,
        SIGVTALRM: 26,
        SIGPROF: 27,
        SIGSYS: 31,
    };
    const cwd = (options.cwd) ? options.cwd : process.cwd();
    const spawnOptions: child_process.SpawnOptions = {
        cwd,
        env: process.env,
        stdio: "inherit",
    };
    const cmdString = cleanCommandString(options.command, options.args);
    try {
        if (options.checkPackageJson && !checkPackageJson(cwd)) {
            return 1;
        }
        print.info(`Running "${cmdString}" in '${cwd}'`);
        const cp = spawn(options.command, options.args, spawnOptions);
        return new Promise<number>((resolve, reject) => {
            cp.on("exit", (code, signal) => {
                if (code === 0) {
                    resolve(code);
                } else if (code) {
                    print.error(`Command "${cmdString}" failed with non-zero status: ${code}`);
                    resolve(code);
                } else {
                    print.error(`Command "${cmdString}" exited due to signal: ${signal}`);
                    if (signals[signal]) {
                        resolve(128 + signals[signal]);
                    }
                    resolve(128 + 32);
                }
            });
            cp.on("error", err => {
                const msg = `Command "${cmdString}" errored when spawning: ${err.message}`;
                print.error(msg);
                reject(new Error(msg));
            });
        });
    } catch (e) {
        print.error(`Failed to spawn command "${cmdString}": ${e.message}`);
        return 100;
    }
}

export function fromDecimalSeparated(str: string): number {
    if (!str || str === '') return 0;
    return parseInt(str.replace(',', ''));
}

export function toDecimalSeparated(num: number): string {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function keepInRange(num: number, min: number, max: number) {
    if (num < min) return min;
    else if (num > max) return max;
    else return num;
}

/**
 * random digits and letters (entropy: 53bit)
 */
export function randomId() {
    return (Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
}

/**
 * "prefix-randomId()-randomId()"
 */
export function simpleUniqueId(prefix?: string) {
    return `${prefix}-${randomId()}-${randomId()}`;
}

/**
 * 4x 'randomId()'
 */
export function uniqueId4(): string {
    return randomId() + randomId() + randomId() + randomId();
}


export function titleCase(str: string): string {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}
