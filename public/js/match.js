var players = document.querySelectorAll(".player");
var halfs	= document.querySelectorAll(".half");
var pts1 = $(".pts1"),
	pts2 = $(".pts2"), 
	pts3 = $(".pts3"),
	ast  = $(".ast"),
	blk  = $(".blk"),
	reb  = $(".reb"),
	stl  = $(".stl");
var playerToDisplay = $("#current-player");
var cmdToDisplay = $("#current-cmd");
var currentFlagToDisplay = $("#current-flag");
var homeScoreBoard = $("#home-team-score");
var guestScoreBoard = $("#guest-team-score");
var body = $("body");
var currentCmd = -1;
var currentPlayer;
var currentKeypress = -1;
var homeScore = 0;
var guestScore = 0;
var raw = [];

var homeTeamPlayers = [], guestTeamPlayers = [];
var homeOnStage = [];	// homeTeamPlayers
var guestOnStage = [];

var config = {
  apiKey: "AIzaSyCZSR8oCMkgAWA7fJciZq72QTYX9ngSVLw",
  authDomain: "debut-c0739.firebaseapp.com",
  databaseURL: "https://debut-c0739.firebaseio.com",
  projectId: "debut-c0739",
  storageBucket: "debut-c0739.appspot.com",
  messagingSenderId: "664049251212"
};
firebase.initializeApp(config);

var ref1 = firebase.database().ref("/live");
ref1.once("value", function(snapshot1){
	homeTeamPlayers = snapshot1.val().homeTeamPlayers;
	homeOnStage = snapshot1.val().homeOnStage;
	guestTeamPlayers = snapshot1.val().guestTeamPlayers;
	guestOnStage = snapshot1.val().guestOnStage;

});


// (S) adding event listeners

	// adding EL to players
for (var i = 0; i < 10; i++) {
	players[i].addEventListener("click", function(){
		currentPlayer = this.getAttribute("id");
		playerToDisplay.attr("src", this.getAttribute("src"));
	});
}

	// adding EL to cmd
for (var i = 0; i < 4; i++) {
	halfs[i].addEventListener("click", function(){
		currentCmd = this.getAttribute("id");
		cmdToDisplay.attr("class", "btn btn-warning btn-lg btn-xl btn-width");
		cmdToDisplay.text(this.textContent);
	});
}

pts1.click(function(){
	currentCmd = "pts1";
	cmdToDisplay.attr("class", "btn btn-success btn-lg btn-xl btn-width");
	cmdToDisplay.text("PTS1");
});

pts2.click(function(){
	currentCmd = "pts2";
	cmdToDisplay.attr("class", "btn btn-success btn-lg btn-xl btn-width");
	cmdToDisplay.text("PTS2");
});

pts3.click(function(){
	currentCmd = "pts3";
	cmdToDisplay.attr("class", "btn btn-success btn-lg btn-xl btn-width");
	cmdToDisplay.text("PTS3");
});

ast.click(function(){
	currentCmd = "ast";
	cmdToDisplay.attr("class", "btn btn-primary btn-lg btn-xl btn-width");
	cmdToDisplay.text("AST");
});

blk.click(function(){
	currentCmd = "blk";
	cmdToDisplay.attr("class", "btn btn-warning btn-lg btn-xl btn-width");
	cmdToDisplay.text("BLK");
});

reb.click(function(){
	currentCmd = "reb";
	cmdToDisplay.attr("class", "btn btn-primary btn-lg btn-xl btn-width");
	cmdToDisplay.text("REB");
});

stl.click(function(){
	currentCmd = "stl";
	cmdToDisplay.attr("class", "btn btn-danger btn-lg btn-xl btn-width");
	cmdToDisplay.text("STL");
});

