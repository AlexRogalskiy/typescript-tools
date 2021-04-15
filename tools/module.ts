const internals = {
    list: ['coverage', 'leaks', 'lint', 'transform', 'types'],
}

export const addModule = (module: string): any => {
    return Object.defineProperty(exports, module, {
        configurable: true,
        enumerable: true,
        get() {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(`./${module}`)
        },
    })
}

for (const module of internals.list) {
    addModule(module)
}
