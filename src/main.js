import authenticate from "./auth.js";
// import getTopArtist from "./calls.js";
import { getSimiliarArtist, getTopArtist } from "./getArtists.js";
let root = document.querySelector("#content");

let token = localStorage.getItem("access_token");
let expires_on = localStorage.getItem("expires_on"); //expires on is when the token expires as a timestamp

if (
	!token ||
	token === "undefined" ||
	expires_on === "NaN" ||
	Number(expires_on) < new Date().getTime()
) {
	let loginButton = document.createElement("button");
	loginButton.innerHTML = "Click Here to Login into Spotify";
	loginButton.addEventListener("click", authenticate);
	root.append(loginButton);
} else {
	function printUserInfo(json) {
		let name = document.getElementsByClassName("name");
		let userinfo = document.createElement("h1");
		userinfo.innerHTML = `Welcome to UNDR GRND, <br> ${json.display_name}!`;
		console.log(userinfo);
		name[0].append(userinfo);
	}
	//Here you can start you app with fetch and all that using the token etc
	fetch(`https://api.spotify.com/v1/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((resp) => resp.json())
		.then((json) => printUserInfo(json))
		.catch((error) => console.log(error));
}
