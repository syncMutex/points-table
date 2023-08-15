<script setup lang="ts">
import { ref, onMounted } from "vue";
import { POST, GET } from "./common.ts";

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
		if(this.alive > 0) {
			this.alive--;
		}
	}

	unkill() {
		if(this.alive < 4) {
			this.alive++;
		}
	}
}

const squads = ref<Array<Squad>>(new Array(0));
const sqIdx = ref(-1);
const selectedSquad = ref<null | Squad>(null);
const msg = ref('');
const btns = ref<Array<{name: string, point: number}>>([]);
const btnName = ref('');
const btnPoints = ref(0);

function selectTeam(idx: number) {
	sqIdx.value = idx;
	reset();
}

function update() {
	if(selectedSquad !== null)
		squads.value[sqIdx.value] = {...selectedSquad.value} as Squad;
}

function addBtn() {
	btns.value.push({ name: btnName.value, point: btnPoints.value });
	btnPoints.value = 0;
	btnName.value = '';
}

function addPoints(point: number) {
	if(selectedSquad.value !== null) {
		selectedSquad.value.points += point;
	}
}

function reset() {
	const s = squads.value[sqIdx.value];
	selectedSquad.value = new Squad(s.squadName, s.img);
	selectedSquad.value.points = s.points;
	selectedSquad.value.alive = s.alive;
}

async function saveBtnsToServer() {
	await POST('/save-btns', btns.value, msg);
}

onMounted(async () => {
	squads.value = (await GET("/squads", msg)).map((s: any) => new Squad(s.squadName, s.img));
	btns.value = await GET("/btns", msg);
});
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

	<section id="input-section" v-if="selectedSquad !== null">
		<button @click="update">update</button>
		<button @click="reset">reset</button>
		<button @click="() => {
			selectedSquad = null;
			sqIdx = -1;
		}">close</button>
		<div class="selected-team">
			<div class="team">
				<div class="rank">#{{sqIdx + 1}}</div>
				<div class="img-container"><img :src="selectedSquad.img" alt=""></div>
				<div class="squad-name">{{selectedSquad.squadName}}</div>
				<div class="points">{{selectedSquad.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= selectedSquad.alive) ? 'alive' : '']"></div>
				</div>
			</div>
		</div>

		<div class="control-btns">
			<button style="color: white; background-color: red; width: 6rem; height: 2rem;" @click="selectedSquad.kill">kill</button>
			<button style="background-color: rgb(0, 255, 0); width: 6rem; height: 2rem;" @click="selectedSquad.unkill">unkill</button>
			<br />
			<div class="btns-list">
				<div v-for="btn in btns" @click="addPoints(btn.point)">
					<span>{{btn.name}}</span>
					<span>points: {{btn.point}}</span>
				</div>
			</div>
		</div>
	</section>

	<section class="new-btn-section" v-if="selectedSquad !== null">
		<div class="new-btn-container">
			<h2>new button</h2>
			<div>
				<span>name: </span>
				<input type="text" v-model="btnName" />
			</div>
			<div>
				<span>points: </span>
				<input type="number" v-model="btnPoints"/>
			</div>
			<div>
				<button :disabled="btnName.trim() === ''" @click="addBtn">add</button>
			</div>
			<div>
				<button @click="saveBtnsToServer">save to server</button>
			</div>

			<br/>
			<h2>list</h2>
			<div class="btns-list-to-delete">
				<div v-for="(btn, idx) in btns">
					<button>{{btn.name}}</button>
					<button class="delete-btn" @click="() => {
						btns.splice(idx, 1);
					}">delete</button>
				</div>
			</div>
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

.img-container img{
	width: 100%;
	height: 100%;
	object-fit: contain;
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

#input-section, .new-btn-section{
	background-color: white;
	width: 30rem;
	height: max-content;
	margin-left: 3rem;
	padding: 0.5rem;
}

.selected-team{
	display: flex;
	margin-top: 1rem;
}

.selected-team .team{
	background-color: rgb(20, 20, 20);
}

.control-btns{
	margin-top: 1rem;
	padding: 1rem;
}

.control-btns button{
	cursor: pointer;
}

.new-btn-section{
	width: 16rem;
	height: max-content;
}

.new-btn-container > div{
	margin-top: 1rem;
}

.btns-list{
	margin-top: 1rem;
	display: flex;
	flex-direction: column;
}

.btns-list > div{
	margin-top: 0.5rem;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	background-color: grey;
	color: white;
	padding: 0.5rem 0;
	cursor: pointer;
}

.btns-list-to-delete{
	display: flex;
	flex-direction: column;
}

.btns-list-to-delete > div{
	margin-top: 0.2rem;
}

.btns-list-to-delete > div > button:first-child{
	pointer-events: none;
}

.delete-btn{
	background-color: red;
	color: white;
	cursor: pointer;
}
</style>

