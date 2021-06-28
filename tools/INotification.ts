export interface IProcessNotificationState {
    readonly error: Error | null
    readonly title: string
    readonly status: ENotificationType
    readonly message: string | null
    init: (title: string, message?: string) => void
    resolve: (title: string, message?: string) => void
    reject: (error: Error, title?: string, message?: string) => void
}

export enum ENotificationType {
    Info = 'Info',
    Error = 'Error',
    Success = 'Success',
    Loading = 'Loading',
    Custom = ' Custom',
}

export interface INotificationExtraProps<T = never> {
    source?: T
}

export interface INotificationProcessExtraProps<T = never> extends INotificationExtraProps<T> {
    state?: IProcessNotificationState
}

export interface IProcessNotificationContainer<TProps> {
    controller: IProcessNotificationState
    notification: INotification<TProps>
}

export type NotificationComponentProps<
    TProps extends INotificationExtraProps<any> = INotificationExtraProps,
> = TProps & {
    notification: INotification<TProps>
}

// export type NotificationComponent<
// TProps extends INotificationExtraProps<any> = INotificationExtraProps,
// > = React.FunctionComponent<NotificationComponentProps<TProps>>;

export interface INotification<TProps extends INotificationExtraProps<any> = INotificationExtraProps> {
    readonly id: number
    type: ENotificationType
    title: string
    message?: string
    timestamp: number
    details?: string | Error
    persistent?: boolean
    state: { deleteDelay: number }
    isSilent: boolean
    extraProps: TProps
    // customComponent?: () => NotificationComponent<TProps>;
    close: (delayDeleting?: boolean) => void
    showDetails: () => void
}

export interface INotificationOptions<TProps extends INotificationExtraProps<any> = INotificationExtraProps> {
    title: string
    message?: string
    details?: string | Error
    isSilent?: boolean
    persistent?: boolean
    extraProps?: TProps
    timestamp?: number
    onClose?: (delayDeleting?: boolean) => void
    // customComponent?: () => NotificationComponent<TProps>;
}
