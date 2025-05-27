<script setup>
import { PanelLeftIcon, PanelRightIcon, Columns2Icon } from "lucide-vue-next";
import MenuBar from "./MenuBar.vue";
import { useState } from "../store";

const state = useState();

const buttons = [
    { icon: PanelLeftIcon, action: () => state.setLayout("left") },
    { icon: Columns2Icon, action: () => state.setLayout("split") },
    { icon: PanelRightIcon, action: () => state.setLayout("right") },
];
</script>

<template>
    <header
        class="flex items-center select-none space-x-2 lg:space-x-4 border-b px-2 sm:pr-4"
    >
        <div>
            <img src="/favicon.svg" class="size-8" />
        </div>

        <MenuBar />

        <div class="flex-grow text-center py-0.5">
            <span
                class="bg-slate-200 rounded-md hidden sm:inline-block w-1/2 border border-slate-300 text-sm"
            >
                {{ state.file.name || "&nbsp;" }}
            </span>
        </div>

        <div class="space-x-1 lg:space-x-2 flex py-0.5">
            <button
                v-for="b in buttons"
                :key="b"
                @click="b.action()"
                class="btn inline-flex items-center rounded-md px-2 py-1.5"
            >
                <component
                    :is="b.icon"
                    class="stroke-current w-4 h-4"
                ></component>
            </button>
        </div>
    </header>
</template>
