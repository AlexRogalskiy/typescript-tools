import type { IExecutionContextProvider } from './IExecutionContext'

export type IExecutorHandler<T> = (data: T, contexts: IExecutionContextProvider<T>) => any | Promise<any>
