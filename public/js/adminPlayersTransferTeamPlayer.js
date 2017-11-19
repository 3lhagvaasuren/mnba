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
var img = document.getElementById("img");
var playerId = document.getElementById("id").textContent;
var playerIndex = document.getElementById("player-index");

var preTeamName = '';
var database = firebase.database();
var pictureURL = '';


// GETTING PLAYER'S OLD DATA
var playerData = {};
var refPlayer = firebase.database().ref("/mnba/players/" + playerId);

// DISPLATING OLD DATA
refPlayer.once("value", function(snapshot){
  playerData = snapshot.val();
  preTeamName = playerData.playerTeamName;
  playerTeamName.value = playerData.playerTeamName;
  console.log(playerData.playerTeamName);
  playerIndex.value = playerData.playerIndex;
  playerFullName.value = playerData.playerFullName;
  playerName.value = playerData.playerName;
  playerNumber.value = playerData.playerNumber;
  playerDebut.value = playerData.playerDebut;
  playerHeight.value = playerData.playerHeight;
  playerWeight.value = playerData.playerWeight;
  playerBirthday.value = playerData.playerBirthday;
  playerPreviousTeams.value = playerData.playerPreviousTeams;
  playerBio.value = playerData.playerBio;
  img.src = playerData.img;
  pictureURL = playerData.img;
});

// UPLOADING A PROFILE PICTURE
fileButton.addEventListener("change", function(event){
  var file = event.target.files[0];
  var storageRef = firebase.storage().ref("players/" + file.name);
  var task = storageRef.put(file);
  submit.disabled = true;
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
const currentYearRef = firebase.database().ref("lamborari/currentYear/");
var currentYear = "mnba";
currentYearRef.once("value", function(snapshot){
  currentYear += snapshot.val();
  fileButton.disabled = false;
});

// SUBMITTING
submit.addEventListener("click", function(){
  // ALLOCATING DATA
  var data = {
    playerTeamName: playerTeamName.value,
    playerIndex: playerIndex.value,
    playerId: playerId,
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
    points3: playerData.points3,
    points2: playerData.points3,
    points1: playerData.points3,
    assists: playerData.assists,
    blocks: playerData.blocks,
    rebounds: playerData.rebounds,
    turnovers: playerData.turnovers,
    steals: playerData.steals,
    pf: playerData.pf,
    pfd: playerData.pfd,
    plusMinus: playerData.plusMinus,
    td3: playerData.td3,
    dd2: playerData.dd2
  }
  // GETTING KEY TO DATABASE
  const key = playerId;

  // ELIMINATING THE PLAYER FROM HIS PRE-TEAM
  firebase.database().ref("/mnba/teams/" + preTeamName + "/teamPlayers/" + key).remove();
  firebase.database().ref(currentYear + "/teams/" + preTeamName + "/teamPlayers/" + key).remove();

  // PUSHING THE PLAYER TO HIS NEW-TEAM AND UPDATING /PLAYERS
  var updates = {};
  updates[currentYear + "/teams/" + playerTeamName.value + '/teamPlayers/' + key] = data;
  updates["/mnba/teams/" + playerTeamName.value + '/teamPlayers/' + key] = data;
  updates["/mnba/players/" + key] = data;
  updates[currentYear + "/players/" + key] = data;
  firebase.database().ref().update(updates);
});