<script setup lang="ts">
import { onMounted, ref } from "vue";
import unnamed from "../assets/unnamed.png";

class Squad {
	rank: string;
	img: any;
	squadName: string;
	wwcd: number = 0;
	pla: number = 0;
	fin: number = 0;
	points: number = 0;

	constructor(squadName: string, rank: number, img: any) {
		this.squadName = squadName;
		if(rank < 10) {
			this.rank = "0" + rank;
		} else {
			this.rank = rank.toString();
		}
		this.img = img;
	}
}

const squads = ref<Array<Squad>>([]);

onMounted(() => {
	let s = [...squads.value];
	for(let i = 1; i < 20; i++) {
		s.push(new Squad("Squad Number " + i, i, unnamed));
	}
	squads.value = s;
});
</script>

<template>
	<section id="points-section">
		<div id="points-table-header">
			<div class="points-table-row header">
				<div class="rank">Rank</div>
				<div class="squad-name">Team Name</div>
				<div class="wwcd">wwcd</div>
				<div class="pla-pts">pla. pts</div>
				<div class="fin">fin</div>
				<div class="points">points</div>
			</div>
		</div>
		<div id="points-table">
			<div class="points-table-row" v-for="squad in squads">
				<div class="rank">{{squad.rank}}</div>
				<div class="image-container">
					<img :src="squad.img" alt="" />
				</div>
				<div class="squad-name">{{squad.squadName}}</div>
				<div class="wwcd">x{{squad.wwcd}}</div>
				<div class="pla-pts">{{squad.pla}}</div>
				<div class="fin">{{squad.fin}}</div>
				<div class="points">{{squad.points}}</div>
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

.points-table-row > .image-container > img {
	padding: 10%;
}

.points-table-row > .image-container > img {
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

</style>
