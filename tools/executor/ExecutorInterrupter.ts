import type { IExecutionContextProvider } from './IExecutionContext'

export interface IExecutorInterrupter {
    interrupted: boolean
    interrupt: () => void
}

export const ExecutorInterrupter = {
    isInterrupted(contexts: IExecutionContextProvider<any>): boolean {
        const interrupt = contexts.getContext(ExecutorInterrupter.interruptContext)

        return interrupt.interrupted
    },

    interrupt(contexts: IExecutionContextProvider<any>): void {
        const interrupt = contexts.getContext(ExecutorInterrupter.interruptContext)

        interrupt.interrupt()
    },

    interruptContext(): IExecutorInterrupter {
        return {
            interrupted: false,
            interrupt() {
                this.interrupted = true
            },
        }
    },

    interrupter(flag: () => Promise<boolean> | boolean) {
        return async (_: any, contexts: IExecutionContextProvider<any>): Promise<void> => {
            const interrupt = contexts.getContext(ExecutorInterrupter.interruptContext)

            if (await flag()) {
                interrupt.interrupt()
            }
        }
    },
}
