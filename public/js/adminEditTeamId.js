var config = {
  apiKey: "AIzaSyCZSR8oCMkgAWA7fJciZq72QTYX9ngSVLw",
  authDomain: "debut-c0739.firebaseapp.com",
  databaseURL: "https://debut-c0739.firebaseio.com",
  projectId: "debut-c0739",
  storageBucket: "debut-c0739.appspot.com",
  messagingSenderId: "664049251212"
};
firebase.initializeApp(config);

var submit = document.getElementById("submit");
var teamFullName = document.getElementById("team-full-name");
var teamName = document.getElementById("team-name");
var teamWeb = document.getElementById("team-website");
var teamDebut = document.getElementById("team-debut");
var fileButton = document.getElementById("file-button");
var img = document.getElementById("img");
var hidden = document.getElementById("hidden").textContent;	// THERE IS A HIDDEN <p> ELEMENT STORING THE TEAM ID
var teamBio = document.getElementById("team-bio");
var teamData = {};

// DISPLAYING EXISTING DATA
var teamRef = firebase.database().ref("mnba/teams/" + hidden);
teamRef.on("value", function(snapshot){
	console.log(snapshot.val());
	teamData = snapshot.val();
	teamFullName.value = teamData.teamFullName;
	teamName.value = teamData.teamName;
	teamWeb.value = teamData.teamWeb;
	teamDebut.value = teamData.teamDebut;
	teamBio.value = teamData.teamBio;
	img.src = teamData.img;
	fileButton.disabled = false;
});

var currentYear = "/mnba";
var currentYearRef = firebase.database().ref("lamborari/currentYear");
currentYearRef.once("value", function(snapshot){
	currentYear += snapshot.val();
	submit.disabled = false;
});

// Uploading new img
var pictureURL = '';
fileButton.addEventListener("change", function(event){
	var file = event.target.files[0];
	var storageRef = firebase.storage().ref("teams/" + file.name);
	var task = storageRef.put(file);
	submit.disabled = true;
	task.on("state_changed", function(){
		storageRef.getDownloadURL().then(function(url) {
			teamData.img = url;
		  	img.src = url;
		  	submit.disabled = false;
		}).catch(function(err) {
		  	console.log(err);
		});
	});
});


// SUBMITTING AKA EDITTING
submit.addEventListener("click", function(){
  	var editedData = {
		teamFullName: teamFullName.value,
		teamName: teamName.value,
		teamWeb: teamWeb.value,
		teamDebut: teamDebut.value,
		teamBio: teamBio.value,
		img: teamData.img
  	};
  	// Updating mnba/teams/:id and mnba2017/teams/:id
  	var updates = {};
  	updates["/mnba/teams/" + hidden] = editedData;
  	updates[currentYear + "/teams/" + hidden] = editedData;
  	firebase.database().ref().update(updates);
  	alert("Багийн мэдээллийг амжилттай заслаа.");
});