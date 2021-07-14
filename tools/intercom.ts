import crypto from 'crypto'

export const hashUserId = (user_id: string, secret: string): string => {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(user_id)

    return hmac.digest('hex')
}
