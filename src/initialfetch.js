export var myHeaders = new Headers();
export let token = localStorage.getItem("access_token");

myHeaders.append("Authorization", `Bearer ${token}`);

export var requestOptions = {
	method: "GET",
	headers: myHeaders,
	redirect: "follow",
};
