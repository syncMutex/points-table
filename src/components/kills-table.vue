<script setup lang="ts">
import { ref, reactive } from "vue";

class Squad {
	img: any;
	squadName: string;
	points: number = 0;
	alive: number = 4;

	constructor(squadName: string, img: any) {
		this.squadName = squadName;
		this.img = img;
	}

	kill() {
		this.alive--;
	}
}

const squadName = ref('');
const squads = ref<Array<Squad>>(new Array(0));
const previewUrl = ref('');
const squadFileInput = ref();
const selectedSquad = reactive<{rank: number, squad: Squad | null}>({
	rank: -1,
	squad: null
});

function fileInput() {
	const inp = squadFileInput.value as HTMLInputElement;
	if(inp.files === null) return;

	const reader = new FileReader;
	reader.onload = (e: any) => {
		let imageData = e.target.result;
		previewUrl.value = imageData;
	}
	reader.readAsDataURL(inp.files[0]);
}

function addSquad() {
	let s = [...squads.value];
	let url = previewUrl.value.slice();
	let sq = new Squad(squadName.value, url);
	s.push(sq);
	squads.value = s;
	clearSquadInput();
}

function clearSquadInput() {
	previewUrl.value = "";
	squadFileInput.value.value = "";
	squadName.value = "";
}

function selectTeam(idx: number) {
	selectedSquad.squad = squads.value[idx];
	selectedSquad.rank = idx + 1;
}
</script>

<template>
<div class="whole-page">
	<section id="kill-section">
		<div class="header">
		</div>
		<div class="teams">
			<div class="team" v-for="(squad, index) in squads" @click="selectTeam(index)" :key="index">
				<div class="rank">#{{index + 1}}</div>
				<div class="img-container"><img :src="squad.img" alt=""></div>
				<div class="squad-name">{{squad.squadName}}</div>
				<div class="points">{{squad.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= squad.alive) ? 'alive' : '']"></div>
				</div>
			</div>
		</div>
	</section>

	<section id="input-section">
		<div class="squad-input">
			<div>
				<span>squad name: </span>
				<input v-model="squadName" type="text" />
			</div>
			<div>
				<span>image: </span>
				<input ref="squadFileInput" @input="fileInput" type="file" />
				<div v-if="previewUrl !== ''" class="image-preview">
					<img :src="previewUrl" alt="">
				</div>
			</div>
			<button @click="addSquad" :disabled="squadName.trim() === '' || previewUrl === ''">add</button>
			<button @click="clearSquadInput">clear</button>
		</div>
		
		<div class="selected-team">
			<div class="team" v-if="selectedSquad.rank !== -1">
				<div class="rank">#{{selectedSquad.rank}}</div>
				<div class="img-container"><img :src="selectedSquad.squad?.img"></div>
				<div class="squad-name">{{selectedSquad.squad?.squadName}}</div>
				<div class="points">{{selectedSquad.squad?.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= (selectedSquad.squad?.alive || 0)) ? 'alive' : '']"></div>
				</div>
			</div>
		</div>

		<div>
		</div>
	</section>
</div>
</template>

<style scoped>
input[type="text"]{
	height: 1.5rem;
	width: 10rem;
}

button{
	height: 1.5rem;
	padding: 0 1rem;
	font-size: 0.9rem;
	margin-left: 1rem;
}

.whole-page {
	display: flex;
	flex-direction: row;
}

#kill-section{
	margin: 5% 0 0 5%;
	width: 16rem;
	height: 40rem;
	background-color: rgb(50, 50, 50);
	overflow: hidden;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.header {
	width: 100%;
	height: 5rem;
	background-color: rgb(20, 20, 20);
}
	
.teams{
	width: 100%;
	height: calc(40rem - 5rem);
	display: flex;
	flex-direction: column;
	overflow: auto;
}

.teams::-webkit-scrollbar{
	width: 6px;
	height: 6px;
}

.teams::-webkit-scrollbar-thumb{
	background-color: rgb(80, 80, 80);
}

.team{
	width: 100%;
	min-height: 2rem;
	color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-top: 2px solid rgba(0, 255, 0, 0.2);
}

.img-container{
	width: 1.5rem;
	height: 1.5rem;
}

.rank{
	width: 2.5rem;
	margin-left: 0.2rem;
	color: yellow;
}

.squad-name{
	width: 30%;
	margin-left: 0.5rem;
}

.points{
	width: 3rem;
	text-align: center;
	font-weight: 800;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.alive-states{
	width: 2.5rem;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	padding: 0.3rem 0;
	margin-left: 1rem;
}

.dead-box{
	width: 0.4rem;
	height: 100%;
	border: 2px solid white;
}

.alive{
	background-color: rgb(0, 255, 0);
	border: none;
}

.img-container img{
	width: 100%;
	height: 100%;
	object-fit: contain;
}

#input-section{
	background-color: white;
	width: 30rem;
	height: 20rem;
	margin-left: 3rem;
	padding: 0.5rem;
}

.squad-input > div{
	display: block;
	width: 100%;
	margin-bottom: 0.5rem;
}

.squad-input img{
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.image-preview{
	width: 5rem;
	height: 5rem;
	margin-top: 0.5rem;
}
.selected-team{
	display: flex;
	margin-top: 1rem;
}
.selected-team .team{
	background-color: rgb(20, 20, 20);
}
</style>

