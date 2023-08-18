import { Ref, ref } from "vue";

if(window.localStorage.getItem("host") === null) {
	window.localStorage.setItem("host", "localhost");
}

export const HOST = ref(window.localStorage.getItem("host") || "localhost");

export function changeHost(host:string) {
	HOST.value = host;
	window.localStorage.setItem("host", HOST.value);
}

export function U(url: string): string {
	return `http://${HOST.value}:5000${url}`;
}

export async function POST(url: string, body: any, msg?: Ref<any>) {
	const a = await fetch(U(url), {
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
		const res = await fetch(U(url), {
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

export async function DELETE(url: string, msg?: Ref<any>) {
	try{
		const res = await fetch(U(url), {
			method: "DELETE",
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
