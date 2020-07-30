import { requestOptions } from "./initialfetch.js";
import {
	checkRepeatingArtist,
	checkPopularity,
	generateArtistImages,
	checkIfUserFollows,
} from "./calls.js";
import { getSimiliarArtist, getTopArtist } from "./getArtists.js";

async function main() {
	console.log("main running");
	const seedartists = await getTopArtist();
	const similiarArtist = await getSimiliarArtist(seedartists);
}
main();

const form = document.getElementsByClassName("form");
const genreSearch = document.createElement("h3");
genreSearch.innerHTML = "Want more? Use our genre search!";
const genrebutton = document.createElement("button");
const linkgenresearch = document.createElement("a");
linkgenresearch.setAttribute("href", "genre.html");
linkgenresearch.innerHTML = "GENRE SEARCH";
genrebutton.append(linkgenresearch);
console.log(genreSearch);
form[0].append(genreSearch, genrebutton);
