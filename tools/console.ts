export default ((global, property) => {
    const properties = ['memory']
    const dummy = () => {
    }
    const methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn')
        .split(',')

    let prop, method
    const con = global[property]

    while (prop = properties.pop()) {
        if (!con[prop]) {
            con[prop] = {}
        }
    }
    while (method = methods.pop()) {
        if (!con[method]) {
            con[method] = dummy
        }
    }
})(window, 'console')
