<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { socket } from "../socket.ts";
import { onMounted } from 'vue';

onMounted(() => {
	socket.emit("man", "man man");
})
</script>

<template>
<div class="buttons">
	<div>
		<router-link to="/kills-table">
			<button>kills table</button>
		</router-link>
	</div>
	<div>
		<router-link to="/final-table">
			<button>final table</button>
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
</style>
