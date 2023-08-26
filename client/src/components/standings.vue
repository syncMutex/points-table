<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { GET, DELETE } from "./common.ts";
import { socket } from "../socket";

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

const selectedSquad = reactive<{rank: number, squad: Squad | null}>({
	rank: -1,
	squad: null
});
const squads = ref<Array<Squad>>([]);
const msg = ref("");

function selectTeam(idx: number) {
	selectedSquad.squad = squads.value[idx];
	selectedSquad.rank = idx + 1;
}

async function reset() {
	await DELETE("/api/reset-standings", msg);
	squads.value = await GET("/api/standings", msg);
}

function setFin(squadName: string, value: number) {
	const sq = squads.value.find((sq) => sq.squadName === squadName);
	if(sq) sq.fin = value;
	squads.value.sort((a, b) => b.points - a.points);

	socket.emit("set-standings-fin-points", squadName, selectedSquad.squad?.fin, selectedSquad.squad?.points);
}

function setPoints(squadName: string, value: number) {
	let sq = squads.value.find((sq) => sq.squadName === squadName);
	if(sq) sq.points = value;
	squads.value.sort((a, b) => b.points - a.points);

	let sqi = squads.value.findIndex((sq) => sq.squadName === squadName);
	if(sqi !== -1) selectTeam(sqi);

	socket.emit("set-standings-fin-points", squadName, selectedSquad.squad?.fin, selectedSquad.squad?.points);
}

onMounted(async () => {
	squads.value = await GET("/api/standings", msg);
});
</script>

<template>
	<section id="points-section">
		<div id="points-table-header">
			<div class="points-table-row header">
				<div class="rank">RANK</div>
				<div class="squad-name">TEAM NAME</div>
				<div class="fin">FINISHES</div>
				<div class="points">POINTS</div>
			</div>
		</div>
		<div id="points-table">
			<div class="points-table-row" @click="selectTeam(index)" v-for="(squad, index) in squads">
				<div class="rank">{{index + 1}}</div>
				<div class="image-container">
					<img :src="squad.img" alt="" />
				</div>
				<div class="squad-name">{{squad.squadName}}</div>
				<div class="fin">{{squad.fin}}</div>
				<div class="points">{{squad.points}}</div>
			</div>
		</div>
	</section>

	<section v-if="selectedSquad.rank !== -1" class="selected-section">
		<div class="selected-team">
			<div class="points-table-row">
				<div class="rank">
					{{selectedSquad.rank}}
				</div>
				<div class="image-container">
					<img :src="selectedSquad.squad?.img" alt="" />
				</div>
				<div class="squad-name">{{selectedSquad.squad?.squadName}}</div>
				<div class="fin">
					<input type="number"
						@keypress.enter="(e: any) => setFin(selectedSquad.squad?.squadName || '', +e.target.value)"
						:value="selectedSquad.squad?.fin"
					/>
				</div>
				<div class="points">
					<input type="number"
						@keypress.enter="(e: any) => setPoints(selectedSquad.squad?.squadName || '', +e.target.value)"
						:value="selectedSquad.squad?.points"
					/>
				</div>
			</div>
		</div>
	</section>
	<button class="reset-btn" @click="reset">reset</button>
</template>

<style scoped>
#points-table, #points-table-header{
	width: 100%;
	height: 100%;
	font-family: Arial, Helvetica, sans-serif;
}

#points-section{
	position: relative;
	width: 60rem;
	height: 30rem;
	background: url("../assets/final-table-bg.webp") no-repeat;
	background-size: 100% 100%;
	background-position: center;
	display: flex;
	flex-direction: column;
}

#points-table{
	overflow-y: auto;
}

#points-table-header{
	height: 3rem;
}

#points-table-header > .points-table-row {
	color: yellow;
	font-weight: 800;
}

#points-table::-webkit-scrollbar{
	width: 6px;
	height: 6px;
	background: black;
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
	background-color: rgba(0, 0, 0, 0.7);
	color: white;
	border-bottom: 1px solid rgb(136, 136, 136);
}

.points-table-row.header > .squad-name {
	min-width: 37rem;
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
	padding: 5%;
}

.image-container img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.points-table-row > .squad-name {
	min-width: 30rem;
	height: 100%;
	justify-content: flex-start;
	padding-left: 1rem;
}

.reset-btn{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 6rem;
	height: 2rem;
}
</style>
