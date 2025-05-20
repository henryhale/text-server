<script setup>
import { useTemplateRef, onMounted, onUnmounted, watchEffect } from "vue";
import { createEditor } from "../editor";
import { useState } from "../store";
import api from "../api";

const state = useState();

const toolbarRef = useTemplateRef("toolbarRef");
const contentRef = useTemplateRef("contentRef");

let editor = null;

onMounted(() => {
    editor = createEditor(toolbarRef.value, contentRef.value);
    editor.render();

    editor.event.on("change", (value) => {
        // save content to storage
        // ...
        state.saveCurrentFile(value);
    });

    watchEffect(() => {
        editor.setValue(state.file.content);
        if (state.file.path) editor.focus();
    });
});

onUnmounted(() => {
    if (editor) {
        editor.unmount();
        editor = null;
    }
});
</script>

<template>
    <div class="flex flex-col h-full bg-slate-100">
        <div ref="toolbarRef" class="border-b bg-white"></div>
        <div ref="contentRef" class="flex-grow overflow-auto p-2"></div>
    </div>
</template>

<style>
.lake-container {
    @apply container max-w-5xl mx-auto min-h-[90vh] bg-white border p-4 md:px-[48px] md:py-[40px];
}
</style>
