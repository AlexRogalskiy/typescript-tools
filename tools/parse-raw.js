module.exports = function buildParsers(strictParser) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const patch = (subject, patches) => {
        // eslint-disable-next-line github/array-foreach
        Object.entries(patches).forEach(([key, patch]) => (subject[key] = patch(subject[key])))
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const forwardLoc = (lexer, offset, str) => {
        const lines = str.split(/\r\n?|\n|\u2028|\u2029/g)
        lexer.yylineno += lines.length - 1
        lexer.yylloc.first_line = lexer.yylineno + 1
        lexer.yylloc.first_column =
            lexer.length > 1
                ? lines[lines.length - 1].length + 1
                : lexer.yylloc.first_column + lines[0].length
        lexer.yylloc.range[0] += offset
        lexer.offset += offset
        lexer.match = lexer.match.slice(offset)
    }

    // better error details
    const humanTokens = new Map([
        ['EOF', ['<end of input>']],
        ['IDENT', ['ident']],
        ['$IDENT', ['$ident']],
        ['FUNCTION_START', ["'<'"]],
        ['FUNCTION_END', ["'>'"]],
        ['FUNCTION', ["'=>'"]],
        ['NOT', ["'not'"]],
        ['IN', ["'in'"]],
        ['HAS', ["'has'"]],
        ['NOTIN', ["'not in'"]],
        ['HASNO', ["'has no'"]],
        ['AND', ["'and'"]],
        ['OR', ["'or'"]],
        ['STRING', ['string']],
        ['TPL_START', ['template']],
        ['TEMPLATE', ['template']],
        ['NUMBER', ['number']],
        ['REGEXP', ['regexp']],
        ['LITERAL', ["'true'", "'false'", "'null'", "'undefined'"]],
        ['ORDER', ["'asc'", "'desc'", "'ascN'", "'descN'"]],
    ])
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const tokenForHumans = token => humanTokens.get(token) || `'${token}'`
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const parseError = (rawMessage, details = {}, yy) => {
        if (details.recoverable) {
            this.trace(rawMessage)
        } else {
            if (typeof details.inside === 'number') {
                forwardLoc(yy.lexer, details.inside, yy.lexer.match.slice(0, details.inside))
            }

            const yylloc = yy.lexer.yylloc
            const message = [rawMessage.split(/\n/)[0], '', yy.lexer.showPosition()]
            let expected
            if (!Array.isArray(details.expected)) {
                expected = null
            } else {
                expected = [
                    ...new Set(
                        [].concat(...details.expected.map(token => tokenForHumans(token.slice(1, -1)))),
                    ),
                ]
            }

            if (expected) {
                message.push('', `Expecting ${expected.join(', ')} got ${tokenForHumans(details.token)}`)
            }

            const error = new SyntaxError(message.join('\n'))

            error.details = {
                rawMessage,
                text: details.text,
                token: details.token,
                expected,
                loc: {
                    range: yylloc.range,
                    start: {
                        line: yylloc.first_line,
                        column: yylloc.first_column,
                        offset: yylloc.range[0],
                    },
                    end: {
                        line: yylloc.last_line,
                        column: yylloc.last_column,
                        offset: yylloc.range[1],
                    },
                },
            }

            throw error
        }
    }

    // add new helpers to lexer
    const lineTerminator = new Set(['\n', '\r', '\u2028', '\u2029'])
    Object.assign(strictParser.lexer, {
        ident: value =>
            value.replace(/\\u[0-9a-fA-F]{4}/g, m => String.fromCharCode(parseInt(m.slice(2), 16))),

        toLiteral: value => {
            if (value === 'false') {
                return value === 'null' ? null : false
            } else {
                if (value === 'true') {
                    return value === 'null' ? null : true
                } else {
                    if (value === 'Infinity') {
                        return value === 'null' ? null : Infinity
                    } else {
                        return value === 'null' ? null : value === 'NaN' ? NaN : undefined
                    }
                }
            }
        },

        toStringLiteral(value, multiline = false, end = 1) {
            let result = ''
            for (let i = 1; i < value.length - end; i++) {
                if (!multiline && lineTerminator.has(value[i])) {
                    this.parseError('Invalid line terminator', { inside: i })
                }

                if (value[i] !== '\\') {
                    result += value[i]
                    continue
                }

                const next = value[++i]
                Label: if (next === '\r') {
                    // ignore line terminator
                    i += value[i + 1] === '\n' // \r\n
                } else if (next === '\n' || next === '\u2028' || next === '\u2029') {
                    // ignore line terminator
                } else if (next === 'b') {
                    result += '\b'
                } else if (next === 'n') {
                    result += '\n'
                } else if (next === 'r') {
                    result += '\r'
                } else if (next === 'f') {
                    result += '\f'
                } else if (next === 't') {
                    result += '\t'
                } else if (next === 'v') {
                    result += '\v'
                } else if (next === 'u') {
                    {
                        const hex4 = value.slice(i + 1, i + 5)

                        if (/^[0-9a-f]{4}$/i.test(hex4)) {
                            {
                                result += String.fromCharCode(parseInt(hex4, 16))
                                i += 4
                                break Label
                            }
                        }

                        this.parseError('Invalid Unicode escape sequence', { inside: i - 1 })
                    }
                } else if (next === 'x') {
                    {
                        const hex2 = value.slice(i + 1, i + 3)

                        if (/^[0-9a-f]{2}$/i.test(hex2)) {
                            {
                                result += String.fromCharCode(parseInt(hex2, 16))
                                i += 2
                                break Label
                            }
                        }

                        this.parseError('Invalid hexadecimal escape sequence', { inside: i - 1 })
                    }
                } else {
                    result += next
                }
            }

            return result
        },

        toRegExp: value =>
            new RegExp(value.substr(1, value.lastIndexOf('/') - 1), value.substr(value.lastIndexOf('/') + 1)),
    })

    // patch setInput method to add additional lexer fields on init
    patch(strictParser.lexer, {
        setInput: origSetInput =>
            function (input, yy) {
                const commentRanges = []

                yy.commentRanges = commentRanges
                yy.buildResult = ast => ({
                    ast,
                    commentRanges,
                })
                yy.parseError = function (...args) {
                    // parser doesn't expose sharedState and it's unavailable in parseError
                    return parseError.call(this, ...args, yy)
                }
                yy.pps = () => {
                    if (this._input) {
                        this.begin('preventPrimitive')
                    }
                }

                this.fnOpened = 0
                this.fnOpenedStack = []
                this.bracketStack = []
                this.prevToken = null
                this.prevYylloc = {
                    first_line: 1,
                    last_line: 1,
                    first_column: 0,
                    last_column: 0,
                    range: [0, 0],
                }

                return origSetInput.call(this, input, yy)
            },
    })

    //
    // tolerant parser
    //
    const tolerantParser = new strictParser.Parser()
    tolerantParser.lexer = { ...strictParser.lexer }
    tolerantParser.yy = { ...strictParser.yy }

    // patch tolerant parser lexer
    const keywords = ['AND', 'OR', 'IN', 'NOTIN', 'HAS', 'HASNO']
    const words = [...keywords, 'NOT', 'ORDER']
    const operators = ['+', '-', '*', '/', '%', '|', '=', '!=', '~=', '>=', '<=', '<', '>']
    const prev = [null, ':', ';', ',', '.', '..', 'FUNCTION', ...operators, ...keywords, 'NOT']
    const defaultNext = new Set([
        ',',
        '?',
        ':',
        ';',
        'EOF',
        ']',
        ')',
        '}',
        ...operators,
        ...keywords,
        'ORDER',
    ])
    const tokenPair = new Map(prev.map(token => [token, defaultNext]))
    // special cases
    tokenPair.set('{', new Set([',']))
    tokenPair.set('[', new Set([',']))
    tokenPair.set('(', new Set([',']))

    patch(tolerantParser.lexer, {
        lex: origLex =>
            function patchedLex() {
                const prevInput = this._input
                const nextToken = origLex.call(this)

                if (tokenPair.has(this.prevToken) && tokenPair.get(this.prevToken).has(nextToken)) {
                    const yylloc = {
                        first_line: this.prevYylloc.last_line,
                        last_line: this.yylloc.first_line,
                        first_column: this.prevYylloc.last_column,
                        last_column: this.yylloc.first_column,
                        range: [this.prevYylloc.range[1], this.yylloc.range[0]],
                    }
                    this.unput(this.yytext)
                    this.pushState('preventPrimitive')
                    this.done = false
                    this.yytext = '_'
                    this.yylloc = this.prevYylloc = yylloc

                    // position correction for a white space before a keyword
                    if (prevInput !== this._input && words.includes(nextToken)) {
                        const prevChIndex = prevInput.length - this._input.length - 1

                        if (prevInput[prevChIndex] === ' ' || prevInput[prevChIndex] === '\t') {
                            yylloc.last_column--
                            yylloc.range[1]--
                        } else if (prevInput[prevChIndex] === '\n') {
                            {
                                const lastN = prevInput.lastIndexOf('\n', prevChIndex - 1)

                                yylloc.last_line--
                                yylloc.last_column =
                                    lastN === -1 ? yylloc.last_column - 1 : prevChIndex - lastN
                                yylloc.range[1]--
                            }
                        }
                    }

                    return (this.prevToken = 'IDENT')
                }

                this.prevYylloc = this.yylloc

                // position correction for a white space after a keyword
                if (words.includes(nextToken)) {
                    if (this._input[0] === ' ' || this._input[0] === '\t') {
                        this.prevYylloc = {
                            ...this.prevYylloc,
                            last_column: this.prevYylloc.last_column + 1,
                            range: [this.prevYylloc.range[0], this.prevYylloc.range[1] + 1],
                        }
                    } else if (this._input[0] === '\n') {
                        this.prevYylloc = {
                            ...this.prevYylloc,
                            last_line: this.prevYylloc.last_line + 1,
                            last_column: 0,
                            range: [this.prevYylloc.range[0], this.prevYylloc.range[1] + 1],
                        }
                    }
                }

                return (this.prevToken = nextToken)
            },
    })

    // bracket balance & scope
    const openBalance = new Map([
        ['(', ')'],
        ['.(', ')'],
        ['..(', ')'],
        ['[', ']'],
        ['.[', ']'],
        ['{', '}'],
        ['TPL_START', 'TPL_END'],
    ])
    const closeBalance = new Set([')', ']', '}', 'TPL_END'])
    const balanceScopeLex = origLex =>
        function patchedLex() {
            const token = origLex.call(this)

            if (closeBalance.has(token)) {
                const expected = this.bracketStack.pop()

                if (expected !== token) {
                    this.parseError(`Expected "${expected}" got "${token}"`)
                }

                this.fnOpened = this.fnOpenedStack.pop() || 0
            }

            if (openBalance.has(token)) {
                this.bracketStack.push(openBalance.get(token))
                this.fnOpenedStack.push(this.fnOpened)
                this.fnOpened = 0
            }

            return token
        }
    patch(strictParser.lexer, {
        lex: balanceScopeLex,
    })
    patch(tolerantParser.lexer, {
        lex: balanceScopeLex,
    })

    return {
        parse(source, tolerantMode) {
            return tolerantMode ? tolerantParser.parse(source) : strictParser.parse(source)
        },
        *tokenize(source, tolerantMode, loc) {
            const lexer = Object.create(tolerantMode ? tolerantParser.lexer : strictParser.lexer)

            lexer.setInput(source, {
                parser: strictParser,
            })

            while (!lexer.done) {
                const token = {
                    type: lexer.lex(),
                    value: lexer.match,
                    offset: lexer.yylloc.range[0],
                }

                if (loc) {
                    token.loc = {
                        range: lexer.yylloc.range,
                        start: {
                            line: lexer.yylloc.first_line,
                            column: lexer.yylloc.first_column,
                        },
                        end: {
                            line: lexer.yylloc.last_line,
                            column: lexer.yylloc.last_column,
                        },
                    }
                }

                yield token
            }
        },
    }
}
