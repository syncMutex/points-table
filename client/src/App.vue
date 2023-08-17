<script setup lang="ts">
import { RouterView } from 'vue-router';
import { HOST } from './components/common.ts';
import { isConnected } from './socket.ts';
</script>

<template>
<span class="cur-domain">
	<div :class="isConnected ? 'connected' : ''"></div>
	{{HOST}}
</span>
<router-view></router-view>
</template>

<style>
body{
	background-color: rgb(30, 30, 30);
	width: 100vw;
	height: 100vh;
}

.cur-domain{
	position: fixed;
	color: white;
	z-index: 100;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: row;
}

.cur-domain > div{
	width: 1rem;
	height: 1rem;
	background-color: red;
	margin-right: 0.3rem;
}
.cur-domain > .connected {
	background-color: rgb(0, 255, 0);
}
</style>
