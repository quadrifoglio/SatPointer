/*
 * SkyFinder - Math
 */

// TODO: Figure out how the fuck that works
// Stole from http://arachnoid.com/satfinder/index.html

var toDeg = 180.0 / Math.PI;
var toRad = Math.PI / 180.0;

// Compute azimuth and elevation based on GPS
// location and geostationary satellite longitude
var computeDishData = function(lat, lng, satLng) {
	var lngDiff = lng - satLng;
	var az = Math.atan2(Math.sin(lat * toRad), Math.tan(lngDiff * toRad)) * toDeg;

	az = (270.0 - az) / 360.0;
	az = az - Math.floor(az);
	az *= 360.0;

	var r1 = 6.6107; // ratio synchronous orbit/earth radius
	var clng = Math.cos(lngDiff * toRad);
	var clat = Math.cos(lat * toRad);

	var v1 = r1 * clat * clng - 1.0;
	var v2 = r1 * Math.sqrt(1 - clat * clat * clng * clng);
	var el = Math.atan2(v1, v2) * toDeg;

	return {az: az, el: el};
};
