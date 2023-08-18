import { io } from 'socket.io-client';
import { ref } from 'vue';
import { HOST } from './components/common';

export let socket = io(`http://${HOST.value}:5000`, {});
export const isConnected = ref(false);

function events() {
	socket.on("connect", () => {
		isConnected.value = true;
	});

	socket.on('disconnect', () => {
		isConnected.value = false;
	});
}

events();

export function reconnect(addr: string) {
	isConnected.value = false;
	socket.disconnect();
	socket = io(addr);
	socket.on("connect", () => {
		isConnected.value = true;
	});
}

