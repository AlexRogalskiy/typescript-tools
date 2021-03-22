interface NotificationOptions {
    title: string
    body?: string
    silent?: boolean
    actions?: NotificationAction[]
    onClick?: (event: Event) => void
    onClose?: (event: Event) => void
}

export const notify = ({
    title,
    body,
    silent,
    actions,
    onClick,
    onClose,
}: NotificationOptions): Notification => {
    const notification = new Notification(title, {
        body,
        silent,
        actions,
    })

    if (onClick != null) {
        notification.onclick = onClick
    }
    if (onClose != null) {
        notification.onclose = onClose
    }

    return notification
}
