import { describe, expect, test } from '@jest/globals'

import { Requests } from '../src'

export namespace Requests_Test {
    import toBase64ImageUrl = Requests.toBase64ImageUrl

    require('https').globalAgent.options.rejectUnauthorized = false

    describe("Convert image URL to base64 string", () => {
        test('it should be a string base64',
            async () => {
                const imageUrl = "https://avatars1.githubusercontent.com/u/33148052?v=4"
                expect(await toBase64ImageUrl(imageUrl)).toMatch(new RegExp(/[A-Za-z0-9+/=]/))
            },
            10000
        )
    })
}
