import type { IExecutionContext, IExecutionContextProvider } from './IExecutionContext'
import type { IExecutorHandlersCollection } from './IExecutorHandlersCollection'

export interface IExecutor<T = void> extends IExecutorHandlersCollection<T> {
    readonly executing: boolean

    execute: (
        data: T,
        context?: IExecutionContext<T>,
        scope?: IExecutorHandlersCollection<T>,
    ) => Promise<IExecutionContextProvider<T>>

    executeScope: (
        data: T,
        scope?: IExecutorHandlersCollection<T>,
        context?: IExecutionContext<T>,
    ) => Promise<IExecutionContextProvider<T>>
}
