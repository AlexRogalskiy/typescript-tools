import fetch from 'node-fetch'

interface MDNJSONRes {
    doc: TranslatedMDNInfo
}

interface TranslatedMDNInfo {
    locale: string
    title: string
    summary: string
    mdn_url?: string
    url?: string
}

export const normalizeMdnResource = (res: MDNJSONRes): TranslatedMDNInfo[] => {
    const { locale, title, summary, mdn_url } = res.doc
    return [
        {
            locale,
            title,
            summary,
            url: mdn_url,
        },
    ]
}

export const fetchMdnResource = async (path: string): Promise<TranslatedMDNInfo[]> => {
    try {
        const url = `https://developer.mozilla.org${path}/index.json`
        const res = await fetch(url)
        const json: MDNJSONRes = await res.json()

        return normalizeMdnResource(json)
    } catch (error) {
        console.error('an error occurred while fetching mdn resource', error)
        throw error
    }
}
