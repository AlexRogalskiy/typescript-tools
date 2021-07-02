export const pipe = (...fns: any[]): any => {
    return (val: any): any => fns.reduce((res, fn) => fn(res), val)
}

export const compose = (...fns: any[]): any => {
    return (val: any): any => fns.reduceRight((res, fn) => fn(res), val)
}
