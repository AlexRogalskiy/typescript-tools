import { makeObservable, observable } from 'mobx'

import { DIContainer } from './DIContainer'
import { InjectionToken, IServiceInjector, ITypedConstructor } from '../../typings/function-types'
import { CommonUtils } from '../utils/common-utils'
import { uuid } from '../../tools/uuid_'

import ServiceInjectorToken = CommonUtils.ServiceInjectorToken

export class Entity {
    readonly id: string

    protected container = new DIContainer()
    protected children = new Map<string, Entity>()

    private mixins: InjectionToken<any>[] = []

    constructor(providers: MixinProvider<any>[] = [], id?: string) {
        makeObservable<Entity, 'children'>(this, {
            children: observable.shallow,
        })

        this.id = id || uuid()
        this.addMixin(Entity, this)
        this.addMixin(ServiceInjectorToken, this.getServiceInjector())
        this.addProviders(providers)
    }

    addChild(entity: Entity): void {
        if (this.children.has(entity.id)) {
            this.removeChild(entity.id)
            // throw new Error(`Entity (${this.id}) already contains child entity (${entity.id})`);
        }
        this.children.set(entity.id, entity)
        entity.bindWithParent(this)
    }

    removeChild(id: string): void {
        if (!this.children.has(id)) {
            return
            // throw new Error(`Child entity (${id}) not found in entity (${this.id})`);
        }
        const entity = this.children.get(id)
        if (entity) {
            entity.destroyEntity()
            this.children.delete(id)
        }
    }

    removeAll(): void {
        const ids: string[] = []

        for (const [key, value] of this.children) {
            ids.push(key)
            value.destroyEntity()
        }

        for (const id of ids) {
            this.children.delete(id)
        }
    }

    getChild(id: string): Entity | undefined {
        return this.children.get(id)
    }

    /**
     * to use for creation of nested React context
     */
    getServiceInjector(): IServiceInjector {
        return this.container
    }

    protected bindWithParent(entity: Entity): void {
        this.container.bindWithParent(entity.container)
    }

    /**
     * Destroy mixins in the reverse order of addition
     */
    destroyEntity(): void {
        for (const token of this.mixins.reverse()) {
            const mixin = this.getMixin(token) as IDestroyableMixin
            if (mixin.destruct) {
                mixin.destruct()
            }
        }
    }

    protected addProviders(providers: MixinProvider<any>[]): void {
        for (const provider of providers) {
            if (typeof provider === 'function') {
                this.addMixin(provider)
            } else {
                this.addMixin(provider.token, provider.value)
            }
        }
    }

    protected addMixin(ctor: ITypedConstructor<any>): void
    protected addMixin<T extends Record<string, any>>(token: InjectionToken<T>, value: T): void
    protected addMixin<T extends Record<string, any>>(ctorOrToken: InjectionToken<T>, value?: T): void {
        this.mixins.push(ctorOrToken as InjectionToken<any>)
        if (value !== undefined) {
            this.container.addServiceByToken(ctorOrToken, value)
            return
        }
        this.container.addServiceByClass(ctorOrToken as ITypedConstructor<any>)
    }

    getMixin<T>(token: InjectionToken<T>): T {
        return this.container.getServiceByToken<T>(token)
    }
}

export type MixinProvider<T extends Record<string, any>> =
    | ITypedConstructor<T>
    | {
          token: InjectionToken<T>
          value: T
      }

export interface IDestroyableMixin {
    destruct: () => void
}
