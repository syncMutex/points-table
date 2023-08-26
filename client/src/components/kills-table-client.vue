<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { socket } from "../socket.ts";
import logo from "../assets/logo-2.png";
import video from "../assets/kill-table-video.mp4";

class Squad {
	img: any;
	squadName: string;
	points: number = 0;
	alive: number = 4;
	rank: number = 0;

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
	let i = 1;
	const a = squads.value.filter((s) => {
		if(s.alive > 0) {
			s.rank = i;
			i++;
		}
		return s.alive <= 0;
	});
	return a;
});
const eliminated = ref({rank: -1, squadName: '', kills: -1, img: null});
const isShow = ref(false);
const showDeadIdx = ref(new Set<number>());

function showEliminated(s: { rank: number, squadName: string, kills: number, img: any }) {
	eliminated.value = s;
	isShow.value = true;
	setTimeout(() => {
		isShow.value = false;
		setTimeout(() => {
			eliminated.value = {rank: -1, squadName: '', kills: -1, img: null};
		}, 500);
	}, 5000);
}

onMounted(async () => {
	socket.on('get-kills-table-res', table => {
		squads.value = table.map((s:Squad) => {
			let a = new Squad(s.squadName, s.img);
			a.alive = s.alive;
			a.points = s.points;
			return a;
		});
		eliminated.value = {rank: 12, squadName: 'JEEVAN BRO', kills: 99, img: squads.value[0]?.img || ''};
	})

	socket.emit('get-kills-table');

	socket.on('eliminated', (rank: number, squadName: string, kills: number) => {
		let img: any = null;
		for(let i = 0; i < squads.value.length; i++) {
			if(squadName === squads.value[i].squadName) {
				img = squads.value[i].img;
			}
		}
		showEliminated({rank, squadName, kills, img});
	});

	socket.on("set-alive", (squadName: string, count: number) => {
		for(let sq of squads.value) {
			if(sq.squadName === squadName) {
				sq.alive = count;
				if(count === 0) {
					let img: any = null;
					let kills: any = null;
					for(let i = 0; i < squads.value.length; i++) {
						if(squadName === squads.value[i].squadName) {
							img = squads.value[i].img;
							kills = squads.value[i].points;
						}
					}
					showEliminated({rank: squads.value.length - deadSquads.value.length + 1, squadName, kills, img});
				}
				break;
			}
		}
	})

	socket.on("set-points", (squadName: string, count: number) => {
		for(let sq of squads.value) {
			if(sq.squadName === squadName) {
				sq.points = count;
				break;
			}
		}
		squads.value.sort((a, b) => b.points - a.points);
	})
});

onUnmounted(() => {
	socket.off('get-kills-table-res');
	socket.off('eliminated');
	socket.off("kill");
	socket.off("set-alive");
	socket.off("set-points");
})
</script>

<template>
<div class="whole-page">
	<section id="kill-section">
		<div class="header">
			<video autoplay loop muted>
				<source :src="video" type="video/mp4">
				Your browser does not support the video tag.
			</video>
		</div>
		<div class="teams">
			<div 
				:class="['team', squad.alive <= 0 ? 'display-none' : '']" 
				v-for="(squad, index) in squads" :key="index"
			>
				<div class="rank">#{{squad.rank}}</div>
				<div :class="['name-img', showDeadIdx.has(index) ? 'show-dead' : '']">
					<div class="img-container"><img :src="squad.img" alt=""></div>
					<div class="squad-name">{{squad.squadName}}</div>
				</div>
				<div class="points">{{squad.points}}</div>
				<div class="alive-states">
					<div v-for="i in 4" :class="['dead-box', (i <= squad.alive) ? 'alive' : '']"></div>
				</div>
			</div>

			<div class="team eliminated" v-for="(squad, index) in deadSquads" :key="index">
				<div class="rank">#{{index + 1 + squads.length - deadSquads.length}}</div>
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

	<div>
		<div class="eliminated-box">
			<div :class="['eliminated-container', isShow ? 'show' : '']">
				<div class="el-name-img">
					<div class="img"><img :src="eliminated.img || ''" alt=""/></div>
					<div class="finished-on">
						<div class="erank">
							FINISHED ON <span style="color: yellow; font-size: 2rem;">#{{ eliminated.rank }}</span>
						</div>
						<div class="esquad-name">{{ eliminated.squadName }}</div>
					</div>
				</div>
				<div class="finishes-logo">
					<div class="kills">TOTAL FINISHES {{ eliminated.kills }}</div>
					<div class="logo"><img :src="logo" alt=""></div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style scoped>
.show-dead{
	background-color: red !important;
}

.show-dead > *{
	color: white !important;
}

.eliminated-container > div{
	display: flex;
	flex-direction: row;
}

.el-name-img{
	width: 100%;
	height: 60%;
	background-color: red;
}

.el-name-img .img{
	width: 9rem;
	height: 100%;
	background-color: rgb(255, 255, 255);
}

.el-name-img .img img{
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.finished-on{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: rgb(30, 30, 30);
	color: white;
	width: 100%;
}

.finishes-logo{
	background-color: red;
	color: white;
	height: 40%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.finishes-logo > div{
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
}

.finishes-logo > .logo{
	width: 50%;
	background-color: rgb(28, 28, 28);
	padding: 0.5rem;
}

.finishes-logo > .logo img{
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.finished-on > div{
	font-size: 2rem;
}

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
	width: 100%;
	height: 100%;
	position: relative;
}

#kill-section{
	width: 16rem;
	height: 90%;
	position: relative;
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
	transition: 0.5s all;
}

.name-img > *{
	transition: 0.5s all;
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

.header > * {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
	
.teams{
	width: 100%;
	height: calc(100% - 5rem);
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
	padding: 0.3rem;
}

.selected-team .team .squad-name{
	color: white;
}

.highlight{
	background-color: blue;
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
	background-color: red; 
}

.control-btns button:disabled{
	pointer-events: none;
	background-color: grey; 
}

.eliminated-box{
	width: 22rem;
	height: 10rem;
	background-color: rgb(0, 255, 0);
	margin: 2rem 0 0 3rem;
	border: 2px solid rgb(0, 255, 0);
}

.eliminated-container{
	background-color: black;
	width: 100%;
	height: 100%;
	color: white;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 0.3s;
}

.reset-btn{
	position: fixed;
	top: 0;
	right: 0;
}

.eliminated-container.show{
	opacity: 1;
}
</style>
