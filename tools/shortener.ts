import axios, { AxiosPromise } from 'axios'

const googleApiKey = 'AIzaSyACIqikanS3eoHsy14JYyFAHU1aU5w1YoA'
const url = 'https://www.googleapis.com/urlshortener/v1/url'

export const shorten = async (longUrl: string): AxiosPromise => {
    return axios({
        method: 'POST',
        url: `${url}?key=${googleApiKey}`,
        data: {
            longUrl,
        },
    })
}
