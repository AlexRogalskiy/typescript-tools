import * as moment from "moment";
import "moment/locale/zh-cn";

export function timeAgo(time: number): string {
    var currentTime = new Date().getTime();
    var between = currentTime - time;
    var days = Math.floor(between / (24 * 3600 * 1000));
    if (days === 0) {
        var leave1 = between % (24 * 3600 * 1000);
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours === 0) {
            var leave2 = leave1 % (3600 * 1000);
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes === 0) {
                var leave3 = leave2 % (60 * 1000);
                var seconds = Math.round(leave3 / 1000);
                return seconds + " 秒前";
            }
            return minutes + " 分钟前";
        }
        return hours + " 小时前";
    }
    if (days < 0) {
        return "刚刚";
    }
    if (days < 5) {
        return days + " 天前";
    } else {
        return moment(time).format("YYYY-MM-DD HH:mm");
    }
}

export function isObject(value: any): boolean {
    return value && typeof value === "object" && value.constructor === Object;
}
