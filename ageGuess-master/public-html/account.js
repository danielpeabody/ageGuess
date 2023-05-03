// Get the value of the "myCookie" cookie
var myCookie = getCookie("user");
if(myCookie == undefined){
myCookie = "No User Logged In"
}

// Insert the cookie value into the HTML of the page
document.getElementById("username").innerHTML = "Username: " + myCookie;

// Helper function to get a cookie value by name
function getCookie(name) {
var value = document.cookie;
var parts = value.replace("%"," ").replace("="," ").split(" ");
return parts[1]
}
window.onload = function(){
fetch('/get/account')
.then(function(response){
response.json().then(function(data){
document.getElementById("celebscore").innerHTML = "Celebrity Highscore: " + data.topCelebScore;
document.getElementById("athletescore").innerHTML = "Athlete Highscore: " + data.topCelebScore;
document.getElementById("comunscore").innerHTML = "Coummunity Highscore: " + data.topCelebScore;
})
}
)
}