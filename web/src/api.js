function objToFormData(obj) {
    const fd = new FormData()

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fd.append(key, obj[key])            
        }
    }

    return fd
}

const API_URL = "http://" + window.location.hostname + ":4321/api/file"

const apiRequest = (path, data) => {
    return new Promise((res, rej) => {
        fetch(API_URL + path, {
            method: "POST",
            body: objToFormData(data)
        }).then(r => r.json()).then(res).catch(rej)
    })
}

const getTree = path => apiRequest("/tree", { path })

const readFile = path => apiRequest("/load", { path })

const writeFile = (path, content) => apiRequest("/save", { path, content })

const renameFile = (oldpath, newpath) => apiRequest("/rename", { oldpath, newpath })

const createFile = path => apiRequest("/create", { path })

export default { getTree, readFile, writeFile, renameFile, createFile }