import { EMOJI_REGEX, Strings } from '../src'

export namespace Strings_Test {
    import pad = Strings.pad;
    import parseJson = Strings.parseJson;
    import capFirstLetter = Strings.capitalFirstLetter;
    import formatNumber = Strings.formatNumber;
    import combinations = Strings.combinations;
    import permutations = Strings.permutations;
    import sortBy = Strings.sortBy;
    import format = Strings.format;
    import shortest = Strings.shortest;
    import getRomanNotation = Strings.getRomanNotation;
    import shortenString = Strings.shortenString;
    import stripComments = Strings.stripComments;
    import capitalize = Strings.capitalize;
    import quote = Strings.quote;
    import escape2 = Strings.escape2;
    import stringify = Strings.stringify;
    import joiner = Strings.joiner;
    import encoder = Strings.encoder;
    import replacer = Strings.replacer;
    import matcher = Strings.matcher;
    import lowerCase = Strings.lowerCase;
    import trimmer = Strings.trimmer;
    import longestSequence = Strings.longestSequence;
    import replaceBy = Strings.replaceBy;
    import repeat = Strings.repeat;
    import delim = Strings.delim;
    import generateSymbol = Strings.generateSymbol;
    import doubleQuote = Strings.doubleQuote;
    import joinList = Strings.joinList;
    import htmlText = Strings.htmlText;
    import getProjectId = Strings.getProjectId;
    import padLeft = Strings.padLeft;
    import htmlEncode = Strings.htmlEncode;
    import toUTF16 = Strings.toUTF16;

    describe('Check emoji string replacer', () => {
        it('it should replace emojis in a string', () => {
            expect(replaceBy(EMOJI_REGEX, '🎉Party 🚩Flags! 🚀Rockets!')).toEqual('Party Flags! Rockets!')
        })
        it('it should kill emojis in a string and replace by a set replacement value', () => {
            expect(replaceBy(EMOJI_REGEX, '🎉 Party 🚩 Flags! 🚀 Rockets!', 'X')).toEqual(
                'X Party X Flags! X Rockets!',
            )
        })
    })

    describe('Check convert html to text string', () => {
        it('it should return valid replaced html string', () => {
            expect(htmlText('<div>test</div>')).toEqual('test')
            expect(htmlText('<br/>')).toEqual('')
        })
    })

    describe('Check create project id', () => {
        it('it should return valid project id', () => {
            expect(getProjectId('test')).toEqual('test')
            expect(getProjectId('test.test2')).toEqual('testtest2')
            expect(getProjectId('test\'')).toEqual('test')
            expect(getProjectId('')).toEqual('')
        })
    })

    describe('Check create padding left', () => {
        it('it should return valid padded left string', () => {
            expect(padLeft('test', 6)).toEqual('  test')
            expect(padLeft('test', 1)).toEqual('test')
            expect(padLeft('test', 0)).toEqual('test')
            expect(padLeft('test', -1)).toEqual('test')
            expect(padLeft('', 1)).toEqual(' ')
        })
    })

    describe('Check html encoded string', () => {
        it('it should return valid html encoded string', () => {
            expect(htmlEncode('<div>test</div>')).toEqual('&lt;div&gt;test&lt;/div&gt;')
            expect(htmlEncode('©')).toEqual('(c)')
            expect(htmlEncode('test')).toEqual('test')
            expect(htmlEncode('')).toEqual('')
        })
    })

    describe('Check UTF16 conversion', () => {
        it('it should return valid UTF16 string', () => {
            expect(toUTF16(55)).toEqual('\\u37')
            expect(toUTF16(0)).toEqual('\\u0')
            expect(toUTF16(Number.MIN_VALUE)).toEqual('\\u0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004')
            expect(toUTF16(1)).toEqual('\\u1')
        })
    })

    describe('Check joining list to string', () => {
        it('it should return valid joined list string', () => {
            expect(joinList(['test', 'test2'])).toEqual('(?:test|test2)')
            expect(joinList([null, undefined, 1])).toEqual('(?:||1)')
            expect(joinList([])).toEqual('(?:)')
        })
    })

    describe('Check double quoted string', () => {
        it('it should return valid double quoted string', () => {
            expect(doubleQuote("test")).toEqual("\"test\"")
            expect(doubleQuote("test'test")).toEqual("\"test'test\"")
        })
    })

    describe('Check generate symbol', () => {
        it('it should return valid string symbol', () => {
            expect(typeof generateSymbol()).toEqual('string')
        })
    })

