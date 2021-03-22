export const downloadString = (content: string, fileName: string, type = 'text/plain'): void => {
    const anchor = document.createElement('a')
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.href = window.URL.createObjectURL(new Blob([content], { type }))
    anchor.setAttribute('download', fileName)
    anchor.click()
    window.URL.revokeObjectURL(anchor.href)
    document.body.removeChild(anchor)
}

export const downloadBlob = (blob: Blob, fileName: string): void => {
    const anchor = document.createElement('a')
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.href = window.URL.createObjectURL(blob)
    anchor.setAttribute('download', fileName)
    anchor.click()
    window.URL.revokeObjectURL(anchor.href)
    document.body.removeChild(anchor)
}

export const getAppLinkFromUserAgent = (): { os: string; link: string } => {
    const userAgent = navigator.userAgent
    const download = {
        os: '',
        link: '',
    }

    if (userAgent.includes('Windows')) {
        download.os = 'Windows'
        download.link =
            'https://github.com/BoostIO/BoostNote.next/releases/latest/download/boost-note-win.exe'
    }
    if (userAgent.includes('Mac')) {
        download.os = 'Mac'
        download.link =
            'https://github.com/BoostIO/BoostNote.next/releases/latest/download/boost-note-mac.dmg'
    }
    if (userAgent.includes('Linux')) {
        download.os = 'Linux'
        download.link =
            'https://github.com/BoostIO/BoostNote.next/releases/latest/download/boost-note-linux.deb'
    }

    return download
}
