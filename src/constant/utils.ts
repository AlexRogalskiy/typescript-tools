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
