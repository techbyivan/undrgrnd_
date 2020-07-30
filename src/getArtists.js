import { requestOptions } from "./initialfetch.js";
import {
	checkRepeatingArtist,
	checkPopularity,
	generateArtistImages,
	checkIfUserFollows,
} from "./calls.js";

console.log("this is the correct file");
var artistId;

export async function getTopArtist() {
	const response = await fetch(
		"https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5&offset=5",
		requestOptions
	);
	const asJson = await response.json();
	console.log(asJson);
	const artistids = [
		asJson.items[0].id,
		asJson.items[1].id,
		asJson.items[2].id,
		asJson.items[3].id,
		asJson.items[4].id,
	];
	console.log(artistids);
	return artistids;
}

export async function getSimiliarArtist(seedartists) {
	const response = await fetch(
		`https://api.spotify.com/v1/recommendations?seed_artists=${seedartists[0]}%2C${seedartists[1]}%2C${seedartists[2]}%2C${seedartists[3]}%2C${seedartists[4]}&max_popularity=30&limit=100`,
		requestOptions
	);
	const asJson = await response.json();

	//runs both functions,
	checkRepeatingArtist(asJson, seedartists)
		// .then(checkIfUserFollows)
		.then(checkPopularity)
		.then(generateArtistImages)
		.then((rsp) => {
			for (var i = 0; i < allprofiles.length; i++) {
				allprofiles[i].addEventListener("click", showGoal);
			}
		});
}

export async function main() {
	const seedartists = await getTopArtist();
	const similiarArtist = await getSimiliarArtist(seedartists);
}

//this initiates all functions running
// main()

let allprofiles = document.getElementsByClassName("profile");
// console.log(allprofiles[0])

export function showGoal() {
	this.children[0].classList.toggle("hidden");
	this.children[1].classList.toggle("hidden");
}
