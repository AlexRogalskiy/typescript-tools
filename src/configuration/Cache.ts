export function getItemFromStorage(item: string): any {
    const itemFromStorage = localStorage.getItem(item) || null

    if (itemFromStorage) {
        return JSON.parse(itemFromStorage)
    }
}

export function setItemToStorage(cacheKey: string, value: any): any {
    return localStorage.setItem(cacheKey, value)
}