body.keypress(function(event){
	if (event.which == 122) {
		currentKeypress = 1;  		// Z
		compute();
	} 
	if (event.which == 120) { 	// X
		currentKeypress = 0;
		compute();
	}
	if (event.which == 115) { 	// S
		var teamName = prompt("Сэлгээ хийх багийг сонгоно уу. Home бол 0, Guest бол 1");
		var s1 = prompt("Талбайгаас гаргах хүний дугаарыг оруулна уу: ");
		var s2 = prompt("Талбайд оруулах хүний дугаарыг оруулна уу: ");
		var indexi, indexj;
		if (teamName == 0) {	// if teamName == home
			for (var i = 0; i < homeTeamPlayers.length; i++) {
				if (homeTeamPlayers[i].playerNumber == s1) {
					for (var j = 0; j < homeTeamPlayers.length; j++) {
						if (homeTeamPlayers[j].playerNumber == s2) {
							indexi = i;
							indexj = j;
							var tmp = homeTeamPlayers[i];
							var id = "#h" + i;
							$(id).attr("src", homeTeamPlayers[j].img);
							homeTeamPlayers[i] = homeTeamPlayers[j];
							homeTeamPlayers[j] = tmp;
							tmp = homeOnStage[i];
							homeOnStage[i] = homeOnStage[j];
							homeOnStage[j] = tmp;
							i = homeTeamPlayers.length + 100;
							var updates = {};
							updates["/live/homeOnStage"] = homeOnStage;
							updates["/live/homeTeamPlayers"] = homeTeamPlayers;
							updates["/live/homeTeamPlayers/" + i].gp = 1;
							firebase.database().ref().update(updates);
							break;
						}
					}
				}
			}
		} 
		if (teamName == 1) {
			for (var i = 0; i < guestTeamPlayers.length; i++) {
				if (guestTeamPlayers[i].playerNumber == s1) {
					for (var j = 0; j < guestTeamPlayers.length; j++) {
						if (guestTeamPlayers[j].playerNumber == s2) {
							indexi = i;
							indexj = j;
							var tmp = guestTeamPlayers[i];
							var id = "#g" + i;
							$(id).attr("src", guestTeamPlayers[j].img);							
							guestTeamPlayers[i] = guestTeamPlayers[j];
							guestTeamPlayers[j] = tmp;
							tmp = guestOnStage[i];
							guestOnStage[i] = guestOnStage[j];
							guestOnStage[j] = tmp;
							i = guestTeamPlayers.length + 100;
							var updates = {};
							updates["/live/guestOnStage"] = guestOnStage;
							updates["/live/guestTeamPlayers"] = guestTeamPlayers;
							updates["/live/guestTeamPlayers/" + i].gp = 1;
							firebase.database().ref().update(updates);
							break;
						}
					}
				}
			}
		}
	}
});



function compute(){
	var currentPlayerId;
	var rawSub = {};
	if (currentPlayer[0] == 'h') {
		currentPlayerId = homeTeamPlayers[ currentPlayer[1] ]._id;
		rawSub["team"] = 'h';
		rawSub["playerIndex"] = homeOnStage[ currentPlayer[1] ];
	}  
	if (currentPlayer[0] == 'g') {
		currentPlayerId = guestTeamPlayers[ currentPlayer[1] ]._id;
		rawSub["team"] = 'g';
		rawSub["playerIndex"] = guestOnStage[ currentPlayer[1] ];
	}
	rawSub["cmd"] = currentCmd;
	rawSub["status"] = currentKeypress;
	raw.push(rawSub);
	var updates = {};
	updates["/live/raw"] = raw;

	if (currentCmd == "pts1") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeScore++;
				homeTeamPlayers[ currentPlayer[1] ].points1.success++;
				homeTeamPlayers[ currentPlayer[1] ].points1.total++;
				homeScoreBoard.text(homeScore);
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestScore++;
				guestTeamPlayers[ currentPlayer[1] ].points1.success++;
				guestTeamPlayers[ currentPlayer[1] ].points1.total++;
				guestScoreBoard.text(guestScore);
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].points1.total++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].points1.total++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		firebase.database().ref().update(updates);
		return;
	}
	if (currentCmd == "pts2") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeScore += 2;
				homeTeamPlayers[ currentPlayer[1] ].points2.success++;
				homeTeamPlayers[ currentPlayer[1] ].points2.total++;
				homeScoreBoard.text(homeScore);
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestScore += 2;
				guestTeamPlayers[ currentPlayer[1] ].points2.success++;
				guestTeamPlayers[ currentPlayer[1] ].points2.total++;
				guestScoreBoard.text(guestScore);
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].points2.total++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].points2.total++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		firebase.database().ref().update(updates);
		return;
	}
	if (currentCmd == "pts3") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeScore += 3;
				homeTeamPlayers[ currentPlayer[1] ].points3.success++;
				homeTeamPlayers[ currentPlayer[1] ].points3.total++;
				homeScoreBoard.text(homeScore);
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestScore += 3;
				guestTeamPlayers[ currentPlayer[1] ].points3.success++;
				guestTeamPlayers[ currentPlayer[1] ].points3.total++;
				guestScoreBoard.text(guestScore);
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].points3.total++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].points3.total++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		firebase.database().ref().update(updates);
		return;
	}
	if (currentCmd == "ast") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].assists++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].assists++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].assists++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].assists++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}	
		firebase.database().ref().update(updates);
		return;
	}
	if (currentCmd == "blk") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].blocks++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].blocks++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].blocks++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].blocks++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}	
		firebase.database().ref().update(updates);
		return;
	}
	if (currentCmd == "stl") {
		if (currentKeypress == 1) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].steals++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].steals++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}
		if (currentKeypress == 0) {
			if (currentPlayer[0] == 'h') {
				homeTeamPlayers[ currentPlayer[1] ].steals++;
				updates["/live/homeTeamPlayers/" + currentPlayer[1]] = homeTeamPlayers[ currentPlayer[1] ];
			} else {
				guestTeamPlayers[ currentPlayer[1] ].steals++;
				updates["/live/guestTeamPlayers/" + currentPlayer[1]] = guestTeamPlayers[ currentPlayer[1] ];
			}
		}	
		firebase.database().ref().update(updates);
		return;	
	}
}