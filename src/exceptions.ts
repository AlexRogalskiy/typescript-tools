export namespace Exceptions {
    export const exception = (name: string, message: string): { name; message } => {
        return { name, message }
    }
}
