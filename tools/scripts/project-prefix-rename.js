const { rename, readdir } = require('node:fs/promises');
const { join, parse } = require('path');
const replace = require('replace-in-file');
const dirConfig = require('../../eleventy.dirs.config').dir;

const args = process.argv.slice(2);

const oldPrefix = args.length <= 1 ? 'tailscript' : args[0];
const newPrefix = args.length === 1 ? args[0] : args[1];

const dirPaths = [
    './src/_includes/components'
];

const dirsPrefixRx = new RegExp(`(${oldPrefix})-(.+)`);
const filesPrefixRx = new RegExp(`(${oldPrefix})-(.+)\.(.+)`);
const dirHasPrefixFilter = name => name.match(dirsPrefixRx);
const fileHasPrefixFilter = name => name.match(filesPrefixRx)

const getPrefixedDirectories = async source => await getElement(source, (dirent) => dirent.isDirectory() && dirHasPrefixFilter(dirent.name));
const getPrefixedFiles = async source => await getElement(source, (dirent) => dirent.isFile() && fileHasPrefixFilter(dirent.name));

const getElement = async (source, filter) => (await readdir(source, {withFileTypes: true}))
    .filter(filter)
    .map(dirent => dirent.name);

function flatten(lists) {
    if (!lists || !lists.length) return [];

    return lists.reduce((a, b) => a.concat(b));
}

(async () => {
    // Get target directories and files
    const directories = flatten(await Promise.all(dirPaths.map(async dir => (await getPrefixedDirectories(dir)).map(sub => join(dir, sub)))));
    const files = flatten(await Promise.all(directories.map(async dir => (await getPrefixedFiles(dir)).map(file => join(dir, file)))));

    // Rename targets with new prefix
    const renamed = await Promise.all([...files, ...directories].map(async path => {
        const dirent = parse(path);
        const keepedName = dirent.name.match(dirsPrefixRx)[2];
        const newPath = `${dirent.dir}/${newPrefix}-${keepedName}${dirent.ext}`;

        try {
            await rename(path, newPath);
        } catch (error) {
            throw new Error(error);
        }
        
        return newPath;
    }));

    const results = await replace({
        files: [
            `${dirConfig.input}/**/*.webc`,
            `${dirConfig.input}/**/*.ts`
        ],
        from: new RegExp(`${oldPrefix}`, 'g'),
        to: newPrefix
    });

    console.log('WebC template tags renamed', results);
    console.log(renamed.length + ' renamed elements', renamed);

    console.log('Directory / Files / WebC Tags: project prefixes renamed successfully !');
})().catch(err => {
    console.error(err);
});

    

