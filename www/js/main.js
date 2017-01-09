/*
 * Application entry point
 */

var main = function() {
	// Vue.JS initialization
	var app = new Vue({
		el: "#app",
		data: {
			loaded: false, // True if application is loaded
			satellites: Satellites, // List of satellite data
			error: null, // Fatal error
			selectedSat: null, // Gets a value when a satellite is selected
			localization: null, // Gets a value when GPS data is available
			result: null, // Gets a value when the calculations are complete
			compass: null, // Phone orientation, initialized after geting results
		}
	});

	// Check if the required features are available
	if(!navigator.geolocation) {
		app.$data.error = "Geolocation API is not available";
		return;
	}

	window.addEventListener("batterystatus", function(b) {
		document.getElementById("battery").innerHTML = b.level + "%";
	}, false);

	// Wait for the application to be fully loaded beforque
	// querying DOM elements
	setTimeout(function() {
		// When the selector changes, trigger a call to process()
		el("#sat-select").addEventListener("change", function() {
			process(app);
		});
	}, 100);

	// Hide loader and show application
	app.$data.loaded = true;

	el("#app").style.display = "block";
	el("#loading").style.display = "none";
};

// Retreives the satllite from the selector, query
// GPS data and setup the callback for the calculations
var process = function(app) {
	var index = el("#sat-select").selectedIndex - 1;
	if(index < 0 || index > Satellites.length) {
		return;
	}

	app.$data.selectedSat = Satellites[index]; // Set the selected satellite
	app.$data.localization = null; // Set or reset the localization
	app.$data.result = null; // Set or reset the result

	// Query GPS data
	navigator.geolocation.getCurrentPosition(function(loc) {
		navigator.vibrate(200);

		app.$data.localization = {
			lat: Math.floor(loc.coords.latitude * 1000) / 1000,
			lng: Math.floor(loc.coords.longitude * 1000) / 1000,
		};

		calculate(app);
	}, function(error) {
		app.$data.error = error.message;
	});
};

// Calculate the azimuth and elevation based on GPS
// data and selected satellite
var calculate = function(app) {
	var loc = app.$data.localization;
	var satLng = app.$data.selectedSat.longitude;

	app.$data.result = computeDishData(loc.lat, loc.lng, satLng);

	if(!navigator.compass) {
		return;
	}

	// Heading: compass (azimuth)
	navigator.compass.watchHeading(function(h) {
		heading(app, h);
	}, function(err) {
		console.log(err);
	});

	// Device orientation: vertical angle (elevation)
	window.addEventListener('deviceorientation', function(o) {
		var v = Math.floor(o.beta * 1000) / 1000;
		if(v != 0)
			app.$data.compass.el = v;
	});
};

// Display the phone's compass information
var heading = function(app, h) {
	app.$data.compass = {
		az: Math.floor(h.magneticHeading * 1000) / 1000,
		el: 0
	};
};

//document.addEventListener("DOMContentLoaded", main, false);
document.addEventListener('deviceready', main, false);
