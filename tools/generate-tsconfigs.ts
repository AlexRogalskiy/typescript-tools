import * as fs from 'fs';
import * as path from 'path';

const home = path.join(__dirname, "..", "types");

const fixTsconfig = (dir: string): void => {
    const target = path.join(dir, 'tsconfig.json');
    let json = JSON.parse(fs.readFileSync(target, 'utf-8'));
    json = fix(json);
    fs.writeFileSync(target, JSON.stringify(json, undefined, 4), "utf-8");
}

const fix = (config: any): any => {
    const out: any = {};
    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            let value = config[key];
            if (key === "compilerOptions") {
                value = fixCompilerOptions(value);
            }
            out[key] = value;
        }
    }
    return out;
}

const fixCompilerOptions = (config: any): any => {
    const out: any = {};
    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            out[key] = config[key];
        }
    }
    return out;
}

for (const dirName of fs.readdirSync(home)) {
    if (dirName.startsWith(".") || dirName === "node_modules" || dirName === "scripts") {
        continue;
    }

    const dir = path.join(home, dirName);
    const stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
        fixTsconfig(dir);
        // Also do it for old versions
        for (const subDir of fs.readdirSync(dir)) {
            if (/^v\d+$/.test(subDir)) {
                fixTsconfig(path.join(dir, subDir));
            }
        }
    }
}
