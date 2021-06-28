/**
 * The service allows to register new child container in Root Scope
 * Method 'register' will be added during app bootstrap when root container is created
 */
import { DIContainer } from './DIContainer'

export class RootContainerService {
    private readonly register: (container: DIContainer) => void

    constructor(register: (container: DIContainer) => void) {
        this.register = register
    }

    registerEntityInRootContainer<T>(entity: T): void {
        // entity.container is a protected property and it is the only place where the protection should be broken
        this.register(entity['container'])
    }
}
