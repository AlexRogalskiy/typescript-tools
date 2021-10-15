interface DevToolsStorage {
    get(key: string): string;
    set(key: string, value: string): void;
    remove(key: string): void;
    has(key: string): boolean;
}

class LocalStorageWrapper implements DevToolsStorage {
    get(key: string) {
        try {
            return localStorage.getItem(key);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    set(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (err) {
            console.error(err);
        }
    }
    remove(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error(err);
        }
    }
    has(key: string) {
        try {
            return localStorage.getItem(key) != null;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

class TempStorage implements DevToolsStorage {
    map = new Map<string, string>();

    get(key: string) {
        return this.map.get(key);
    }
    set(key: string, value: string) {
        this.map.set(key, value);
    }
    remove(key: string) {
        this.map.delete(key);
    }
    has(key: string) {
        return this.map.has(key);
    }
}
