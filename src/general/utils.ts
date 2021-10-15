import {MessageType} from '../utils/message';
import {isFirefox} from '../utils/platform';
import type {Message} from '../definitions';

export function classes(...args: Array<string | {[cls: string]: boolean}>) {
    const classes: string[] = [];
    args.filter((c) => Boolean(c)).forEach((c) => {
        if (typeof c === 'string') {
            classes.push(c);
        } else if (typeof c === 'object') {
            classes.push(...Object.keys(c).filter((key) => Boolean(c[key])));
        }
    });
    return classes.join(' ');
}

export function compose<T extends Malevic.Component>(type: T, ...wrappers: Array<(t: T) => T>) {
    return wrappers.reduce((t, w) => w(t), type);
}

export function openFile(options: {extensions: string[]}, callback: (content: string) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    if (options.extensions && options.extensions.length > 0) {
        input.accept = options.extensions.map((ext) => `.${ext}`).join(',');
    }
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    input.onchange = () => {
        if (input.files[0]) {
            reader.readAsText(input.files[0]);
            document.body.removeChild(input);
        }
    };
    document.body.appendChild(input);
    input.click();
}

export function saveFile(name: string, content: string) {
    if (isFirefox) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content]));
        a.download = name;
        a.click();
    } else {
        chrome.runtime.sendMessage<Message>({type: MessageType.UI_SAVE_FILE, data: {name, content}});
    }
}

type AnyVoidFunction = (...args: any[]) => void;

export function throttle<F extends AnyVoidFunction>(callback: F): F {
    let frameId: number = null;
    return ((...args: any[]) => {
        if (!frameId) {
            callback(...args);
            frameId = requestAnimationFrame(() => (frameId = null));
        }
    }) as F;
}

interface SwipeEventObject {
    clientX: number;
    clientY: number;
}

type SwipeEventHandler<T = void> = (e: SwipeEventObject, nativeEvent: MouseEvent | TouchEvent) => T;
type StartSwipeHandler = SwipeEventHandler<{move: SwipeEventHandler; up: SwipeEventHandler}>;

function onSwipeStart(
    startEventObj: MouseEvent | TouchEvent,
    startHandler: StartSwipeHandler,
) {
    const isTouchEvent =
        typeof TouchEvent !== 'undefined' &&
        startEventObj instanceof TouchEvent;
    const touchId = isTouchEvent
        ? (startEventObj as TouchEvent).changedTouches[0].identifier
        : null;
    const pointerMoveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const pointerUpEvent = isTouchEvent ? 'touchend' : 'mouseup';

    if (!isTouchEvent) {
        startEventObj.preventDefault();
    }

    function getSwipeEventObject(e: MouseEvent | TouchEvent) {
        const {clientX, clientY} = isTouchEvent
            ? getTouch(e as TouchEvent)
            : e as MouseEvent;
        return {clientX, clientY};
    }

    const startSE = getSwipeEventObject(startEventObj);
    const {move: moveHandler, up: upHandler} = startHandler(startSE, startEventObj);

    function getTouch(e: TouchEvent) {
        return Array.from(e.changedTouches).find(
            ({identifier: id}) => id === touchId,
        );
    }

    const onPointerMove = throttle((e) => {
        const se = getSwipeEventObject(e);
        moveHandler(se, e);
    });

    function onPointerUp(e: MouseEvent) {
        unsubscribe();
        const se = getSwipeEventObject(e);
        upHandler(se, e);
    }

    function unsubscribe() {
        window.removeEventListener(pointerMoveEvent, onPointerMove);
        window.removeEventListener(pointerUpEvent, onPointerUp);
    }

    window.addEventListener(pointerMoveEvent, onPointerMove, {passive: true});
    window.addEventListener(pointerUpEvent, onPointerUp, {passive: true});
}

export function createSwipeHandler(startHandler: StartSwipeHandler) {
    return (e: MouseEvent | TouchEvent) => onSwipeStart(e, startHandler);
}

export async function getFontList() {
    return new Promise<string[]>((resolve) => {
        if (!chrome.fontSettings) {
            // Todo: Remove it as soon as Firefox and Edge get support.
            resolve([
                'serif',
                'sans-serif',
                'monospace',
                'cursive',
                'fantasy',
                'system-ui'
            ]);
            return;
        }
        chrome.fontSettings.getFontList((list) => {
            const fonts = list.map((f) => f.fontId);
            resolve(fonts);
        });
    });
}

function toArray<T>(x: T | T[]) {
    return Array.isArray(x) ? x : [x];
}

export function mergeClass(
    cls: string | {[cls: string]: any} | Array<string | {[cls: string]: any}>,
    propsCls: string | {[cls: string]: any} | Array<string | {[cls: string]: any}>
) {
    const normalized = toArray(cls).concat(toArray(propsCls));
    return classes(...normalized);
}

export function omitAttrs(omit: string[], attrs: Malevic.NodeAttrs) {
    const result: Malevic.NodeAttrs = {};
    Object.keys(attrs).forEach((key) => {
        if (omit.indexOf(key) < 0) {
            result[key] = attrs[key];
        }
    });
    return result;
}

export function isElementHidden(element: HTMLElement) {
    return element.offsetParent === null;
}

export function createTextStyle(config: FilterConfig): string {
    const lines: string[] = [];
    // Don't target pre elements as they are preformatted element's e.g. code blocks
    // Exclude font libraries to preserve icons
    lines.push('*:not(pre, pre *, code, .far, .fa, .glyphicon, [class*="vjs-"], .fab, .fa-github, .fas, .material-icons, .icofont, .typcn, mu, [class*="mu-"], .glyphicon, .icon) {');

    if (config.useFont && config.fontFamily) {
        // TODO: Validate...
        lines.push(`  font-family: ${config.fontFamily} !important;`);
    }

    if (config.textStroke > 0) {
        lines.push(`  -webkit-text-stroke: ${config.textStroke}px !important;`);
        lines.push(`  text-stroke: ${config.textStroke}px !important;`);
    }

    lines.push('}');

    return lines.join('\n');
}

/**
 * clone from https://github.com/matchai/waka-box
 */
export default function generateBarChart(percent: number, size: number) {
    const syms = '░▏▎▍▌▋▊▉█';

    const frac = Math.floor((size * 8 * percent) / 100);
    const barsFull = Math.floor(frac / 8);
    if (barsFull >= size) {
        return syms.substring(8, 9).repeat(size);
    }
    const semi = frac % 8;

    return [syms.substring(8, 9).repeat(barsFull), syms.substring(semi, semi + 1)]
        .join('')
        .padEnd(size, syms.substring(0, 1));
}

const MAX_LENGTH = 30

const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1)
const truncate = str =>
    str.length <= MAX_LENGTH ? str : str.slice(0, MAX_LENGTH - 3) + '...'


export function intToString(value: number) {
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = parseFloat(
        (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
    );
    if (shortValue % 1 != 0) {
        shortValue = parseFloat(shortValue.toFixed(1));
    }
    return shortValue + suffixes[suffixNum];
}

export function getBLen(str: string) {
    return str.replace(/[^\x00-\xff]/g, "01").length;
}

export function cutString(str: string, len: number) {
    if (getBLen(str) <= len) {
        return str + new Array(len - getBLen(str)).fill(" ").join("");
    }

    var strlen = 0;

    var s = "";

    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);

        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;

            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;

            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}
