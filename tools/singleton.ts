export default (() => {
    let privateVariable = 10

    const privateFunction = (): boolean => true

    const obj = {}

    obj['publicProperty'] = privateVariable
    obj['publicMethod'] = () => {
        privateVariable++
        return privateFunction()
    }

    return obj
})()
