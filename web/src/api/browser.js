import { createStorage } from "unstorage";
import localstorageDriver from "unstorage/drivers/localstorage";

const ROOT = "root:";

const storage = createStorage({
    driver: localstorageDriver({
        base: ROOT,
    }),
});

storage.getKeys().then((keys) => {
    if (!keys.length) {
        storage.setItem(
            "hello-world",
            "<p><b>Hello World!</b></p><p>This is a sample document.</p><focus />",
        );
    }
});

const createNode = (path, name, dir = false) => ({ path, name, dir });

async function getRootTree() {
    const root = createNode("", "LOCAL", true);
    return { content: root };
}

async function readdir(path) {
    const keys = await storage.getKeys();
    const files = keys.map((file) => createNode(file, file, false));
    return {
        content: { files },
    };
}

async function readFile(path) {
    const content = await storage.getItem(path);
    return { content };
}

async function writeFile(path, content) {
    return await storage.setItem(path, content);
}

async function createFile(path, name) {
    if (!name) return;
    const file = `${path}:${name}${name.indexOf(".") > 0 ? "" : ".html"}`;
    const exists = await storage.hasItem(file);
    if (!exists) await writeFile(file, "");
    else throw "File already exists.";
}

async function removeFile(path) {
    return await storage.removeItem(path);
}

async function renameFile(path, name) {
    const content = await storage.getItem(path);
    await storage.setItem(name, content);
    return await storage.removeItem(path);
}

async function getHealth() {
    return await Promise.resolve({ content: "OK" })
}

export default {
    IS_SERVER: false,
    getRootTree,
    readdir,
    readFile,
    writeFile,
    createFile,
    removeFile,
    renameFile,
    getHealth,
};
