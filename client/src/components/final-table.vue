<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { GET, DELETE } from "./common.ts";

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

const selectedSquad = reactive<{rank: number, squad: Squad | null}>({
	rank: -1,
	squad: null
});
const msg = ref("");

function selectTeam(idx: number) {
	selectedSquad.squad = squads.value[idx];
	selectedSquad.rank = idx + 1;
}

async function reset() {
	await DELETE("/api/reset-final-table", msg);
	squads.value = await GET("/api/squads", msg);
}

onMounted(async () => {
	squads.value = await GET("/api/squads", msg);
});
</script>

<template>
	<section id="points-section">
		<div id="points-table-header">
			<div class="points-table-row header">
				<div class="rank">RANK</div>
				<div class="squad-name">TEAM NAME</div>
				<div class="wwcd">WWCD</div>
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
				<div class="wwcd">x{{squad.wwcd}}</div>
				<div class="fin">{{squad.fin}}</div>
				<div class="points">{{squad.points}}</div>
			</div>
		</div>
	</section>

	<button class="reset-btn" @click="reset">reset</button>

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
				<div class="wwcd">x{{selectedSquad.squad?.wwcd}}</div>
				<div class="fin">{{selectedSquad.squad?.fin}}</div>
				<div class="points">{{selectedSquad.squad?.points}}</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.reset-btn{
	position: fixed;
	top: 0;
	right: 0;
}

#points-table, #points-table-header{
	width: 100%;
	height: 100%;
	font-family: Arial, Helvetica, sans-serif;
}

#points-section{
	position: relative;
	left: 2rem;
	top: 2rem;
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
	border-bottom: 1px solid white;
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
	padding: 5%;
}

.image-container img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.points-table-row > .squad-name {
	min-width: 23rem;
	height: 100%;
	justify-content: flex-start;
	padding-left: 1rem;
}

.selected-section{
	background-color: white;
}

.selected-team{
	display: flex;
	margin-top: 1rem;
	width: 60rem;
}

.selected-team .team{
	background-color: rgb(20, 20, 20);
}

</style>
