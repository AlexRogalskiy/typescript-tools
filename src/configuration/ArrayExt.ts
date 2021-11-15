export class ArrayExt<T> extends Array<T> {
    public static range(from: number, to: number, step: number): number[] {
        return Array.from(Array(~~((to - from) / step) + 1)).map(
            (v, k) => from + k * step
        );
    }
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]; // Inferred type is T[K]
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

const reorder = (arr, indices) => {
    if (arr.length !== indices.length) {
        return arr;
    }

    const tempList = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        tempList[indices[i]] = arr[i];
    }

    for (let i = 0; i < tempList.length; i++) {
        arr[i] = tempList[i];
    }
};
