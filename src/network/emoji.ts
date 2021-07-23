import fs from 'fs'
import * as emojiRawData from '../../data/emoji.json'

const convert = (unicode: string): any => {
    if (unicode.includes('-')) {
        const parts: any[] = []
        const s = unicode.split('-')
        for (const str of s) {
            const part = parseInt(str, 16)
            let charCode = ''
            if (part >= 0x10000 && part <= 0x10ffff) {
                const hi = Math.floor((part - 0x10000) / 0x400) + 0xd800
                const lo = ((part - 0x10000) % 0x400) + 0xdc00
                charCode = String.fromCharCode(hi) + String.fromCharCode(lo)
            } else {
                charCode = String.fromCharCode(part)
            }
            parts.push(charCode)
        }
        return parts.join('')
    } else {
        const s = parseInt(unicode, 16)
        if (s >= 0x10000 && s <= 0x10ffff) {
            const hi = Math.floor((s - 0x10000) / 0x400) + 0xd800
            const lo = ((s - 0x10000) % 0x400) + 0xdc00
            return String.fromCharCode(hi) + String.fromCharCode(lo)
        } else {
            return String.fromCharCode(s)
        }
    }
}

const unnecessaryProperties = [
    'text',
    'texts',
    'sort_order',
    'added_in',
    'has_img_apple',
    'has_img_google',
    'has_img_twitter',
    'has_img_facebook',
    'has_img_messenger',
    'non_qualified',
    'docomo',
    'au',
    'softbank',
    'google',
]

export function updateEmojiData(): any {
    const emojis: any[] = (emojiRawData as any[])
        .sort((a: any, b: any) => {
            return a.sort_order - b.sort_order
        })
        .map((a: any) => {
            a.char = convert(a.unified)
            for (const key in a) {
                if (unnecessaryProperties.includes(key)) {
                    a[key] = null
                    delete a[key]
                }
            }
            return a
        })

    fs.writeFileSync('src/emoji.json', JSON.stringify(emojis, null, 2))

    return emojis
}
