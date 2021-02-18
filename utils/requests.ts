import fetch from 'unfetch'

export async function fetchJSON(url: string, options?): Promise<unknown> {
    const data = await fetch(url, options)
    const response = await checkStatus(data)

    return await response.json()
}

export async function fetchHTML(url: string, options?): Promise<string> {
    const data = await fetch(url, options)

    return await data.text()
}

const checkStatus = async (response): Promise<Response> => {
    if (response.ok) {
        return response
    }
    const error = new Error(response.statusText)
    error.message = response

    return Promise.reject(error)
}
