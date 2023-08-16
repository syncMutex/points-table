<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { GET } from "./common.ts";

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

// async function saveToServer() {
// 	await POST("/save-squads", squads.value, msg);
// }

onMounted(async () => {
	squads.value = await GET("/squads", msg);
});
</script>

<template>
	<section id="points-section">
		<div id="points-table-header">
			<div class="points-table-row header">
				<div class="rank">Rank</div>
				<div class="squad-name">Team Name</div>
				<div class="wwcd">wwcd</div>
				<div class="fin">fin</div>
				<div class="points">points</div>
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
#points-table, #points-table-header{
	width: 60rem;
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
