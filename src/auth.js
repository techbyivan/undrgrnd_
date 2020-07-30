// /** vim: et:ts=4:sw=4:sts=4
//  * license RequireJS 2.3.6 Copyright jQuery Foundation and other contributors.
//  * Released under MIT license, https://github.com/requirejs/requirejs/blob/master/LICENSE
//  */
import { clientId, redirectLogin, redirectComplete, scope } from "./config.js";
// import getTop from
// import {topArtists,topArts} from "./main.js"
// import getSimiliarArtist from "./getArtists.js"

let canStart = false;

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get("code");

const uuid = () => {
	let dec2hex = [];
	for (let i = 0; i <= 15; i++) {
		dec2hex[i] = i.toString(16);
	}
	let uuid = "";
	for (let i = 1; i <= 36; i++) {
		if (i === 9 || i === 14 || i === 19 || i === 24) {
			uuid += "-";
		} else if (i === 15) {
			uuid += 4;
		} else if (i === 20) {
			uuid += dec2hex[(Math.random() * 4) | (0 + 8)];
		} else {
			uuid += dec2hex[(Math.random() * 16) | 0];
		}
	}
	return uuid;
};

const sha256 = (plain) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest("SHA-256", data);
};

const base64urlencode = (a) => {
	return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

const create_code_challenge = async (v) => {
	let hashed = await sha256(v);
	let base64encoded = base64urlencode(hashed);
	return base64encoded;
};
const create_verification = async (cb) => {
	let cv = uuid() + uuid() + uuid();
	create_code_challenge(cv).then((cc) => cb(cv, cc));
};

let code_challenge = localStorage.getItem("code_challenge");
let code_verifier = localStorage.getItem("code_verifier");

if (!code_challenge || !code_verifier) {
	create_verification((cv, cc) => {
		console.log(cv);
		console.log(cc);
		localStorage.setItem("code_challenge", cc);
		localStorage.setItem("code_verifier", cv);
		code_verifier = cv;
		code_challenge = cc;
		canStart = true;
	});
} else {
	canStart = true;
}

const start = () => {
	window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectLogin}&code_challenge_method=S256&code_challenge=${code_challenge}`;
};

export default () => {
	if (canStart) {
		start();
	} else {
		let trys = 0;
		const cycling = setInterval(() => {
			if (canStart) {
				start();
				calearInterval(cycling);
			} else {
				trys++;
			}
			if (trys > 6) {
				clearInterval(cycling);
				window.location = redirectComplete;
			}
		}, 1000);
	}
};

const authenticate = () => {
	fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `client_id=${clientId}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectLogin}&code_verifier=${code_verifier}`,
	})
		.then((resp) => resp.json())
		.then((json) => {
			localStorage.setItem("access_token", json.access_token);
			localStorage.setItem("refresh_token", json.refresh_token);
			localStorage.setItem(
				"expires_on",
				new Date().getTime() + json.expires_in * 1000
			); // the timestamp when it will no longer be valid
			window.location = redirectComplete;
		});
};
//if the url string is acceptLogin
if (urlParams.get("acceptLogin") && code) {
	authenticate();
	topArtists();
}
