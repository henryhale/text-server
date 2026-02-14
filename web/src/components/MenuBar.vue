<script setup>
import {
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarPortal,
    MenubarRoot,
    MenubarTrigger,
} from "reka-ui";
import { ArrowUpRightIcon } from "lucide-vue-next";
import { useState } from "../store";
import { convertElementToPDF } from "../utils/pdf";

const state = useState();

const menu = {
    File: {
        // Save: () => {},
        Print: () => {
            state.exportDocument();
        },
        "Export as PDF": () => {
            if (!state.file.name) return;
            const container = document.querySelector(".lake-container");
            convertElementToPDF(container, state.file.name);
        },
    },
    Session: {
        Logout: () => {
            window.location.href = "/?logout=now";
        },
    },
    Help: {
        About: () => {
            window.location.href =
                "https://github.com/henryhale/text-server#readme";
        },
        "Report Issue": () => {
            window.location.href =
                "https://github.com/henryhale/text-server/issues";
        },
        License: () => {
            window.location.href =
                "https://github.com/henryhale/text-server/blob/master/LICENSE.txt";
        },
    },
};

const isExternal = (k) => ["License", "About", "Report Issue"].includes(k);
</script>

<template>
    <MenubarRoot class="flex space-x-0.5">
        <MenubarMenu v-for="(options, item) in menu" :key="item" :value="item">
            <MenubarTrigger
                class="cursor-default rounded py-1.5 px-2 outline-none select-none leading-none font-medium text-xs flex items-center justify-between gap-[2px] data-[state=open]:bg-slate-200 hover:bg-slate-200"
            >
                {{ item }}
            </MenubarTrigger>
            <MenubarPortal>
                <MenubarContent
                    class="min-w-[200px] outline-none bg-white rounded-lg p-[5px] border shadow-sm [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
                    align="start"
                    :side-offset="5"
                    :align-offset="-3"
                >
                    <MenubarItem
                        v-for="(action, k) in options"
                        :key="k"
                        @click="action()"
                        class="group text-sm leading-none rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[highlighted]:bg-slate-100"
                    >
                        {{ k }}
                        <div v-if="isExternal(k)" class="ml-auto pl-5">
                            <ArrowUpRightIcon class="w-4 h-4" />
                        </div>
                    </MenubarItem>
                </MenubarContent>
            </MenubarPortal>
        </MenubarMenu>
    </MenubarRoot>
</template>
