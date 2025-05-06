<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { ref, watchEffect, onMounted } from 'vue' 

const props = defineProps(["layout"])

const panelLeft = ref()
const panelRight = ref()

onMounted(() => {
    watchEffect(() => {
        switch (props.layout) {
            case "left":
                panelRight.value?.collapse()                
                panelLeft.value?.expand()
                break;
        
            case "right":
                panelLeft.value?.collapse()
                panelRight.value?.expand()                
                break;
            default:
                panelLeft.value?.expand()
                panelRight.value?.expand()                
                break;
        }
    }) 
})

</script>

<template>
    <main class="w-full h-[calc(100dvh-37px)] font-semibold text-sm">
        <SplitterGroup id="splitter-group-1" direction="horizontal">
            <SplitterPanel ref="panelLeft" id="splitter-group-1-panel-1" :defaultSize="25" :min-size="15" :collapse-size="15" collapsible>
                <slot name="left"></slot>
            </SplitterPanel>
            <SplitterResizeHandle id="splitter-group-1-resize-handle-1"
                class="w-1 h-full bg-slate-200 data-[state=hover]:bg-slate-300/75 data-[state=drag]:bg-slate-300">
            </SplitterResizeHandle>
            <SplitterPanel ref="panelRight" id="splitter-group-1-panel-2" :defaultSize="75" :min-size="25" :collapse-size="25" collapsible>
                <slot name="right"></slot>
            </SplitterPanel>
        </SplitterGroup>
    </main>
</template>