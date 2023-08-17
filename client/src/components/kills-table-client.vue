<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { socket } from "../socket.ts";
import banner from "../assets/banner.jpg";

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
}

const squads = ref<Array<Squad>>(new Array(0));
const deadSquads = computed<Array<Squad>>(() => {
	const a = squads.value.filter(s => s.alive <= 0);
	return a;
});



onMounted(async () => {
	socket.on('kill', (killerIdx: number, victimIdx: number) => {
		squads.value[victimIdx].kill();
		squads.value[killerIdx].points += 1;
		squads.value.sort((a, b) => b.points - a.points);
	})

	socket.on('get-kills-table-res', table => {
		squads.value = table.map((s:Squad) => {
			let a = new Squad(s.squadName, s.img);
			a.alive = s.alive;
			a.points = s.points;
			return a;
		});
	});
	socket.emit('get-kills-table');
});

onUnmounted(() => {
	socket.off('kill');
	socket.off('unkill');
	socket.off('get-kills-table-res');
});
</script>

<template>
<div class="whole-page">
	<section id="kill-section">
		<div class="header">
			<img :src="banner" alt="">
		</div>
		<div class="teams">
			<div :class="['team', squad.alive <= 0 ? 'display-none' : '']" 
				v-for="(squad, index) in squads" :key="index"
			>
				<div class="rank">#{{index + 1}}</div>
				<div :class="['name-img']">
					<div class="img-container"><img :src="squad.img" alt=""></div>
					<div class="squad-name">{{squad.squadName}}</div>
				</div>
				<div class="points">{{squad.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= squad.alive) ? 'alive' : '']"></div>
				</div>
			</div>

			<div class="team eliminated" v-for="(squad, index) in deadSquads" :key="index">
				<div class="rank">#{{index + 1}}</div>
				<div class='name-img'>
					<div class="img-container"><img :src="squad.img" alt=""></div>
					<div class="squad-name">{{squad.squadName}}</div>
				</div>
				<div class="points">{{squad.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= squad.alive) ? 'alive' : '']"></div>
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

.display-none{
	display: none !important;
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
	border-left: 5px solid yellow;
}

.name-img{
	background-color: rgb(255, 255, 255);
	display: flex;
	flex-direction: row;
	width: 7rem;
	padding: 0.2rem;
}

.eliminated{
	opacity: 0.5;
	transition: 0.5s all;
}

.header {
	width: 100%;
	height: 5rem;
	background-color: rgb(20, 20, 20);
}

.header img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
	
.teams{
	width: 100%;
	height: calc(40rem - 5rem);
	display: flex;
	flex-direction: column;
	overflow: auto;
	background: linear-gradient(to right, rgb(27, 27, 27), rgb(0, 0, 0));
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
	width: 2rem;
	margin-left: 0.2rem;
	color: yellow;
}

.squad-name{
	width: 30%;
	margin-left: 0.5rem;
	color: black;
	font-size: 1.2rem;
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
	background-color: rgb(242, 255, 0);
	border: none;
}
</style>