    describe('Check string delimiter', () => {
        it('it should return valid string delimiter', () => {
            expect(delim('w', 5)).toEqual('wwwww')
            expect(delim('wz', 5)).toEqual('wzwzwzwzwz')
            expect(delim('', 1)).toEqual('')
            expect(delim('abc', 3)).toEqual('abcabcabc')
            expect(delim('abc', 0)).toEqual('')
        })
    })

    describe('Check string repetition', () => {
        it('it should perform valid string repetition', () => {
            expect(repeat('w', 5)).toEqual('wwwww')
            expect(repeat('wz', 5)).toEqual('wzwzwzwzwz')
            expect(repeat('', 1)).toEqual('')
            expect(repeat('abc', 3)).toEqual('abcabcabc')
            expect(repeat('abc', 0)).toEqual('')
        })
    })

    describe('Check string combinations', () => {
        it('it should perform valid string combinations', () => {
            expect(combinations('wxyz').length).toEqual(15)
        })
    })

    describe('Check string permutations', () => {
        it('it should perform valid string permutations', () => {
            expect(permutations('hat').length).toEqual(6)
        })
    })

    describe('Check string sort order', () => {
        const list = ['Дельта', 'альфа', 'ЧАРЛИ', 'браво']

        it('it should perform valid string sort order', () => {
            expect(sortBy(null, ...list).join('-')).toEqual('альфа-браво-Дельта-ЧАРЛИ')
        })
    })

    describe('Check roman notation transformation', () => {
        it('it should return valid roman notation', () => {
            expect(getRomanNotation(5)).toEqual('V')
            expect(getRomanNotation(15)).toEqual('XV')
            expect(getRomanNotation(55)).toEqual('LV')
            expect(getRomanNotation(155)).toEqual('CLV')
        })
    })

    describe('Check shorten string operation', () => {
        it('it should return valid shortened string', () => {
            expect(shortenString('internationalisation', v => v.toUpperCase())).toEqual('I18N')
            expect(shortenString('localization', v => v.toUpperCase())).toEqual('L10N')
            expect(shortenString('internationalisation', v => v.toLowerCase())).toEqual('i18n')
            expect(shortenString('localization', v => v.toLowerCase())).toEqual('l10n')
        })
    })

    describe('Check shortest path between items', () => {
        const strings = ["or", "in", "at", "for", "after", "next", "before", "previous", "in"]

        it('it should return the shortest path', () => {
            expect(shortest(strings, "in", "at")).toEqual(1)
            expect(shortest(strings, "or", "at")).toEqual(2)
            expect(shortest(strings, "or", "for")).toEqual(3)
        })
    })

    describe('Check format number', () => {
        it('it should return valid number format', () => {
            expect(format(3)).toEqual('3')
            expect(format(3.1)).toEqual('3.1')
            expect(format(3.12)).toEqual('3.12')
            expect(format(3.123)).toEqual('3.12')
        })
    })

    describe('Check strip comments operation', () => {
        it('it should return valid string with stripped comments', () => {
            expect(stripComments('a + b// comment')).toEqual('a + b')
            expect(stripComments('1 + /* 2 */3')).toEqual('1 + 3')
            expect(stripComments('x = 10;// ten!')).toEqual('x = 10;')
            expect(stripComments('1 /* a */+/* b */ 1')).toEqual('1  1')
        })
    })

    describe('Check format human-readable number', () => {
        it('it should return valid format number with byte prefix', () => {
            expect(formatNumber(111, 1)).toEqual('111.0')
            expect(formatNumber(111222, 1)).toEqual('111.2 k')
            expect(formatNumber(111222333, 1)).toEqual('111.2 M')
            expect(formatNumber(111222333444, 1)).toEqual('111.2 G')
            expect(formatNumber(111222333444, 1)).toEqual('111.2 G')
            expect(formatNumber(111222333444, 3)).toEqual('111.222 G')
            expect(formatNumber(111222333444, 0)).toEqual('111 G')
        })
    })

    describe('Check capitalize letters string', () => {
        it('it should return valid string with capitalized first letters', () => {
            expect(capitalize('test')).toEqual('Test')
            expect(capitalize('valid format')).toEqual('Valid Format')
            expect(capitalize('valid format string')).toEqual('Valid Format String')
        })
    })

    describe('Check escape letters string', () => {
        it('it should return valid string with escaped letters', () => {
            expect(escape2('test_()')).toEqual('test_()')
            expect(escape2('test:test')).toEqual('test:test')
            expect(escape2('valid format string')).toEqual('valid format string')
        })
    })

