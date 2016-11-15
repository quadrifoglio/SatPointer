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
		}
	});

	// Check if the required features are available
	if(!navigator.geolocation) {
		app.$data.error = "Geolocation API is not available";
		return;
	}

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
	/*navigator.geolocation.getCurrentPosition(function(loc) {
		app.$data.localization = {
			lat: Math.floor(loc.coords.latitude * 1000) / 1000,
			lng: Math.floor(loc.coords.longitude * 1000) / 1000,
		};

		calculate(app);
	}, function(error) {
		app.$data.error = error.message;
	});*/

	app.$data.localization = {
		lat: 45.89,
		lng: 6.12
	};

	calculate(app);
};

// Calculate the azimuth and elevation based on GPS
// data and selected satellite
var calculate = function(app) {
	var loc = app.$data.localization;
	var satLng = app.$data.selectedSat.longitude;

	app.$data.result = computeDishData(loc.lat, loc.lng, satLng);
};

document.addEventListener("DOMContentLoaded", main, false);
document.addEventListener('deviceready', this.onDeviceReady, false);
