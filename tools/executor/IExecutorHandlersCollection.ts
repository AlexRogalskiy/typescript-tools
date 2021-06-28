import type { IExecutionContextProvider } from './IExecutionContext'
import type { IExecutorHandler } from './IExecutorHandler'

export type ExecutorDataMap<T, TNext> = (data: T, contexts: IExecutionContextProvider<T>) => TNext
export type ChainLinkType = 'next' | 'before'

export interface IChainLink<T> {
    executor: IExecutorHandlersCollection<any>
    map?: ExecutorDataMap<T, any>
    type: ChainLinkType
}

export interface IExecutorHandlersCollection<T = unknown> {
    readonly handlers: IExecutorHandler<T>[]
    readonly postHandlers: IExecutorHandler<T>[]
    readonly chain: IChainLink<T>[]
    readonly collections: IExecutorHandlersCollection<T>[]

    before: <TNext>(executor: IExecutorHandlersCollection<TNext>, map?: ExecutorDataMap<T, TNext>) => this
    next: <TNext>(executor: IExecutorHandlersCollection<TNext>, map?: ExecutorDataMap<T, TNext>) => this
    addCollection: (collection: IExecutorHandlersCollection<T>) => this
    addHandler: (handler: IExecutorHandler<T>) => this
    removeHandler: (handler: IExecutorHandler<T>) => void
    addPostHandler: (handler: IExecutorHandler<T>) => this
    removePostHandler: (handler: IExecutorHandler<T>) => void

    for: (link: IExecutorHandlersCollection<any>) => IExecutorHandlersCollection<T>
    getLinkHandlers: (link: IExecutorHandlersCollection<any>) => IExecutorHandlersCollection<T> | undefined
}
