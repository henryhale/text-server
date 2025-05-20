import { defineStore } from "pinia";
import { reactive, shallowRef } from "vue";
import api from "../api";

export const useState = defineStore("state", () => {
    const app = reactive({
        layout: "split",
        files: shallowRef([]),
        loadingFiles: false,
    });

    const file = reactive({
        name: "",
        path: "",
        content: "",
    });

    function setLayout(value) {
        app.layout = value;
    }

    function refreshExplorer() {
        console.log("refreshing explorer");
        const tmp = app.files.splice(0);
        app.loadingFiles = true;
        api.getRootTree()
            .then((res) => {
                app.files.push(res.content);
            })
            .catch((e) => {
                console.error(e);
                app.files.push(...tmp);
            })
            .finally(() => {
                app.loadingFiles = false;
            });
    }

    function setCurrentFile(name, path) {
        file.path = path;
        file.name = name;
    }

    const lastSave = {
        id: undefined,
        path: null,
        debounceTime: 500,
    };
    function saveCurrentFile(content) {
        const filePath = file.path;
        if (lastSave.id && lastSave.path === filePath) {
            clearTimeout(lastSave.id);
            console.log("write: debounced");
        }
        lastSave.path = filePath;
        lastSave.id = setTimeout(() => {
            api.writeFile(filePath, content)
                .then(console.log)
                .catch(console.error)
                .finally(() => {
                    console.log("write: complete!");
                });
        }, lastSave.debounceTime);
    }

    return {
        app,
        file,
        setLayout,
        refreshExplorer,
        setCurrentFile,
        saveCurrentFile,
    };
});
