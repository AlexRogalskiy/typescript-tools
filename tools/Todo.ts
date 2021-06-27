import { makeObservable, observable, action } from 'mobx'

export class Todo {
    id = Math.random()
    title = ''
    finished = false

    constructor(title) {
        makeObservable(this, {
            title: observable,
            finished: observable,
            toggle: action,
        })
        this.title = title
    }

    toggle(): void {
        this.finished = !this.finished
    }
}
