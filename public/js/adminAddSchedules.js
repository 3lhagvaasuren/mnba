var config = {
  apiKey: "AIzaSyCZSR8oCMkgAWA7fJciZq72QTYX9ngSVLw",
  authDomain: "debut-c0739.firebaseapp.com",
  databaseURL: "https://debut-c0739.firebaseio.com",
  projectId: "debut-c0739",
  storageBucket: "debut-c0739.appspot.com",
  messagingSenderId: "664049251212"
};
firebase.initializeApp(config);



var homeTeam = document.getElementById("home-team");
var guestTeam = document.getElementById("guest-team");
var matchDate = document.getElementById("match-date");
var matchDateCal = document.getElementById("match-date-cal");
var submit = document.getElementById("submit");
var deleteButtons = document.getElementsByClassName("delete");
var goMatchButtons = document.getElementsByClassName("go-match");


for (var i = 0; i < deleteButtons.length; i++) {
	deleteButtons[i].addEventListener("click", function(){
		var raw = this.getAttribute("id");
		var scheduleId = raw.substr(6, raw.length);
		var ref = firebase.database().ref("/matchSchedules/" + scheduleId);
		ref.remove();
		document.getElementById("schedule" + scheduleId).classList.add("hidden");
	});
}

for (var i = 0; i < goMatchButtons.length; i++) {
	goMatchButtons[i].addEventListener("click", function(){
		var raw = this.getAttribute("id");
		var scheduleId = raw.substr(8, raw.length);
		var ref = firebase.database().ref("/matchSchedules/" + scheduleId);
		ref.once("value", function(snapshot){
			var anotherRef = firebase.database().ref("/live/");
			var data = {
				homeTeamName: snapshot.val().homeTeamName,
				guestTeamName: snapshot.val().guestTeamName,
				homeTeamScore: 0,
				guestTeamScore: 0,
				date: matchDate.value,
				homeTeamQ: [0, 0, 0, 0, 0],
				guestTeamQ: [0, 0, 0, 0, 0],
				matchId: scheduleId
			}
			anotherRef.set(data);
			window.location = "/admin/add/match?homeTeamName=" + snapshot.val().homeTeamName
							+ "&guestTeamName=" + snapshot.val().guestTeamName;
		});
	});
}

submit.addEventListener("click", function(){
	var ref1 = firebase.database().ref("/mnba/teams/" + homeTeam.value);
	ref1.once("value", function(snapshot1){
		var guestTeamWL;
		var homeTeamWL = "(" + snapshot1.val().teamWin + " - " + snapshot1.val().teamLose + ")";
		var ref2 = firebase.database().ref("/mnba/teams/" + guestTeam.value);

		ref2.once("value", function(snapshot2){
			guestTeamWL = "(" + snapshot2.val().teamWin + " - " + snapshot2.val().teamLose + ")";
			const key = firebase.database().ref("/matchSchedules").push().key;
			firebase.database().ref("/matchSchedules/" + key).set({
				matchDateCal: matchDateCal.value,
				matchDate: matchDate.value,
				homeTeamFullName: snapshot1.val().teamFullName,
				guestTeamFullName: snapshot2.val().teamFullName,
				homeTeamName: homeTeam.value,
				guestTeamName: guestTeam.value,
				homeTeamWL: homeTeamWL,
				guestTeamWL: guestTeamWL
			});
			location.reload();
		});
	});
});
