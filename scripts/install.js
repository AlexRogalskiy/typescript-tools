const { execSync } = require('child_process');
const path = require('path');

console.log(`Updating test runner...`);
try {
    execSync('npm ci --save=false --fund=false --audit=false', {
        stdio: ['inherit', 'inherit', 'inherit'],
        cwd: path.join(__dirname, 'tests', 'playwright-test', 'stable-test-runner'),
    });
} catch (e) {
    process.exit(1);
}

console.log(`Downloading browsers...`);
const { installDefaultBrowsersForNpmInstall } = require('playwright-core/lib/utils/registry');
installDefaultBrowsersForNpmInstall().catch(e => {
    console.error(`Failed to install browsers, caused by\n${e.stack}`);
    process.exit(1);
});

console.log(`Done. Use "npm run watch" to compile.`);
