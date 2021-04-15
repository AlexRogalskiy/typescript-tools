import fs from 'fs'

const root = fs.realpathSync('./')

export class Config {
    /**
     * Obtener configuración
     *
     * @returns Object
     * @memberof Config
     */
    get(): any {
        const data = fs.readFileSync(`${root}/config.json`, 'utf8')
        return JSON.parse(data)
    }
}
