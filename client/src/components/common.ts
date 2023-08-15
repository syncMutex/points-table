import { Ref } from "vue";

const SERVER_ADDR = "http://localhost:5000/api";

function makeURL(url: string): string {
	return `${SERVER_ADDR}${url}`;
}

export async function POST(url: string, body: any, msg?: Ref<any>) {
	const a = await fetch(makeURL(url), {
		method: "POST",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify(body)
	});
	if(msg) {
		msg.value = JSON.stringify(await a.json());
	}
}

export async function GET(url: string, msg?: Ref<any>) {
	try{
		const res = await fetch(makeURL(url), {
			method: "GET",
			headers: { 'Content-Type': "application/json" }
		});
		const data = await res.json();
		return data;
	} catch(e) {
		if(msg) {
			msg.value = `${e}`;	
		}
		return null;
	}
}
