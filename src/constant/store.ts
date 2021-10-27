import { observable, action } from 'mobx';

type ListItem = {};

export interface IListStore {
    items: ListItem[],
    spinning: boolean,
    add(value: string): void,
    delete(index: number): void,
    start(): void,
    finish(): void,
}

class ListStore implements IListStore {

    @observable
    items = [];

    @observable
    spinning = false;

    @action.bound
    add(value: string): void {
        const newItem = { text: value, color: 'white' };
        this.items.push(newItem);
    }

    @action.bound
    delete(index: number): void {
        this.items.splice(index, 1);
    }

    @action.bound
    start(): void {
        this.spinning = true;
    }

    @action.bound
    finish(): void {
        this.spinning = false;
    }
}

export default new ListStore();
