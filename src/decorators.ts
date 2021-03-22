import { Functions } from './functions'
import getFunctionArgs = Functions.getFunctionArgs

export function autoResetStyle() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const raw = target[propertyKey]

        descriptor.value = function (this: { context: CanvasRenderingContext2D }, ...args: any[]) {
            this.context.save()
            const result = raw.apply(this, args)
            this.context.restore()

            return result
        }

        return descriptor
    }
}

/**
 * Class function introspection decorator
 * @desc logs function parameters and corresponding actual values
 */
export function introspect<T>() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const raw = target[propertyKey]

        descriptor.value = function (this: T, ...args: any[]) {
            console.log(
                `>>> Executing function [${propertyKey}] >>> params: [${getFunctionArgs(
                    raw,
                )}], values: [${args}]`,
            )
            raw.apply(this, args)
        }

        return descriptor
    }
}
