export function autoResetStyle() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const raw = target[propertyKey]

        descriptor.value = function (this: { context: CanvasRenderingContext2D }, ...args: any[]) {
            this.context.save()
            const r = raw.apply(this, args)
            this.context.restore()
            return r
        }

        return descriptor
    }
}

export function shouldRedraw<T>() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const raw = target[propertyKey]

        descriptor.value = function (this: T, ...args: any[]) {
            raw.apply(this, args)
        }

        return descriptor
    }
}
