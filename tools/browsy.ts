export class Browsy {
    getMouse(e): number[] {
        let posx = 0
        let posy = 0

        if (e.pageX || e.pageY) {
            posx = e.pageX
            posy = e.pageY
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        }

        return [posx, posy]
    }

    getSize(item): any[] {
        const results = []

        results['height'] = item.offsetHeight
        results['width'] = item.offsetWidth
        results['top'] = parseInt(item.style.top.substring(0, item.style.top.length - 2))
        results['left'] = parseInt(item.style.left.substring(0, item.style.left.length - 2))

        if (results['top'] === 'NaN' || results['left'] === 'NaN') {
            const t = this.getLocation(item)
            results['top'] = t['top']
            results['left'] = t['left']
        }
        return results
    }

    getViewport(): any[] {
        const tArray = []
        tArray['height'] =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.getElementsByTagName('body')[0].clientHeight
        tArray['width'] =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.getElementsByTagName('body')[0].clientWidth

        return tArray
    }

    getPageSize(): any[] {
        const res = []
        if (document.documentElement.clientHeight && document.documentElement.clientWidth) {
            res['height'] = document.documentElement.clientHeight
            res['width'] = document.documentElement.clientWidth
        } else if (document.body.scrollHeight > document.body.offsetHeight) {
            res['height'] = document.body.scrollHeight
            res['width'] = document.body.scrollWidth
        } else {
            res['height'] = document.body.offsetHeight
            res['width'] = document.body.offsetWidth
        }

        return res
    }

    getLocation(el): any[] {
        const results = []
        results['left'] = 0
        results['top'] = 0

        while (el != null) {
            results['left'] += el.offsetLeft
            results['top'] += el.offsetTop
            el = el.offsetParent
        }

        return results
    }

    getBaseName(name): string {
        return name.substr(name.lastIndexOf('/') + 1)
    }

    isInt(i): boolean {
        return i % 1 === 0
    }

    urlEncode(str: string): string {
        return escape(str)
            .replace(/\+/g, '%2B')
            .replace(/%20/g, '+')
            .replace(/\*/g, '%2A')
            .replace(/\//g, '%2F')
            .replace(/@/g, '%40')
    }

    urlDecode(str: string): string {
        return unescape(str)
            .replace(/\+/g, ' ')
            .replace(/%2B/g, '+')
            .replace(/%2A/g, '*')
            .replace(/%2F/g, '/')
            .replace(/%40/g, '@')
    }

    trim(str: string): string {
        str = str.replace(/^\s+/, '')
        for (let i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1)
                break
            }
        }

        return str
    }
}
