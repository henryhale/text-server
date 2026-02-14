<script setup>
import { RotateCwIcon } from "lucide-vue-next";
import TreeItem from "./TreeItem.vue";
import { useState } from "../store";
import { onBeforeMount } from "vue";

const state = useState();

onBeforeMount(() => state.refreshExplorer());
</script>

<template>
    <div>
        <div
            class="font-semibold text-sm px-3 py-2 border-b uppercase flex items-center space-x-1"
        >
            <div class="flex-grow">EXPLORER</div>
            <button
                @click.stop="state.refreshExplorer()"
                title="Refresh Explorer"
            >
                <RotateCwIcon
                    class="size-4"
                    :class="{ 'animate-spin': state.app.loadingFiles }"
                />
            </button>
        </div>
        <ul class="p-1 select-none overflow-y-auto flex-grow">
            <TreeItem
                v-for="item in state.app.files"
                :key="item.path"
                :item="item"
                :autoload="true"
            />
        </ul>
    </div>
</template>
