<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { POST, GET } from "./common.ts";

class Squad {
	img: any;
	squadName: string;
	wwcd: number = 0;
	fin: number = 0;
	points: number = 0;

	constructor(squadName: string, img: any) {
		this.squadName = squadName;
		this.img = img;
	}
}

const squads = ref<Array<Squad>>([]);

const squadName = ref('');
const previewUrl = ref('');
const squadFileInput = ref();
const selectedSquad = reactive<{rank: number, squad: Squad | null}>({
	rank: -1,
	squad: null
});
const msg = ref("");

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

function deleteCurSquad() {
	const r = selectedSquad.rank;
	selectedSquad.squad = null;
	selectedSquad.rank = -1;

	squads.value.splice(r - 1, 1);
}

async function saveToServer() {
	await POST("/api/save-squads", squads.value, msg);
}

onMounted(async () => {
	squads.value = await GET("/api/squads", msg);
});
</script>

<template>
	<div class="table">
		<section id="points-section">
			<div id="points-table-header">
				<div class="points-table-row header">
					<div class="rank">Rank</div>
					<div class="squad-name">Team Name</div>
				</div>
			</div>
			<div id="points-table">
				<div class="points-table-row" @click="selectTeam(index)" v-for="(squad, index) in squads">
					<div class="rank">{{index + 1}}</div>
					<div class="image-container">
						<img :src="squad.img" alt="" />
					</div>
					<div class="squad-name">{{squad.squadName}}</div>
				</div>
			</div>
		</section>

		<section class="input-section">
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

			<div class="save-to-server">
				<button @click="saveToServer">save to server</button>
			</div>
			<div>{{msg}}</div>
		</section>
	</div>

	<section v-if="selectedSquad.rank !== -1" class="selected-section">
		<div class="selected-team">
			<div class="points-table-row">
				<div class="rank">{{selectedSquad.rank}}</div>
				<div class="image-container">
					<img :src="selectedSquad.squad?.img" alt="" />
				</div>
				<div class="squad-name">{{selectedSquad.squad?.squadName}}</div>
			</div>
		</div>
		<div>
			<button class="delete-btn" @click="deleteCurSquad">delete</button>
		</div>
	</section>
</template>

<style scoped>
.table{
	display: flex;
	flex-direction: row;
}
#points-table, #points-table-header{
	width: 40rem;
	height: 30rem;
	background-color: rgb(50, 50, 50);
	overflow-y: auto;
	font-family: Arial, Helvetica, sans-serif;
}

#points-table-header{
	height: 3rem;
}

#points-table-header > .points-table-row {
	color: grey;
	font-weight: 800;
}

#points-table::-webkit-scrollbar{
	width: 6px;
	height: 6px;
}

#points-table::-webkit-scrollbar-thumb{
	background-color: yellow;
}

.points-table-row {
	width: 100%;
	height: 3rem;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
}

.points-table-row.header > .squad-name {
	min-width: 30rem;
	justify-content: center;
}

.points-table-row > div {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.image-container img {
	padding: 10%;
}

.image-container img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.points-table-row > .squad-name {
	min-width: 25rem;
	height: 100%;
	justify-content: flex-start;
	padding-left: 1rem;
}

.input-section{
	background-color: white;
	width: 16rem;
	height: 20rem;
	right: 2rem;
	top: 3rem;
	padding: 1rem;
}

.squad-input .image-preview{
	width: 5rem;
	height: 5rem;
	margin: 1rem 0;
}

.squad-input .image-preview img{
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.save-to-server{
	margin-top: 3rem;
}

.save-to-server button {
	padding: 0.2rem;
}

.selected-section{
	background-color: white;
}

.selected-team{
	display: flex;
	margin-top: 1rem;
	width: 40rem;
}

.selected-team .team{
	background-color: rgb(20, 20, 20);
}

.delete-btn{
	background-color: red;
	width: 3rem;
	height: 3rem;
	color: white;
}

</style>
