import jwt from 'jsonwebtoken'

export const signAccessToken = (user_id: string, expiresIn: string, secret: string): string => {
    return jwt.sign({ user_id }, secret, {
        expiresIn,
    })
}

export const verifyAccessToken = (accessToken: string, secret: string): string | null => {
    if (!accessToken) return null // default is empty string

    try {
        const decoded = jwt.verify(accessToken, secret) as {
            user_id?: string
        }

        return decoded.user_id || null
    } catch (error) {
        return null
    }
}
