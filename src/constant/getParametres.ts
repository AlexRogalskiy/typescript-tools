interface IParametres {
    radius: number,
    width: number,
    height: number,
    fontSize: number,
    strokeWidth: number,
    arrowRadius: number,
    arrowStroke: number,
    capText: boolean,
    x: number,
    y: number,
    offsetY: number,
}

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
);
const getParametres = (): IParametres => {

    if (isMobile) {
        return {
            radius: 150,
            width: 320,
            height: 312,
            fontSize: 11,
            strokeWidth: 1,
            arrowRadius: 18,
            arrowStroke: 1,
            capText: false,
            x: 300,
            y: 156,
            offsetY: 5,
        };
    } else {
        return {
            radius: 250,
            width: 820,
            height: 520,
            fontSize: 17,
            strokeWidth: 1,
            arrowRadius: 30,
            arrowStroke: 1,
            capText: true,
            x: 655,
            y: 260,
            offsetY: 10,
        };
    }
};

export default getParametres;
