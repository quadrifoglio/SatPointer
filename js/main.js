/*
 * Application entry point
 */

var main = function() {
	// Vue.JS initialization
	var app = new Vue({
		el: "#app",
		data: {
			satellites: Satellites
		}
	});

	// When the selector changes, trigger a call to process()
	el("#sat-select").addEventListener("change", function() {
		process(app);
	});
};

var process = function(app) {
	var index = el("#sat-select").selectedIndex - 1;
	if(index < 0 || index > Satellites.length) {
		return;
	}

	var satellite = Satellites[index];
	console.log(satellite.Name);
};

document.onload = main();
