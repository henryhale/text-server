<script setup>
import api from "../api";
import { ref, onMounted, onBeforeUnmount } from "vue";

const online = ref(true);

let lastID = undefined;

// check 4 times in a minute
const duration = 15 * 1000;

onMounted(() => {
    lastID = setInterval(() => {
        api.getHealth()
            .then((res) => {
                online.value = res.content == "OK";
            })
            .catch(() => (online.value = false));
    }, duration);
});

onBeforeUnmount(() => clearInterval(lastID));
</script>

<template>
    <div
        class="py-1 px-2 border-t flex items-center space-x-2 text-xs font-bold uppercase"
    >
        <div class="flex-grow opacity-70">
            Status: {{ online ? "Online" : "Offline" }}
        </div>
        <div>
            <span class="status" :class="online ? 'online' : 'offline'"></span>
        </div>
    </div>
</template>

<style scoped>
.status {
    position: relative;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin: 10px;
}

.status:before {
    content: "";
    display: block;
    position: absolute;
    left: -5px;
    top: -5px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    animation: pulse 1.5s infinite ease-in;
}

.status.online,
.status.online:before {
    @apply bg-green-300;
}

.status.offline,
.status.offline:before {
    @apply bg-red-300;
}

@keyframes pulse {
    from {
        transform: scale(0.5);
        opacity: 1;
    }
    to {
        transform: scale(1.5);
        opacity: 0;
    }
}
</style>
