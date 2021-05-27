import remarkHTML from 'remark-html'
import remark from 'remark'

const trailingSlashRegexp = /\/$/

const alertLandingArray = ['/enterprise']

const markdownProcessor = remark().use(remarkHTML).processSync
const markdownToHtml = (input: any): any => {
    return markdownProcessor(input).contents
}

const setPageContext = (page, actions): void => {
    const pagePath =
        page.path !== '/' && page.path.endsWith('/') ? page.path.replace(trailingSlashRegexp, '') : page.path

    const isAlertLanding = alertLandingArray.includes(pagePath)

    actions.deletePage(page)
    actions.createPage({
        ...page,
        path: pagePath,
        context: {
            ...page.context,
            is404: page.path.startsWith('/404'),
            isAlertLanding,
        },
    })
}

exports.setPageContext = setPageContext
exports.markdownToHtml = markdownToHtml
