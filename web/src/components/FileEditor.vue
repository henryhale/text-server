<script setup>
import { useTemplateRef, onMounted, onUnmounted, watchEffect } from 'vue';
import { createEditor } from '../editor';

const props = defineProps(['value'])
const emit = defineEmits(["change"])

const toolbarRef = useTemplateRef('toolbarRef');
const contentRef = useTemplateRef('contentRef');

let editor = null;

onMounted(() => {
    editor = createEditor(toolbarRef.value, contentRef.value)
    editor.render()
    editor.event.on('change', (value) => emit("change", value))
    editor.focus()

    watchEffect(() => editor.setValue(props.value))
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