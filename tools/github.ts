import axios from 'axios'
import fetch from 'node-fetch'

import { GitHub } from '../typings/domain-types'

export const normalizeGithubResource = (res: any): GitHub => {
    return {
        id: res.id,
        name: res.name,
        full_name: res.full_name,
        description: res.description,
        url: res.html_url,
        stars: res.stargazers_count,
        forks: res.forks,
        opened_issues: res.open_issues_count,
        homepage: res.homepage,
    }
}

export const fetchGithubResource = async (ownerAndRepo: string): Promise<GitHub> => {
    try {
        const res = await fetch(`https://api.github.com/repos/${ownerAndRepo}`, {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        })
        const json = await res.json()

        return normalizeGithubResource(json)
    } catch (error) {
        console.error('an error occurred while fetching github resource', error)
        throw error
    }
}

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
