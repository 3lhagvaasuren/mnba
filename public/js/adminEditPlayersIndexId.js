var config = {
  apiKey: "AIzaSyCZSR8oCMkgAWA7fJciZq72QTYX9ngSVLw",
  authDomain: "debut-c0739.firebaseapp.com",
  databaseURL: "https://debut-c0739.firebaseio.com",
  projectId: "debut-c0739",
  storageBucket: "debut-c0739.appspot.com",
  messagingSenderId: "664049251212"
};
firebase.initializeApp(config);


var teamName = document.getElementById("team-name").textContent;
var currentYear = document.getElementById("current-year").textContent;
var button = document.getElementById("button");
var changeIndex = document.getElementsByClassName("change-index");


for (var i = 0; i < changeIndex.length; i++) {
	changeIndex[i].addEventListener("click", function(){
		var playerId = this.getAttribute("id").substr(1, this.getAttribute("id").length);
		var newIndex = prompt("Шинэ индексийг оруулна уу");
		firebase.database().ref("/mnba/teams/" + teamName + "/teamPlayers/" + playerId + "/playerIndex").set(newIndex);
		firebase.database().ref(currentYear + "/teams/" + teamName + "/teamPlayers/" + playerId + "/playerIndex").set(newIndex);
		var indexToDisplay = document.getElementById("x" + playerId);
		indexToDisplay.textContent = newIndex;
	});
}