    describe('Check stringify object properties', () => {
        it('it should return valid json string', () => {
            expect(stringify(new Date('2020-03-02T15:56:00'))).toEqual("\"2020-03-02T12:56:00.000Z\"")
            expect(stringify(1)).toEqual('1')
            expect(stringify({ a: 5, b: 6 }, 0)).toEqual("{\"a\":5,\"b\":6}")
            expect(stringify(['a', 1, true, false], 0)).toEqual("[\"a\",1,true,false]")
            expect(stringify(() => 5)).toEqual(undefined)
            expect(stringify(['a', '&&', 'b', ';', 'c'], 0)).toEqual("[\"a\",\"&&\",\"b\",\";\",\"c\"]")
        })
    })

    describe('Check string joiner', () => {
        it('it should return valid joined string', () => {
            expect(joiner('and', ['a', 1, true, false], 0)).toEqual('')
            expect(joiner('and', ['a', '&&', 'b', ';', 'c'], 0)).toEqual('')
        })
    })

    describe('Check encode string operation', () => {
        it('it should return valid encoded string', () => {
            expect(encoder('rhinocerous')).toEqual('rikqshkyw~}')
            expect(encoder('test')).toEqual('tfuw')
            expect(encoder('gender')).toEqual('gfpgiw')
        })
    })

    describe('Check string replacement by pattern', () => {
        it('it should return valid string with replacement pattern', () => {
            expect("Smith, Bob; Raman, Ravi; Jones, Mary"['replaceWith'](/([\w]+), ([\w]+)/g, "$2 $1")).toEqual('Bob Smith; Ravi Raman; Mary Jones')
            expect(""['replaceWith'](/([\w]+), ([\w]+)/g, "$2 $1")).toEqual('')
            expect("test1, test2"['replaceWith'](/([\w]+), ([\w]+)/g, "$2 $1")).toEqual('test2 test1')
            expect("California, San Francisco, O'Rourke, Gerry"['replaceWith'](/([\w'\s]+), ([\w'\s]+), ([\w'\s]+), ([\w'\s]+)/, "$4 $3 lives in $2, $1")).toEqual('Gerry O\'Rourke lives in San Francisco, California')
        })

        it('it should return valid string with replacement functional pattern', () => {
            expect("72 101 108 108 111  87 111 114 108 100 33"['replaceByRegex'](/(\d+)(\s?)/gi, (_, $1) => String.fromCharCode($1))).toEqual('Hello World!')
            expect("hello, world!"['replaceByRegex'](/(\S+)(\s?)/gi, (_, $1) => $1.toUpperCase())).toEqual('HELLO,WORLD!')
            expect("HELLO,WORLD!"['replaceByRegex'](/(\S+)(\s?)/gi, (_, $1) => $1.toLowerCase())).toEqual('hello,world!')
        })
    })

    describe('Check longest string sequence', () => {
        it('it should return valid longest string sequence', () => {
            expect(JSON.stringify(longestSequence((a, b) => a === b, 'skiing'))).toEqual("{\"member\":\"i\",\"count\":2}")
            expect(JSON.stringify(longestSequence((a, b) => a === b, 'test'))).toEqual("{\"member\":null,\"count\":0}")
            expect(JSON.stringify(longestSequence((a, b) => a === b, ''))).toEqual("{\"member\":null,\"count\":0}")
        })
    })

    describe('Check replace string operation', () => {
        it('it should return valid replaced string', () => {
            expect(replacer(['argentina', 'brazil', 'chile']).join('-')).toEqual('Argentina-Brazil-Chile')
            expect(replacer(Array('a', 'b', 'c')).join('-')).toEqual('A-B-C')
            expect(replacer(['gender']).join('-')).toEqual('Gender')
            expect(replacer(['a16', 'b44', 'b bar']).join('-')).toEqual('A16-B44-B Bar')
        })
    })

    describe('Check match string operation', () => {
        it('it should return valid matched string', () => {
            expect(matcher(['argentina', 'brazil', 'chile'])).toEqual(null)
            expect(matcher(Array('a', 'b', 'c'))).toEqual(null)

            expect(matcher(['gender13']).join('-')).toEqual('r13')
            expect(matcher(['a16', 'b44', 'b bar']).join('-')).toEqual('a16-b44')
        })
    })

