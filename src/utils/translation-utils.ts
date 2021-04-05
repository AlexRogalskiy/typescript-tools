export namespace TranslationUtils {
    export const translateBy = <T extends string>(value: T): string => {
        const code =
            'A=\'\',B=!A+A,C=!B+A,D=A+{},E=B[A++],F=B[G=A],H=++G+A,I=D[G+H],B[I+=D[A]+(B.C+D)[A]+C[H]+E+F+B[G]+I+E+D[A]+F][I](C[A]+C[G]+B[H]+F+E+"(A)")()'

        if (!value || !value.length) {
            return 'Please enter at least one character.'
        }

        const separator = !value.includes(',') ? '' : ','
        const alphabet = value.split(separator)

        const filteredAlphabet = alphabet.filter((char, index) => {
            return index <= alphabet.indexOf(char)
        })

        while (filteredAlphabet.length < 9) {
            // eslint-disable-next-line github/array-foreach
            filteredAlphabet.forEach(a => {
                // eslint-disable-next-line github/array-foreach
                filteredAlphabet.forEach(b => {
                    if (!filteredAlphabet.includes(a + b)) {
                        filteredAlphabet.push(a + b)
                    }
                })
            })
        }

        return code.replace(/[A-Z]/g, function (char) {
            return filteredAlphabet[char.charCodeAt(0) - 65]
        })
    }
}
