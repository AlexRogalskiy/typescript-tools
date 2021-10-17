import * as cp from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import * as util from "util";

export async function cleanNpmTags(cwd: string, name: string, regexp: string): Promise<void> {
    if (!name) {
        const packageJson = await fs.readJson(path.join(cwd, "package.json"));
        name = packageJson.name;
    }

    const exec = util.promisify(cp.exec);
    const tags = (await exec(`npm dist-tags ls ${name}`, { cwd })).stdout.split("\n").map(l => l.split(":")[0]);
    const ignore = ["branch-main", "latest", "next"];

    for (const tag of tags) {
        if (!ignore.includes(tag) && new RegExp(regexp).test(tag)) {
            console.log(`Deleting tag ${tag}`);
            await exec(`npm dist-tags rm ${name} ${tag}`, { cwd });
        }
    }
}
