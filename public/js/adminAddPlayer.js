var config = {
  apiKey: "AIzaSyCZSR8oCMkgAWA7fJciZq72QTYX9ngSVLw",
  authDomain: "debut-c0739.firebaseapp.com",
  databaseURL: "https://debut-c0739.firebaseio.com",
  projectId: "debut-c0739",
  storageBucket: "debut-c0739.appspot.com",
  messagingSenderId: "664049251212"
};
firebase.initializeApp(config);

var playerTeamName = document.getElementById("player-team-name");
var playerFullName = document.getElementById("player-full-name");
var playerName = document.getElementById("player-name");
var playerNumber = document.getElementById("player-number");
var playerDebut = document.getElementById("player-debut");
var playerHeight = document.getElementById("player-height");
var playerWeight = document.getElementById("player-weight");
var playerBirthday = document.getElementById("player-birthday");
var playerPreviousTeams = document.getElementById("player-previuos-teams");
var playerBio = document.getElementById("player-bio");
var submit = document.getElementById("submit");
var fileButton = document.getElementById("file-button");
var playerIndex = document.getElementById("player-index");
var playerPosition = document.getElementById("player-position");

var database = firebase.database();
var pictureURL = '';
var numberOfPlayers;

playerTeamName.addEventListener("change", function(){
	var ref = firebase.database().ref("/mnba/teams/" + playerTeamName.value + "/numberOfPlayers/");
	ref.once("value", function(snapshot){
		numberOfPlayers = snapshot.val();
	});
});

fileButton.addEventListener("change", function(event){
	var file = event.target.files[0];
	var storageRef = firebase.storage().ref("players/" + file.name);
	var task = storageRef.put(file);
	task.on("state_changed", function(){
		var storageRef = firebase.storage().ref("players/" + file.name);
		storageRef.getDownloadURL().then(function(url) {
			pictureURL = url;
		  	img.src = url;
		  	submit.disabled = false;
		}).catch(function(err) {
		  	console.log(err);
		});
	});
});

// GETTING CURRENT YEAR FROM LAMBORARI-BASE
const currentYearRef = firebase.database().ref("/lamborari/currentYear/");
var currentYear = "mnba";
currentYearRef.once("value", function(snapshot){
	currentYear += snapshot.val();
	fileButton.disabled = false;
});

submit.addEventListener("click", function(){
	// GETTING KEY TO A SPECIFIC PLAYER
	const key = database.ref().push().key;
	// ALLOCATING DATA
	var data = {
		playerPosition: playerPosition.value,
		playerIndex: playerIndex.value,
		playerId: key,
		playerTeamName: playerTeamName.value,
		playerFullName: playerFullName.value,
		playerName: playerName.value,
		playerNumber: playerNumber.value,
		playerDebut: playerDebut.value,
		playerHeight: playerHeight.value,
		playerWeight: playerWeight.value,
		playerBirthday: playerBirthday.value,
		playerPreviousTeams: playerPreviousTeams.value,
		playerBio: playerBio.value,
		img: pictureURL,
		gp: 0,
		points3: {success: 0, total: 0},
		points2: {success: 0, total: 0},
		points1: {success: 0, total: 0},
		assists: 0,
		blocks: 0,
		rebounds: {deffensive: 0, offensive: 0},
		turnovers: 0,
		steals: 0,
		pf: 0,
		pfd: 0,
		plusMinus: 0,
		td3: 0,
		dd2: 0
	}

  	firebase.database().ref("/mnba/players/" + key).set(data);
  	firebase.database().ref(currentYear + "/players/" + key).set(data);

	var updates = {};
  	updates[currentYear + "/teams/" + playerTeamName.value + '/teamPlayers/' + key] = data;
  	updates["/mnba/teams/" + playerTeamName.value + '/teamPlayers/' + key] = data;
  	firebase.database().ref().update(updates).then(function(){
		var anotherRef = firebase.database().ref("/mnba/teams/" + playerTeamName.value + "/numberOfPlayers/");
		anotherRef.set(numberOfPlayers + 1);
		anotherRef = firebase.database().ref(currentYear + "/teams/" + playerTeamName.value + "/numberOfPlayers/");
		anotherRef.set(numberOfPlayers + 1);
		playerTeamName.value = '';
		playerFullName.value = '';
		playerName.value = '';
		playerNumber.value = '';
		playerDebut.value = '';
		playerHeight.value = '';
		playerWeight.value = '';
		playerBirthday.value = '';
		playerPreviousTeams.value = '';
		playerBio.value = '';
  	});
});

