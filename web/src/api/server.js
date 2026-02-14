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
        fetch(path, {
            method: "POST",
            body: objToFormData(data),
        })
            .then((r) => r.json())
            .then(res)
            .catch(rej);
    });
};

const getRootTree = () => apiRequest(`${API_URL}/root`);

const readdir = (path) => apiRequest(`${API_URL}/list`, { path });

const readFile = (path) => apiRequest(`${API_URL}/load`, { path });

const writeFile = (path, content) =>
    apiRequest(`${API_URL}/save`, { path, content });

const createFile = (path, name) =>
    apiRequest(`${API_URL}/create`, { path, name });

const removeFile = (path) => apiRequest(`${API_URL}/remove`, { path });

const renameFile = (path, name) =>
    apiRequest(`${API_URL}/rename`, { path, name });

const getHealth = () => apiRequest(`/health`);

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
