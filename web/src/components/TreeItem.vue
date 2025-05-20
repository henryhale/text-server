<script setup>
import {
    FolderIcon,
    FolderOpenIcon,
    FileIcon,
    FilePlusIcon,
    LoaderCircleIcon,
} from "lucide-vue-next";
import TreeItem from "./TreeItem.vue";
import { reactive, ref, onBeforeMount } from "vue";
import { useState } from "../store";
import api from "../api";

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
});

const fileNameInput = ref();

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
    // ...
    local.loading = true;
    api.readdir(props.item.path)
        .then((res) => {
            local.children = [
                ...(res.content.folders || []),
                ...(res.content.files || []),
            ];
        })
        .catch(console.error)
        .finally(() => {
            local.loading = false;
        });
}

function loadFile() {
    // load file content
    // ...
    local.loading = true;
    api.readFile(props.item.path)
        .then((res) => {
            state.file.content = res.content;
        })
        .catch(console.error)
        .finally(() => {
            local.loading = false;
        });
}

function showNewFileForm() {
    local.newFile = true;
    local.expanded = true;
    setTimeout(() => fileNameInput.value?.focus());
}

function createFile() {
    console.log("create file 1: ", props.item.path, local.newFileName);
    local.newFile = false;
    if (!local.newFileName) return;
    console.log("create file 2: ", props.item.path, local.newFileName);
    api.createFile(props.item.path, local.newFileName)
        .then(() => loadDirectory())
        .catch(console.error)
        .finally(() => {
            local.newFileName = "";
        });
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
            <div class="flex-grow overflow-hidden text-ellipsis">
                {{ item.name }}
            </div>
            <div
                class="hidden group-hover:flex absolute right-0 top-0 bottom-0 items-center space-x-1 px-2"
            >
                <button v-if="item.dir" @click.stop="showNewFileForm">
                    <FilePlusIcon class="size-4" />
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
