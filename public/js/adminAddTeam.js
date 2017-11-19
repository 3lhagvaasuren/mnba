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
var teamBio = document.getElementById("team-bio");

const database = firebase.database();
var pictureURL = '';

// GETTING CURRENT YEAR FROM LAMBORARI-BASE
const currentYearRef = firebase.database().ref("lamborari/currentYear/");
var currentYear = "mnba";
currentYearRef.once("value", function(snapshot){
	currentYear += snapshot.val();
	fileButton.disabled = false;
});


fileButton.addEventListener("change", function(event){
	var file = event.target.files[0];
	var storageRef = firebase.storage().ref("teams/" + file.name);
	var task = storageRef.put(file);
	task.on("state_changed", function(){
		var storageRef = firebase.storage().ref("teams/" + file.name);
		storageRef.getDownloadURL().then(function(url) {
			pictureURL = url;
		  	img.src = url;
		  	submit.disabled = false;
		}).catch(function(err) {
		  	console.log(err);
		});
	});
});

submit.addEventListener("click", function(){
	// ALLOCATING DATA
	data = {
		teamFullName: teamFullName.value,
		teamName: teamName.value,
		teamWeb: teamWeb.value,
		teamDebut: teamDebut.value,
		img: pictureURL,
		teamBio: teamBio.value,
		teamWin: 0,
		teamLose: 0,
		numberOfPlayers: 0,
		stats: {
			points3: {success: 0, total: 0},
			points2: {success: 0, total: 0},
			points1: {success: 0, total: 0},
			assists: 0,
			blocks: 0,
			rebounds: {offensive: 0, deffensive: 0},
			turnovers: 0,
			steals: 0,
			plusMinus: 0,
			win: 0,
			lose: 0
		}
	}
  	var updates = {};
  	updates[currentYear + '/teams/' + teamName.value] = data;
  	firebase.database().ref().update(updates).then(function(){
  		teamFullName.value = '';
  		teamName.value = '';
  		teamWeb.value = '';
  		teamDebut.value = '';
  		teamBio.value = '';
  	});
  	firebase.database().ref("mnba/teams/" + teamName.value).set(data);
});