export class Tracer {
    private nativeCodeEx = /\[native code]/
    private indentCount = -4
    private tracing: any[] = []

    trace(func, method: string, ...args: any[]): () => any {
        const traceOn = (): any => {
            const startTime = +new Date()
            const indentString = ' '.repeat((this.indentCount += 4))
            console.info(`${indentString + method}(${Array.prototype.slice.call(args).join(', ')})`)
            const result = func.apply(this, args)
            console.info(indentString + method, '-> ', result, '(', Date.now() - startTime, 'ms', ')')
            this.indentCount -= 4
            return result
        }

        traceOn.traceOff = func
        for (const prop in func) {
            if (Object.prototype.hasOwnProperty.call(func, prop)) {
                traceOn[prop] = func[prop]
            }
        }
        console.log(`tracing ${method}`)

        return traceOn
    }

    traceAll(root, recurse = false): void {
        if (root === window || !(typeof root === 'object' || typeof root === 'function')) {
            return
        }
        for (const key in root) {
            if (root.hasOwnProperty(key) && root[key] !== root) {
                const thisObj = root[key]
                if (typeof thisObj == 'function') {
                    if (this !== root && !thisObj.traceOff && !this.nativeCodeEx.test(thisObj)) {
                        root[key] = this.trace(root[key], key)
                        this.tracing.push({ obj: root, methodName: key })
                    }
                }
                recurse && this.traceAll(thisObj, true)
            }
        }
    }

    untraceAll(): void {
        for (const arg of this.tracing) {
            arg.obj[arg.methodName] = arg.obj[arg.methodName].traceOff
        }
        console.log('tracing disabled')
        this.tracing = []
    }
}
