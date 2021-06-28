import { inject as inversifyInject, injectable as inversifyInjectable } from 'inversify'

import { AnnotationDescriptor, ValueToken } from '../../typings/function-types'

export function injectable(): (target: any) => any {
    return inversifyInjectable()
}

export function inject<T>(token: ValueToken<T>): AnnotationDescriptor<T, void> {
    return inversifyInject(token)
}
