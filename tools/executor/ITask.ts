export interface ITask<T> {
    readonly id: T
    readonly task: Promise<any>
}
