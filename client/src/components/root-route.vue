<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { reconnect } from "../socket.ts";
import { changeHost, U, HOST } from "./common.ts";
import { ref } from 'vue';

const host = ref(HOST.value);

function change() {
	changeHost(host.value);
	reconnect(U(''));
}

</script>

<template>
<div class="buttons">
	<div>
		<router-link to="/kills-table">
			<button>operator kills table</button>
		</router-link>
	</div>
	<div>
		<router-link to="/final-table">
			<button>operator final table</button>
		</router-link>
	</div>
	<div>
		<router-link to="/client/kills-table">
			<button>client kills table</button>
		</router-link>
	</div>
	<div>
		<router-link to="/client/final-table">
			<button>client final table</button>
		</router-link>
	</div>
	<div>
		<router-link to="/add-remove-squad">
			<button>add remove squad</button>
		</router-link>
	</div>

	<div class="host">
		host: <input type="text" name="" id="" v-model="host" />
		<button @click="change">change</button>
	</div>
</div>
</template>

<style scoped>
.buttons{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

button{
	margin-bottom: 1rem;
	width: 10rem;
	height: 2rem;
	font-size: 1rem;
	cursor: pointer;
}

button > *{
	text-decoration: none;
}

.host{
	width: 20rem;
	height: 2rem;
	background-color: blue;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 1.5rem;
	color: white;
	padding-left: 0.5rem;
}

.host input{
	width: 100%;
	height: 100%;
	font-size: 1.2rem;
	color: black;
	padding-left: 0.5rem;
}

.host button{
	margin: 0;
	margin-left: 1rem;
}
</style>
