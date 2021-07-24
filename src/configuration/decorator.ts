export function trace(_: string): MethodDecorator {
    return (_, __: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args)
        }

        return descriptor
    }
}
