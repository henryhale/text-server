<script setup>
import {
    FolderIcon,
    FolderOpenIcon,
    FileIcon,
    FilePlusIcon,
    LoaderCircleIcon,
    PencilIcon,
    TrashIcon,
} from "lucide-vue-next";
import TreeItem from "./TreeItem.vue";
import { reactive, ref, onBeforeMount } from "vue";
import { useState } from "../store";
import api from "../api";
import log from "../utils/log";

const state = useState();

const props = defineProps({
    item: {
        default: {},
        required: true,
    },
    autoload: {
        type: Boolean,
        default: false,
    },
});

const local = reactive({
    loading: false,
    expanded: false,
    children: [],
    newFile: false,
    newFileName: "",
    renaming: false,
    newName: "",
});

const fileNameInput = ref();
const renameInput = ref();

onBeforeMount(() => !!props.autoload && onClick());

function onClick() {
    if (props.item.dir) {
        local.expanded = !local.expanded;
        if (local.expanded && !local.children.length) loadDirectory();
    } else {
        state.setCurrentFile(props.item.path, props.item.name);
        loadFile();
    }
}

function loadDirectory() {
    // fetch files for current directory
    local.loading = true;
    api.readdir(props.item.path)
        .then((res) => {
            log.debug("dir: ", props.item.path, res.content);
            local.children = [
                ...(res.content.folders || []),
                ...(res.content.files || []),
            ];
        })
        .catch(log.error)
        .finally(() => {
            local.loading = false;
        });
}

function loadFile() {
    // load file content
    local.loading = true;
    api.readFile(props.item.path)
        .then((res) => {
            state.file.content = res.content;
        })
        .catch(log.error)
        .finally(() => {
            local.loading = false;
        });
}

function refreshTree() {
    if (api.IS_SERVER) {
        loadDirectory();
    } else {
        state.refreshExplorer();
    }
}

function showNewFileForm() {
    local.newFile = true;
    local.expanded = true;
    setTimeout(() => fileNameInput.value?.focus());
}

function createFile() {
    local.newFile = false;
    if (!local.newFileName) return;
    log.debug("create: ", props.item.path, local.newFileName);
    api.createFile(props.item.path, local.newFileName)
        .then(() => refreshTree())
        .catch(log.error)
        .finally(() => {
            local.newFileName = "";
        });
}

function showRenameForm() {
    local.renaming = true;
    local.newName = props.item?.name ?? "";
    setTimeout(() => renameInput.value?.focus());
}

function renameFile() {
    // rename a file and refresh root
    if (!local.newName.length || props.item.name === local.newName) {
        local.renaming = false;
        return;
    }
    log.debug("rename -", "from:", props.item.name, "to:", local.newName);
    api.renameFile(props.item.path, local.newName)
        .then(() => refreshTree())
        .catch(log.error)
        .finally(() => {
            local.renaming = false;
        });
}

function deleteItem() {
    // delete the file - then refresh root
    if (!confirm("Delete this file? - " + props.item.path)) return;
    log.debug("delete:", props.item.path);
    api.removeFile(props.item.path)
        .then(() => {
            state.file.name = "";
            state.file.path = "";
        })
        .then(() => refreshTree())
        .catch(log.error);
}
</script>

<template>
    <li>
        <div
            @click="onClick"
            tabindex="-1"
            class="group"
            :class="{ selected: state.file.path === item.path }"
        >
            <div>
                <template v-if="!local.loading">
                    <FileIcon v-if="!item.dir" class="size-4" />
                    <template v-else>
                        <FolderOpenIcon v-if="local.expanded" class="size-4" />
                        <FolderIcon v-else class="size-4" />
                    </template>
                </template>
                <LoaderCircleIcon v-else class="size-4 animate-spin" />
            </div>
            <div
                v-if="local.renaming"
                class="w-full pr-1"
                :class="{ 'w-0 h-0 overflow-hidden': !local.renaming }"
            >
                <input
                    ref="renameInput"
                    v-model.trim="local.newName"
                    type="text"
                    spellcheck="false"
                    class="w-full"
                    @blur.stop="renameFile"
                    @keyup.enter.stop="renameInput.blur()"
                />
            </div>
            <div v-else class="flex-grow overflow-hidden text-ellipsis">
                {{ item.name }}
            </div>
            <div
                :class="{ 'group-hover:flex': !local.renaming }"
                class="hidden absolute right-0 top-0 bottom-0 items-center space-x-1 px-2"
            >
                <button v-if="item.dir" @click.stop="showNewFileForm">
                    <FilePlusIcon class="size-4" />
                </button>
                <button
                    v-if="props.item.path !== ''"
                    @click.stop="showRenameForm"
                >
                    <PencilIcon class="size-4" />
                </button>
                <button v-if="props.item.path !== ''" @click.stop="deleteItem">
                    <TrashIcon class="size-4" />
                </button>
            </div>
        </div>
        <div
            v-show="local.expanded"
            class="ml-4 border-l pl-4 border-slate-400"
        >
            <ul v-show="local.children && !local.loading">
                <TreeItem
                    v-for="item in local.children"
                    :key="item.path"
                    :item="item"
                    :autoload="false"
                ></TreeItem>
            </ul>
            <div
                class="mt-0.5"
                :class="{ 'w-0 h-0 overflow-hidden': !local.newFile }"
            >
                <input
                    ref="fileNameInput"
                    v-model.trim="local.newFileName"
                    @blur.stop="createFile"
                    @keyup.enter.stop="fileNameInput.blur()"
                    type="text"
                    spellcheck="false"
                />
            </div>
        </div>
    </li>
</template>

<style scoped>
li {
    @apply cursor-default flex flex-col my-0.5;
}
li > div:first-child {
    @apply focus:ring-slate-300 focus:ring-1 focus:bg-slate-200 hover:bg-slate-100
    relative flex items-center pl-2 py-1 outline-none rounded space-x-2;
}
li > div.selected:first-child {
    @apply bg-slate-200;
}
</style>
