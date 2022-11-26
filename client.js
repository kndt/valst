"use strict";

const readline = require("readline");
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let query = '';

const triggerPrompt = () => {
	rl.question("What character would you like to search for? ", term => {
		query = term;
		socket.emit('search', {query: term});
		console.log(`Searching for ${term}...`);
	});
};

socket.on('search', message => {
	if (message.error) {
		console.log(`ERR: No valid matches recieved for query ${query}`);
		triggerPrompt();
	}
	else {
		const { page, resultCount, name, films } = message;
		console.log(`(${page}/${resultCount}) ${name} - [${films}]`);

		if (page === resultCount) {
			triggerPrompt();
		}
	}
});

socket.on('connect', () => {
	console.log('client connected');
	triggerPrompt();
});

socket.on('disconnect', () => {
	console.log('client disconnected');
});

socket.on('error', message => {
	console.log(message);
});
