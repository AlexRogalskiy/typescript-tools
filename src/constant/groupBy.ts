export function groupBy<T, K extends keyof T>(list: T[], key: K) {
    const map = new Map<T[K], T[]>()
    list.forEach(item => {
        const itemKey = item[key]
        if (!map.has(itemKey)) {
            map.set(itemKey, list.filter(i => i[key] === item[key]))
        }
    })
    return map
}

export const getDatasets = async (namespace: string, limit = 2000, offset = 0) => {
    const url = `${API_URL}/namespaces/${encodeURIComponent(
        namespace
    )}/datasets?limit=${limit}&offset=${offset}`
    return genericFetchWrapper(url, { method: 'GET' }, 'fetchDatasets').then((r: Datasets) => {
        return r.datasets.map(d => ({ ...d, namespace: namespace }))
    })
}

export const getDatasetVersions = async (
    namespace: string,
    dataset: string,
    limit = 100,
    offset = 0
) => {
    const url = `${API_URL}/namespaces/${encodeURIComponent(
        namespace
    )}/datasets/${dataset}/versions?limit=${limit}&offset=${offset}`
    return genericFetchWrapper(url, { method: 'GET' }, 'fetchDatasetVersions').then(
        (versions: DatasetVersions) => versions.versions
    )
}

export const genericErrorMessageConstructor = (functionName: string, error: APIError): string => {
    const { code, message, details } = error
    throw `${functionName} responded with error code ${code}: ${message}.  Here are the details: ${details}`
}

interface IParams {
    method: HttpMethod
    body?: string
}

export const parseResponse = async (response: Response, functionName: string) => {
    const body = await response.text()
    let json

    /*eslint no-unsafe-finally: "off"*/
    try {
        json = JSON.parse(body)
    } finally {
        if (response.ok) {
            return json || 'Success'
        } else {
            const errorMessage = json || {
                code: response.status,
                message: 'Unknown error occurred',
                details: body
            }
            const error = genericErrorMessageConstructor(functionName, errorMessage)
            throw new Error(error)
        }
    }
}

export const genericFetchWrapper = async <R>(
    url: string,
    params: IParams,
    functionName: string
) => {
    const response = await fetch(url, params)
    return parseResponse(response, functionName)
}

export const getSearch = async (q: string, filter = 'ALL', sort = 'NAME', limit = 100) => {
    let url = `${API_URL}/search/?q=${q}&sort=${sort}&limit=${limit}`
    if (filter === 'JOB' || filter === 'DATASET') {
        url += `&filter=${filter}`
    }
    return genericFetchWrapper<Search>(url, { method: 'GET' }, 'fetchSearch')
}

