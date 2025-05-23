function objToFormData(obj) {
    const fd = new FormData();

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fd.append(key, obj[key]);
        }
    }

    return fd;
}

const API_URL = `${window.location.origin}/api/file`;

const apiRequest = (path, data) => {
    return new Promise((res, rej) => {
        fetch(API_URL + path, {
            method: "POST",
            body: objToFormData(data),
        })
            .then((r) => r.json())
            .then(res)
            .catch(rej);
    });
};

const getRootTree = () => apiRequest("/root");

const readdir = (path) => apiRequest("/list", { path });

const readFile = (path) => apiRequest("/load", { path });

const writeFile = (path, content) => apiRequest("/save", { path, content });

const createFile = (path, name) => apiRequest("/create", { path, name });

const removeFile = (path) => apiRequest("/remove", { path });

const renameFile = (path, name) => apiRequest("/rename", { path, name });

const getHealth = () => apiRequest("/health");

export default {
    IS_SERVER: true,
    getRootTree,
    readdir,
    readFile,
    writeFile,
    createFile,
    renameFile,
    removeFile,
    getHealth,
};
