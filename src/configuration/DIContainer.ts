import { Container } from 'inversify'
import {
    InjectionToken,
    IServiceCollection,
    IServiceInjector,
    ITypedConstructor,
} from '../../typings/function-types'
import { Checkers } from '../check/checkers'
import isConstructor = Checkers.isConstructor

export class DIContainer implements IServiceInjector, IServiceCollection {
    protected container = new Container({
        defaultScope: 'Singleton',
        skipBaseClassChecks: true,
    })

    private parent: DIContainer | null = null

    constructor(parent?: DIContainer) {
        if (parent) {
            this.bindWithParent(parent)
        }
    }

    bindWithParent(parent: DIContainer): void {
        this.container.parent = parent.container
        this.parent = parent
    }

    unbindParent(): void {
        this.container.parent = null
        this.parent = null
    }

    getParent(): DIContainer | null {
        return this.parent
    }

    getServiceByClass<T>(ctor: ITypedConstructor<T>): T {
        return this.container.get<T>(ctor)
    }

    getServiceByToken<T>(token: InjectionToken<T>): T {
        return this.container.get<T>(token)
    }

    resolveServiceByClass<T>(ctor: ITypedConstructor<T>): T {
        return this.container.resolve(ctor)
    }

    addServiceByClass(Ctor: ITypedConstructor<any>): void {
        this.container.bind(Ctor).toSelf()
    }

    addServiceByToken<T extends Record<string, any>>(
        token: InjectionToken<T>,
        value: T | ITypedConstructor<T>,
    ): void {
        if (isConstructor(value)) {
            this.container.bind(token).to(value)
        } else {
            this.container.bind(token).toConstantValue(value)
        }
    }
}
