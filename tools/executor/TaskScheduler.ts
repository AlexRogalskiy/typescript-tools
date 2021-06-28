import { computed, observable, makeObservable } from 'mobx'

import type { ITask } from './ITask'

export type BlockedExecution<T> = (active: T, current: T) => boolean

const queueLimit = 100

export class TaskScheduler<TIdentifier> {
    get activeList(): TIdentifier[] {
        return this.queue.map(task => task.id)
    }

    get executing(): boolean {
        return this.queue.length > 0
    }

    private readonly queue: ITask<TIdentifier>[]

    private readonly isBlocked: BlockedExecution<TIdentifier> | null

    constructor(isBlocked: BlockedExecution<TIdentifier> | null = null) {
        makeObservable<TaskScheduler<TIdentifier>, 'queue'>(this, {
            activeList: computed,
            queue: observable.shallow,
        })

        this.queue = []
        this.isBlocked = isBlocked
    }

    async schedule<T>(
        id: TIdentifier,
        promise: () => Promise<T>,
        after?: () => Promise<any> | any,
        success?: () => Promise<any> | any,
        error?: (exception: Error) => Promise<any> | any,
    ): Promise<T> {
        const task: ITask<TIdentifier> = {
            id,
            task: this.scheduler(id, promise),
        }

        if (this.queue.length > queueLimit) {
            throw new Error('Execution queue limit is reached')
        }
        this.queue.push(task)

        try {
            const value = await task.task
            await success?.()
            return value
        } catch (exception) {
            await error?.(exception)
            throw exception
        } finally {
            await after?.()
        }
    }

    async wait(): Promise<void> {
        const queueList = this.queue.slice()

        for (const task of queueList) {
            try {
                await task.task
            } catch (e) {
                console.error('Cannot process task', e)
            }
        }
    }

    private async scheduler<T>(id: TIdentifier, promise: () => Promise<T>): Promise<T> {
        try {
            if (!this.isBlocked) {
                return await promise()
            }

            const queueList = this.queue.filter(active => this.isBlocked!(active.id, id))

            for (const task of queueList) {
                try {
                    await task.task
                } catch (e) {
                    console.error('Cannot process task', e)
                }
            }

            return await promise()
        } finally {
            this.queue.splice(
                this.queue.findIndex(task => task.id === id),
                1,
            )
        }
    }
}
