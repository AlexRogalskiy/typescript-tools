export interface IConnectionFormStateInfo {
    edited: boolean;
    disabled: boolean;
    readonly: boolean;
    statusMessage: string | null;
}

export interface IConnectionFormStateContext extends IConnectionFormStateInfo {
    markEdited: () => void;
    setStatusMessage: (message: string | null) => void;
}

export function connectionFormStateContext(): IConnectionFormStateContext {
    return {
        edited: false,
        disabled: false,
        readonly: false,
        statusMessage: null,
        markEdited() {
            this.edited = true;
        },
        setStatusMessage(message: string | null) {
            this.statusMessage = message;
        },
    };
}
