import xpath from 'xpath'
import { DOMParser } from 'xmldom'

/**
 * Query an XML blob with XPath
 */
export const query = (xml: string, query?: string): any => {
    const dom = new DOMParser().parseFromString(xml)

    if (query === undefined) {
        throw new Error('Must pass an XPath query.')
    }

    try {
        const selectedValues = xpath.select(query, dom)
        const output: any[] = []

        // Functions return plain strings
        for (const selectedValue of selectedValues || []) {
            if (selectedValue.constructor.name === 'Attr') {
                output.push({
                    outer: (selectedValue as Attr).toString().trim(),
                    inner: (selectedValue as Attr).nodeValue,
                })
            } else if (selectedValue.constructor.name === 'Element') {
                output.push({
                    outer: (selectedValue as Node).toString().trim(),
                    inner: (selectedValue as Node).childNodes.toString(),
                })
            }
        }

        return output
    } catch (err) {
        throw new Error(`Invalid XPath query: ${query}`)
    }
}
