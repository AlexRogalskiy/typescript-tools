export default abstract class State {
    private readonly state: any = {}

    getState(): any {
        return this.state
    }
}
