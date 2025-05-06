<script setup>
import { PanelLeftIcon, PanelRightIcon, Columns2Icon } from 'lucide-vue-next'
import MenuBar from './MenuBar.vue'

const emit = defineEmits(["layout", "menu"])
const props = defineProps(["file"])

const buttons = [
	{ icon: PanelLeftIcon, action: () => emit("layout", "left") },
	{ icon: Columns2Icon, action: () => emit("layout", "split") },
	{ icon: PanelRightIcon, action: () => emit("layout", "right") },
]
</script>

<template>
	<header class="flex items-center select-none space-x-2 lg:space-x-4 border-b px-4 py-0.5">
		<div>
			<img src="/favicon.svg" class="size-4 lg:size-6" />
		</div>

		<MenuBar @select="v => emit('menu', v)" />

		<div class="flex-grow text-center py-0.5">
			<span class="bg-slate-100 rounded-md hidden lg:inline-block w-1/2 border text-sm">
				{{ props.file }}
			</span>
		</div>

		<div class="space-x-1 lg:space-x-2 flex">
			<button v-for="b in buttons" :key="b" @click="b.action()" class="inline-flex items-center rounded-md p-2">
				<component :is="b.icon" class="stroke-current w-4 h-4"></component>
			</button>
		</div>
	</header>
</template>
