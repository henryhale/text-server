<script setup>
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
import FileEditor from './components/FileEditor.vue';
import FileTree from './components/FileTree.vue';
import { reactive, onMounted } from 'vue'
import api from './api'

const state = reactive({
	layout: 'split',
	workspace: 'Project Alpha',
	file: 'business-plan',
	data: '',
	content: '',
	loadingItems: false,
	items: [
		// { name: "docs", path: "alpha/docs", dir: true, children: [{ name: "doc1", path: "alpha/docs/doc1", dir: false }] },
		// { name: "paper", path: "alpha/paper", dir: false },
		// { name: "hello", path: "alpha/hello", dir: false },
	]
})

onMounted(() => updateFileTree())

function saveFile(content) {
	state.data = content
	api.writeFile(state.file, content).then(() => {}).catch(console.error)
}

function updateFileTree() {
	state.loadingItems = true
	api.getTree().then(res => {
		state.items = [...(res.content.folders || []), ...(res.content.files || [])]
		state.workspace = res.content.name
	}).catch(console.error).finally(() => { 
		state.loadingItems = false 
	})
}

function loadFile(path) {
	state.file = path
	api.readFile(path).then(res => {
		state.content = res.content
	}).catch(console.error)
}

function triggerMenu(item) {
	switch (item) {
		case 'save':
			state.data && saveFile(state.data)
			break;
	
		case 'logout':
			window.location.href = "/?logout=now"
			break;
			
		case 'license':
			window.location.href = "#"
			break;

		default:
			break;
	}
}

function renameFile(oldPath, newName) {
	// rename and update tree
	api.renameFile(oldPath, newName).then(() => updateFileTree()).catch(console.error)
}

function createFile(filePath) {
	// create empty file and update tree
	api.createFile(filePath).then(() => updateFileTree()).catch(console.error)
}
</script>

<template>
	<AppHeader :file="state.file" @menu="triggerMenu" @layout="value => { state.layout = value }" />
	<AppMain :layout="state.layout">
		<template #left>
			<FileTree :workspace="state.workspace" :items="state.items" :loading="state.loadingItems" @select="loadFile" @refresh="updateFileTree" @rename="renameFile" @create="createFile"/>
		</template>
		<template #right>
			<FileEditor :value="state.content" @change="saveFile" />
		</template>
	</AppMain>
</template>
