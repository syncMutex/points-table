import { io } from 'socket.io-client';

export let socket = io('http://localhost:5000', {});