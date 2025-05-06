<script setup>
import { FolderIcon, FolderOpenIcon, FileIcon, RotateCwIcon, FolderPlusIcon, FilePlusIcon, PencilIcon } from 'lucide-vue-next'
import { TreeItem, TreeRoot } from 'reka-ui'
import { onMounted, reactive, ref } from 'vue'

const props = defineProps(["item"])

const emit = defineEmits(["select", "rename", "create"])

const state = reactive({
    edit: false,
    name: ''
})

const fileName = ref()

onMounted(() => {
    state.name = props.item.value.name
})

function renameFile() {
    state.edit = false
    console.log('rename', fileName.value.value, state.name)
    emit('rename', props.item.value.path, state.name)
}

function stopEvent(e) {
    state.edit && e.stopImmediatePropagation()
}
</script>

<template>
    <TreeItem v-slot="{ isExpanded }" :style="{ 'padding-left': `${item.level - 0.5}rem` }" v-bind="item.bind"
        @select="!item.value.dir && emit('select', item.value.path)"
        class="group flex items-center py-1 px-2 my-0.5 rounded outline-none focus:ring-slate-300 focus:ring-1 data-[selected]:bg-slate-200">
        <template v-if="item.hasChildren">
            <FolderIcon v-if="!isExpanded" class="size-4" />
            <FolderOpenIcon v-else class="size-4" />
        </template>
        <FileIcon v-else class="size-4" />
        <span v-show="!state.edit" class="pl-2 flex-grow">{{ state.name }}</span>
        <input v-show="state.edit" ref="fileName" type="text" v-model.trim="state.name" @blur.stop="renameFile"
            @keyup.enter="renameFile" @click="stopEvent" @focus="stopEvent" :class="{ 'border': state.edit }"
            :disabled="!state.edit" class="ml-1 pl-1 flex-grow outline-none rounded" autofocus>
        <button @click.stop="state.edit = true" class="btn" :class="{'hidden': state.edit}" title="Rename">
            <PencilIcon class="size-4" />
        </button>
    </TreeItem>
</template>

<style scoped>
.btn {
    @apply p-0.5 opacity-0 group-hover:opacity-100 rounded hover:bg-slate-100 focus:bg-slate-200;
}
</style>