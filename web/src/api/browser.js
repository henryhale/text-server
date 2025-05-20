import { createStorage } from "unstorage";
import localstorageDriver from "unstorage/drivers/localstorage";

const ROOT = "root:";

const storage = createStorage({
    driver: localstorageDriver({
        base: ROOT,
    }),
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
    const file = path + ":" + name;
    const exists = await storage.hasItem(file);
    if (!exists) await writeFile(file, "");
    else throw "File already exists.";
}

export default { getRootTree, readdir, readFile, writeFile, createFile };