    describe('Check lower case string operation', () => {
        it('it should return valid lower case string', () => {
            expect(lowerCase('Argentina', 'Brazil', 'Chile').join('-')).toEqual('argentina-brazil-chile')
            expect(lowerCase('a', 'B', 'c').join('-')).toEqual('a-b-c')

            expect(lowerCase('Gender13').join('-')).toEqual('gender13')
            expect(lowerCase('a16', 'b44', 'b bar').join('-')).toEqual('a16-b44-b bar')
            expect(lowerCase('DIV', 'H1', 'SPAN').join('-')).toEqual('div-h1-span')
        })
    })

    describe('Check trim string operation', () => {
        it('it should return valid trimmed string', () => {
            expect(trimmer('Argentina ', ' Brazil', 'Chile').join('-')).toEqual('Argentina-Brazil-Chile')
            expect(trimmer('a', 'B ', 'c').join('-')).toEqual('a-B-c')

            expect(trimmer(' Gender13 ').join('-')).toEqual('Gender13')
            expect(trimmer(' a16', 'b44 ', 'b  bar').join('-')).toEqual('a16-b44-b  bar')
            expect(trimmer("  d ", "  h ", " s").join('-')).toEqual('d-h-s')
            expect(trimmer(" a", " b ").join('-')).toEqual('a-b')
        })
    })

    describe('Check double quotes', () => {
        it('it should return valid string with double quotes', () => {
            let cmd = quote(['echo', "hell'o1 ${HOME}"], true);
            cmd = ['bash', '-c', quote(cmd)].join(' ');
            expect(quote(cmd)).toEqual("\"bash -c \\\"echo \\\\\"hell'o1 \\\\${HOME}\\\\\"\\\"\"")
            expect(quote(['a', 'b', 'c d'])).toEqual("a b 'c d'")
            expect(quote(['a', 'b', 'it\'s a "neat thing"'])).toEqual('a b "it\'s a \\"neat thing\\""')
            expect(quote(['$', '`', "'"])).toEqual('\\$ \\` "\'"')
            expect(quote([])).toEqual('')
            expect(quote([''])).toEqual("''")
            expect(quote(['a\nb'])).toEqual("'a\nb'")
            expect(quote([' #(){}*|][!'])).toEqual("' #(){}*|][!'")
            expect(quote(["'#(){}*|][!"])).toEqual('"\'#(){}*|][\\!"')
            expect(quote(['X#(){}*|][!'])).toEqual('X\\#\\(\\)\\{\\}\\*\\|\\]\\[\\!')
            expect(quote(['a\n#\nb'])).toEqual("'a\n#\nb'")
            expect(quote(['><;{}'])).toEqual('\\>\\<\\;\\{\\}')
            expect(quote(['a', 1, true, false])).toEqual('a 1 true false')
            expect(quote(['a', 1, null, undefined])).toEqual('a 1 null undefined')
            expect(quote(['a\\x'])).toEqual('a\\\\x')
        })

        it('it should return valid string with single quotes', () => {
            expect(quote(['a', '|', 'b'])).toEqual('a \\| b')
            expect(quote(['a', '&&', 'b', ';', 'c'])).toEqual('a \\&\\& b \\; c')
        })
    })

    describe('Check string padding', () => {
        it('it should add zero padding to numbers', () => {
            expect(pad(7, 2)).toEqual('07')
        })
        it('it should add zero padding to numbers', () => {
            expect(pad(998, 4)).toEqual('0998')
        })
        it('it should not add 2 zero pad to numbers when no size is set', () => {
            expect(pad(7)).toEqual('07')
        })
    })

    describe('Check parsing input json', () => {
        const validString = `{"firstName":"Daphne","lastName":"Smit"}`
        const invalidString = `{"firstName":"Daphne",,"lastName":"Smit"}`

        it('it should parseJson a valid json without errors', () => {
            expect(parseJson(validString)).toEqual({
                firstName: 'Daphne',
                lastName: 'Smit',
            })
        })
        it('it should parseJson an invalid json without errors and return undefined', () => {
            expect(parseJson(invalidString)).toEqual(undefined)
        })
        it('it should parseJson an invalid json without errors and return default value when set', () => {
            expect(parseJson(invalidString, { failed: true })).toEqual({ failed: true })
        })
    })

    describe('Check capitalize first letter', () => {
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('daphne')).toEqual('Daphne')
        })
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('people are crazy!')).toEqual('People are crazy!')
        })
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('typescript: you are so powerful!')).toEqual(
                'Typescript: you are so powerful!',
            )
        })
    })
}
