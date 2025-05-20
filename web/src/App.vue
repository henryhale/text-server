<script setup>
import AppHeader from "./components/AppHeader.vue";
import AppMain from "./components/AppMain.vue";
import FileEditor from "./components/FileEditor.vue";
import TreeView from "./components/TreeView.vue";
import { useState } from "./store";
import { computed } from "vue";

const state = useState();

const showEditor = computed(() => state.file.path && state.file.name);
</script>

<template>
    <AppHeader />
    <AppMain>
        <template #left>
            <TreeView />
        </template>
        <template #right>
            <FileEditor v-show="showEditor" />
            <div
                v-show="!showEditor"
                class="h-full flex flex-col items-center justify-center gap-10 opacity-40"
            >
                <img src="/favicon.svg" class="size-10 md:size-12" />
                <span class="italic text-base">writing made easy</span>
            </div>
        </template>
    </AppMain>
</template>
