import type { IExtension } from './IExtension'

interface ExtensionExecutor {
    on: <T extends IExtension<any>>(
        predicate: (extension: IExtension<any>) => extension is T,
        action: (extension: T) => void,
    ) => this
    has: <T extends IExtension<any>>(isProvider: (extension: IExtension<any>) => extension is T) => boolean
}

export const extensionUtils = {
    from(extensions: IExtension<any>[]): ExtensionExecutor {
        return {
            on<T extends IExtension<any>>(
                predicate: (extension: IExtension<any>) => extension is T,
                action: (extension: T) => void,
            ) {
                for (const extension of extensions) {
                    if (predicate(extension)) {
                        action(extension)
                    }
                }
                return this
            },
            has<T extends IExtension<any>>(
                isProvider: (extension: IExtension<any>) => extension is T,
            ): boolean {
                return extensions.some(isProvider)
            },
        }
    },
}
