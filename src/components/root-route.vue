<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
<div>
	<button><router-link to="/kills-table">kills table</router-link></button>
</div>
<div>
	<button><router-link to="/final-table">final table</router-link></button>
</div>
</template>

<style>
body{
	background-color: rgb(1, 1, 1);
}
</style>
