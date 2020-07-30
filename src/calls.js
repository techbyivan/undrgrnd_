import { requestOptions } from "./initialfetch.js";

export async function checkRepeatingArtist(json, seedartists) {
	let nonrepeats = [];
	for (var i = 0; i < json.tracks.length; i++) {
		//repeat sees if any of your suggested artists are actually one of your top 5 artists already
		//the complicated "tracks"/"artists" thing is how i accessed a certain element due to the organization of spotify's array
		const repeat = seedartists.includes(json.tracks[i].artists[0].id);
		//double sees if our array of non-repeated artists (non repeats) already contains your artist.
		const double = nonrepeats.includes(json.tracks[i].artists[0].id);
		// if it meets both of these criteria, it appends it.
		if (repeat == false && double == false) {
			nonrepeats.push(json.tracks[i].artists[0].id);
		}
	}
	return nonrepeats;
}
export async function checkPopularity(norepeat) {
	let unpop = [];
	for (var i = 0; i < norepeat.length; i++) {
		//this loads the spotify artist api and looks up the artist with that id.
		const response1 = await fetch(
			`https://api.spotify.com/v1/artists/${norepeat[i]}`,
			requestOptions
		);
		// console.log(response1)
		const asJson1 = await response1.json();
		//this is number of followers for that artist.
		const followers = asJson1.followers.total;
		// console.log(followers)
		//if the followers are lower than 250k (can be changed), we push it to the unpop array which is returned
		if (followers < 50000) {
			unpop.push(asJson1.id);
		}
	}
	return unpop;
}

export async function checkIfUserFollows(idarray) {
	let new_artists = [];
	for (var i = 0; i < idarray.length; i++) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${idarray[i]}`,
			requestOptions
		);
		const asJson = await response.json();

		if (asJson[0] === false) {
			new_artists.push(idarray[i]);
		}
	}

	return new_artists;
}

export async function generateArtistImages(checkpop) {
	//creates a div where everything will be pushed
	const div = document.getElementsByClassName("container");
	console.log(div[0]);

	//creates a div with an error message if no artists are returned
	if (checkpop.length === 0) {
		const errormsg = document.createElement("div");
		errormsg.innerHTML =
			"We are having a bit of trouble processing your data. Please use our manual search bar instead!";
		div[0].append(errormsg);
	}

	//creates a header with "your artists are"
	let header = document.getElementsByClassName("header");
	let headertext = document.createElement("h2");
	headertext.innerHTML =
		"<p id = 'headText'>Meet Your<br> <ug>UNDR<br>GRND</ug> <br>Artists:</p>";
	console.log(header[0]);
	header[0].append(headertext);

	// let element = document.getElementsByClassName("spinner");
	// element[0].children[0].innerHTML = ""
	// element[0].parentNode.removeChild(element)
	//iterates through all artists that meet criteria and creates a div with their info
	//it does this by calling the artist data api and uses their id number from check pop.
	//if you'd like to have like 5 people instead of 20, simply change checkpop.length. It might error out if there are too few artists.
	for (var i = 0; i < checkpop.length; i++) {
		const profile = document.createElement("div");
		profile.classList.add("profile");
		let artistId = checkpop[i];
		const response1 = await fetch(
			`https://api.spotify.com/v1/artists/${artistId}`,
			requestOptions
		);
		const asJson1 = await response1.json();

		let image = "no image loaded";
		if (asJson1.images.length === 0) {
			const profpic = document.createElement("img");
			profpic.setAttribute("src", "./images/no_photo.png");
			profpic.classList.add("ug-replace");
			image = profpic;
		}

		if (asJson1.images.length > 1) {
			const picUrl = asJson1.images[0].url;
			const profpic = document.createElement("img");
			profpic.setAttribute("src", picUrl);
			profpic.classList.add("artist-pic");
			image = profpic;
		}

		const name = document.createElement("div");
		name.classList.add("front");
		name.innerText = `${asJson1.name}`;
		name.append(image);

		const back = document.createElement("div");
		back.classList.add("back", "hidden");
		let pageLink = `https://open.spotify.com/artist/${artistId}`;
		let qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${pageLink}&size=150x150`;
		let qrImage = "N/A";

		const qrcode = document.createElement("img");
		qrcode.setAttribute("src", qrLink);
		qrcode.classList.add("qr-Code");
		qrImage = qrcode;

		const followers_in_thousands =
			Math.ceil(asJson1.followers.total / 100) / 10;
		back.innerHTML = `Followers: ${followers_in_thousands}K`;
		back.append(qrImage);
		profile.append(name, back);

		div[0].append(profile);
	}
}

// #107
// const name = document.createElement("div");
// name.classList.add("front");
// name.innerText = `${asJson1.name}`;
// name.append(image);

// const back = document.createElement("div");
// back.classList.add("back", "hidden");

// const followers_in_thousands = Math.round(asJson1.followers.total / 1000);
// back.innerHTML = `${asJson1.name}'s Follower Total: ${followers_in_thousands}K`;

// profile.append(name, back);

// div[0].append(profile);
// }
