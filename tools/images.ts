export const getImages = (node: Element): HTMLImageElement[] =>
    Array.from(node.querySelectorAll('img')).filter(imgNode => !!imgNode.src)

export const imageLoaded = async (imgNode: HTMLImageElement): Promise<void> => {
    if (imgNode.complete && imgNode.naturalWidth !== 0) {
        return Promise.resolve()
    }

    return new Promise(resolve => {
        imgNode.addEventListener('load', function onLoad() {
            resolve()
            imgNode.removeEventListener('load', onLoad)
        })
        imgNode.addEventListener('error', function onError() {
            resolve()
            imgNode.removeEventListener('error', onError)
        })
    })
}

export const allImagesLoaded = async (nodes: HTMLImageElement[]): Promise<void[]> =>
    Promise.all(nodes.map(imageLoaded))

export const allImagesLoadedInContainer = async (node: Element): Promise<void[]> =>
    allImagesLoaded(getImages(node))
