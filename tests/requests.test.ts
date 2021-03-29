import { describe, expect, test } from '@jest/globals'

import { Requests } from '../src'

export namespace Requests_Test {
    import toBase64ImageUrl = Requests.toBase64ImageUrl;
    import getUrlName = Requests.getUrlName;

    require('https').globalAgent.options.rejectUnauthorized = false

    beforeAll(() => {
        console.log('Requests test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Requests test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Convert image URL to base64 string', () => {
        test('it should be a valid string in base64 format', async () => {
            const imageUrl = 'https://avatars1.githubusercontent.com/u/33148052?v=4'

            expect(await toBase64ImageUrl(imageUrl)).toMatch(new RegExp(/[A-Za-z0-9+/=]/))
        }, 30000)
    })

    describe('Get url name', () => {
        test('it should be a valid url name', async () => {
            expect(getUrlName('https://avatars1.githubusercontent.com/u/33148052?v=4')).toEqual('33148052')
            expect(getUrlName('https://ru.wikipedia.org/wiki/Эмотикон#/media/Файл:SNice.svg')).toEqual('Файл:SNice.svg')
        })
    })
}
