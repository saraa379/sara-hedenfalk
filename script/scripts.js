//Author: Sarantsetseg Hedenfalk

window.addEventListener('load', function(event) {


//Changes Welcome text to name in small screen size
function myFunction(welcomeText) {
    if (welcomeText.matches) { // If media query matches
        document.getElementsByClassName("welcome")[0].innerHTML = "Sara";
        //document.getElementsByClassName("welcome")[0].style.fontStyle = "Open Sans";
    } else {
    	document.getElementsByClassName("welcome")[0].innerHTML = "Welcome!";
    }
}
var welcomeText = window.matchMedia("(max-width: 450px)")
myFunction(welcomeText) // Call listener function at run time
welcomeText.addListener(myFunction) // Attach listener function on state changes


	


}); //windows.load


	

