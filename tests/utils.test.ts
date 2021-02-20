import { describe, test } from '@jest/globals'

import { TranslationUtils } from '../src'

export namespace TranslationUtils_Test {
    import translateBy = TranslationUtils.translateBy

    type TranslationPattern<T extends string, V> = { [K in T]: V }

    const alphabets: TranslationPattern<string, string> = {
        'Aurebesh': 'ロコYㅣᗐΞΔᐳㅡ',
        'Katakana': 'アウセヌネハヘホミ',
        'Greek': 'πβεγμτφθλ',
        'Hangul': 'ᅺᅻᅼᅽᅾᅿᆀᆁᆂᆃ',
        'Thai': 'กวอซฝคงญฒ',
        'Cyrillic': 'БДИЖЩЗЛЮФ',
        'Gurmukhi': 'ਗਨਹਤਕੲਲੜਵ',
        'Hebrew': 'אבגדהוחטכ',
        'Javanese': 'ꦊꦄꦌꦍꦎꦏꦐꦑꦒ',
        'Yi': 'ꆇꉄꉦꊗꀻꃋꆚꋕꐍ',
        'Telugu': 'జ్ఞా,తె,లు,గు,ణి,తా,ము,రా,బ,కి',
        'Runes': 'ᚦᚢᚠᚻᛉᛊᛇᛟᛞ',
        'Carian': '𐊾,𐋂,𐊼,𐊧,𐋀,𐊫,𐋇,𐊦,𐊣',
        'Diacritical Marks': 'ò́̂,o̖̔̕,o̞̟̠,ò́̂̃,o̖̗̔̕,o̡̞̟̠,o̡̢̞̟̠̣,o̖̗̘̙̔̕,ò́̂̃̄',
        'Arabic': 'غػؼؽؾؿـفق',
        'Buginese': 'ᨆᨊᨎᨂᨇᨋᨏᨃᨅ',
        'ᐳㅣᐸ': 'ᐳᐸㅣ',
        'ooo': 'òŏôǒöőõȯōȍ',
        'reserved': '𝖻𝗋𝖾𝖺𝗄,𝗍𝗁𝗋𝗈𝗐,𝖼𝖺𝗍𝖼𝗁,𝖼𝗈𝗇𝗌𝗍,𝗏𝖺𝗋,𝗋𝖾𝗍𝗎𝗋𝗇,𝖽𝖾𝖿𝖺𝗎𝗅𝗍,𝗍𝗁𝗂𝗌,𝗏𝗈𝗂𝖽',
        'Deutsch': 'Ä,ja,nein,ö,Ü,sch,Schnitzel,Bier,ß',
        'SPACE': '_',
        'Solfège': 'Do,Re,Mi,Fa,Sol,La,Si',
        'XXX': 'xX',
        'Roman': 'IVXLCDM',
        'Kannada': 'ಠಉನಊಝಏೡಖತ',
        'Icelandic': 'ÞÐÓÆÝHÉTÍ',
        'Tifinagh': 'ⴼⵊⵏⵂⵗⵓⴻⵐⵜ',
        'Vai': 'ꔀꕐꖠꔢꖈꖕꔈꔉꔁ',
        'Ogham': 'ᚁᚆᚂᚇᚃᚈ',
        'Symbols': '_ʽːᆢ〱〳ㅡㅣㆍ',
        'Kanji': '㒓㒲㒳㒴㒵㒶㒷㒸㒺',
        'ABC': 'ABCDEFGHI',
        'Emoticons': 'ó‿ó,σ_σ,δﺡό,סּ_סּ,ಠ_ಠ,ö‿o,oﺡo,σ_o,ಠ‿ಠ',
        'Slash': '〳',
        'Filler': 'ﾠ,ﾠ‌,ﾠ‌‌,ﾠ‌‌‌,ﾠ‌‌‌‌,ﾠ‌‌‌‌‌,ﾠ‌‌‌‌‌‌,ﾠ‌‌‌‌‌‌‌',
    }

    describe("Test transliteration utils", () => {
        test('it should be a valid transliterated string',
            async () => {
                Object.keys(alphabets).forEach(name => {
                    const alphabet = alphabets[name]
                    const translation = translateBy(alphabet);

                    console.log(
                        `
                        <article>
                            <h3>${name}</h3>
                                <div class="alphabet">//&nbsp;${alphabet}</div>
                            <div>${translation}</div>
                        </article>
                        `
                    )
                })
            }
        )
    })
}
