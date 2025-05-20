import "lakelib/lib/lake.css";
import { Editor, Toolbar } from "lakelib";
import { toolbarItems } from "./toolbar";

export function createEditor(toolbarElement, contentElement) {
    const toolbar = new Toolbar({
        root: toolbarElement,
        items: toolbarItems,
    });

    const editor = new Editor({
        root: contentElement,
        toolbar,
        value: "New document",
        spellcheck: false,
        tabIndex: 0,
        placeholder: "",
        indentWithTab: true,
        lang: "en-US",
        minChangeSize: 5,
        historySize: 100,
        slash: false,
        mention: false,
        image: false,
        file: false,
        showMessage: (type, message) => {
            if (type === "success") {
                console.log(message);
                return;
            }
            if (type === "warning") {
                console.warn(message);
                return;
            }
            if (type === "error") {
                console.error(message);
            }
        },
        downloadFile: (type, url) => {
            window.open(url);
        },
    });

    return editor;
}
