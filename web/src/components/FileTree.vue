<script setup>
import { RotateCwIcon, FilePlusIcon, PlusIcon, LoaderCircleIcon } from 'lucide-vue-next'
import { TreeRoot } from 'reka-ui'
import FileTreeItem from './FileTreeItem.vue'
import { reactive } from 'vue'

const emit = defineEmits(["select", "refresh", "rename", "create"])
const props = defineProps(["workspace", "items", "loading"])

const state = reactive({
    newFile: false,
    filePath: '',
    saving: false,
})

function createFile() {
    if (state.filePath) {
        state.saving = true
        state.newFile = false
        emit("create", state.filePath)
        state.filePath = ''
        setTimeout(() => {
            state.saving = false
        }, 2000);
    }
}
</script>

<template>
    <TreeRoot v-slot="{ flattenItems }" class="list-none select-none w-full h-full overflow-y-auto rounded-lg p-2 text-sm font-medium"
        :items="props.items" :get-key="(item) => item.name"
        :get-children="(item) => (!item.files) ? item.folders : (!item.folders) ? item.files : [...item.folders, ...item.files]"
        :default-expanded="['components']">
        <h2 class="group font-semibold text-sm px-2 pt-1 pb-3 uppercase flex items-center space-x-1">
            <div class="flex-grow">{{ props.workspace }}</div>
            <button @click.stop="state.newFile = !state.newFile" class="btn p-0.5 opacity-0 group-hover:opacity-100"
                title="New File">
                <FilePlusIcon class="size-4" />
            </button>
            <button @click.stop="emit('refresh')" class="btn p-0.5 opacity-0 group-hover:opacity-100"
                title="Refresh Explorer">
                <RotateCwIcon class="size-4" :class="{ 'animate-spin': props.loading }" />
            </button>
        </h2>
        <div v-show="state.newFile" class="px-2 py-1 grid grid-cols-12 gap-x-1">
            <input :disabled="state.saving" v-model.trim="state.filePath" @keyup.enter.stop="createFile"
                @keydown.stop="() => {}" @click.stop="() => {}" type="text" placeholder="path/to/file"
                class="border rounded col-span-9 outline-none px-1 py-0.5 text-sm" />
            <button @click.stop="createFile" :disabled="state.saving" class="py-1 px-2 btn col-span-3 flex items-center justify-center">
                <LoaderCircleIcon v-if="state.saving" class="size-4 animate-spin" />
                <PlusIcon v-else class="size-4" />
            </button>
        </div>
        <FileTreeItem v-for="item in flattenItems" :key="item._id" :item="item" @rename="(f, o) => emit('rename', f, o)"
            @select="file => emit('select', file)" />
    </TreeRoot>
</template>

<style scoped>
.btn {
    @apply rounded hover:bg-slate-100 focus:bg-slate-200;
}
</style>