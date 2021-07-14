import axios from 'axios'

export const token = async (code: string): Promise<string> => {
    const response = await axios({
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: {
            code,
            client_id: process.env.githubId,
            client_secret: process.env.githubSecret,
        },
    })

    return await response.data
}
