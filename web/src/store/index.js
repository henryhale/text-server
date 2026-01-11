import { defineStore } from "pinia";
import { reactive, shallowRef } from "vue";
import api from "../api";
import log from "../utils/log";

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
        log.debug("refreshing explorer");
        const tmp = app.files.splice(0);
        app.loadingFiles = true;
        api.getRootTree()
            .then((res) => {
                app.files.push(res.content);
            })
            .catch((e) => {
                log.error(e);
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
        debounceTime: 300,
    };

    function saveCurrentFile(content) {
        const filePath = file.path;
        if (lastSave.id && lastSave.path === filePath) {
            clearTimeout(lastSave.id);
        }
        lastSave.path = filePath;
        lastSave.id = setTimeout(() => {
            api.writeFile(filePath, content)
                .then(log.debug)
                .catch(log.error)
                .finally(() => {
                    log.info("write: file saved successfully!");
                });
        }, lastSave.debounceTime);
    }

    function exportDocument() {
        if (!file.path) {
            log.info("select a file to print.");
            return;
        }
        window.print();
    }

    return {
        app,
        file,
        setLayout,
        refreshExplorer,
        setCurrentFile,
        saveCurrentFile,
        exportDocument,
    };
});
