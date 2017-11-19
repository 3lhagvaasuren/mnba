var homeCheckboxes = document.getElementsByClassName("home-checkbox");
var guestCheckboxes = document.getElementsByClassName("guest-checkbox");
var submit = document.getELementById("submit");
var homeTeamName = document.getELementById("home-team-name").;
var guestTeamName = document.getELementById("guest-team-name");

var homeRosters = [];
var guestRosters = [];

// All homeplayers' checkboxes have class named home-checkbox
// All guestplayers' same as homeplayers'
// All checkboxes have a unique id that equals to a correspondent player's id
// All checkboxes intially have unchecked class

for (var i = 0; i < checkboxes.length; i++) {
	homeCheckboxes[i].addEventListener("click", function(){
		this.classList.toggle("homeChecked");
		this.classList.toggle("homeUnchecked");
	});
}

for (var i = 0; i < checkboxes.length; i++) {
	guestCheckboxes[i].addEventListener("click", function(){
		this.classList.toggle("guestChecked");
		this.classList.toggle("guestUnchecked");
	});
}

submit.addEventListener("click", function(){
	var checkedHomeTeamPlayers = document.getElementsByClassName("homeChecked");
	var uncheckedHomeTeamPlayers = document.getElementsByClassName("homeUnchecked");
	var checkedGeustTeamPlayers = document.getElementsByClassName("geustChecked");
	var uncheckedGeustTeamPlayers = document.getElementsByClassName("geustUnchecked");
	// Hometeam's garaanii 5
	var roster5 = 0;
	for (var i = 0; i < checkedPlayers.length; i++) {
		var id = this.getAttribute("id");
		homeRosters.push(id);
	}

});