var express    	= require('express'),
	bodyParser 	= require('body-parser'), 
	app 	   	= express(),
	morgan		= require('morgan'),
	admin		= require('firebase-admin');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.set('view engine', 'ejs');


//===================================
//		FIREBASE SETUP
//===================================
var serviceAccount = require("./debut-c0739-firebase-adminsdk-gksgt-56ed75bd50.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://debut-c0739.firebaseio.com"
});
var db = admin.database();
var currentYear = "/mnba";
db.ref("/lamborari/currentYear").once("value", function(snapshot){
	currentYear += snapshot.val();
});




app.get("/admin", function(req, res){
	res.render("admin");
});

app.get("/admin/add/team", function(req, res){
	res.render("adminAddTeam");
})

app.get("/admin/add/player", function(req, res){
	var ref = db.ref(currentYear + "/teams/");
	ref.once("value", function(snapshot){
		res.render("adminAddPlayer", {teams: snapshot.val()});
	});
});

app.get("/admin/add/schedules", function(req, res){
	var ref = db.ref("/matchSchedules");
	ref.once("value", function(snapshot){
		var anotherRef = db.ref("/mnba/teams").orderByChild("matchDateCal");
		anotherRef.once("value", function(snapshot1){
			res.render("adminAddSchedules", {schedules: snapshot.val(), teams: snapshot1.val()});
		});
	});
});

app.get("/admin/add/match", function(req, res){
	var homeTeamName = req.query.homeTeamName;
	var guestTeamName = req.query.guestTeamName;
	var ref1 = db.ref("/mnba/teams/" + homeTeamName + "/teamPlayers").orderByChild("playerIndex");
	ref1.once("value", function(snapshot1){
		var ref2 = db.ref("/mnba/teams/" + guestTeamName + "/teamPlayers").orderByChild("playerIndex");
		ref2.once("value", function(snapshot2){
			res.render("adminAddMatch", {
				homeTeamPlayers: snapshot1.val(), 
				guestTeamPlayers: snapshot2.val()
			});
		});
	});
});

app.get("/admin/add/match/rosters", function(req, res){
	var guestTeamName = req.query.guestTeamName;
	var homeTeamName = req.query.homeTeamName;
	var homeRosters = req.query.homeRosters;
	var guestRosters = req.query.guestRosters;
	var homeTeamPlayers = [];
	var guestTeamPlayers = [];
	var homeOnStage = [];
	var guestOnStage = [];
	var ref1 = db.ref(currentYear + "/teams/" + homeTeamName + "/teamPlayers");
	// PREPARING HOME TEAM'S PREGAME DATA
	ref1.once("value", function(snapshot1){
		var tmp = snapshot1.val();
		var keys = Object.keys(tmp);
		for (var i = 0; i < keys.length; i++) {
			if (i < 5) {
				homeOnStage[i] = homeRosters[i];
				tmp[ keys[i] ].gp = 1;
			} else {
				homeOnStage[i] = i;
			}
			homeTeamPlayers.push(tmp[ keys[i] ]);
		}
		}).then(function(){
			// PREPARING GUEST TEAM'S PREGAME DATA
			var ref2 = db.ref(currentYear + "/teams/" + guestTeamName + "/teamPlayers");
			ref2.once("value", function(snapshot2){
				var tmp = snapshot2.val();
				var keys = Object.keys(tmp);
			for (var i = 0; i < keys.length; i++) {
				if (i < 5) {
					guestOnStage[i] = guestRosters[i];
					tmp[ key[i] ].gp = 1;
				} else {
					guestOnStage[i] = i;
				}
				guestTeamPlayers.push(tmp[ keys[i] ]);
			}
		}).then(function(){
			// MAIN BEGINS HERE
			var updates = {};
			updates["/live/homeTeamPlayers"] = homeTeamPlayers;
			updates["/live/guestTeamPlayers"] = guestTeamPlayers;
			updates["/live/homeOnStage"] = homeOnStage;
			updates["/live/guestOnStage"] = guestOnStage;
			db.ref().update(updates);
			res.render("match", {
				homeTeamPlayers: homeTeamPlayers,
				guestTeamPlayers: guestTeamPlayers
			});
		});
	});
});

app.get("/admin/teams", function(req, res){
	var ref = db.ref(currentYear + "/teams/");
	ref.once("value", function(snapshot){
		res.render("adminTeams", {teams: snapshot.val()});
	});
});

app.get("/admin/players", function(req, res){
	var ref = db.ref(currentYear + "/players/");
	ref.once("value", function(snapshot){
		res.render("adminPlayers", {players: snapshot.val()});
	})
});

app.get("/admin/players/index", function(req, res){
	var ref = db.ref("/mnba/teams/");
	ref.once("value", function(snapshot){
		res.render("adminPlayersIndex", {teams: snapshot.val()});
	});
});

app.get("/admin/players/transfer", function(req, res){
	var ref = db.ref("/mnba/teams/");
	ref.once("value", function(snapshot){
		res.render("adminPlayersTransfer", {teams: snapshot.val()});
	});
});

app.get("/admin/players/transfer/:team", function(req, res){
	var ref = db.ref("/mnba/teams/" + req.params.team + "/teamPlayers");
	ref.once("value", function(snapshot){
		if (snapshot.val() == null) {
			res.send("There is no players in this team");
		}
		res.render("adminPlayersTransferTeam", {players: snapshot.val()});
	});
});

app.get("/admin/players/transfer/:team/:player", function(req, res){
	var ref = db.ref("/mnba/teams/" + req.params.team + "/teamPlayers/" + req.params.player);
	ref.once("value", function(snapshot){
		if (snapshot.val() == null) {
			res.redirect("/admin/players/transfer");
		}
		var anotherRef = db.ref("/mnba/teams");
		anotherRef.once("value", function(snap){
			res.render("adminPlayersTransferTeamPlayer", {
				player: snapshot.val(), 
				team: req.params.team, 
				teams: snap.val()
			});
		});
	});
});

app.get("/admin/edit/team/:id", function(req, res){
	var id = req.params.id;
	res.render("adminEditTeamId", {id: id});
});

app.get("/admin/edit/schedule/:id", function(req, res){
	var ref = db.ref("/matchSchedules/" + req.params.id);
	ref.once("value", function(snapshot){
		var anotherRef = db.ref("/mnba/teams");
		anotherRef.once("value", function(snapshot1){
			res.render("adminEditScheduleId", {schedule: snapshot.val(), teams: snapshot1.val()});
		});
	});
});

app.get("/admin/edit/player/:id", function(req, res){
	var id = req.params.id;
	var ref = db.ref(currentYear + "/teams/");
	ref.once("value", function(snapshot){
		res.render("adminEditPlayerId", {teams: snapshot.val(), id: id});
	});
});

app.get("/admin/edit/players/index/:team", function(req, res){
	var teamName = req.params.team;
	var ref = db.ref(currentYear + "/teams/" + teamName + "/teamPlayers/").orderByChild("playerIndex");
	ref.once("value", function(snapshot){
		res.render("adminEditPlayersIndexId", {team: teamName, teamPlayers: snapshot.val(), currentYear: currentYear});
	});
});







app.listen(8000, function(){
	console.log('THE BOMB HAS BEEN PLANTED!!');
});