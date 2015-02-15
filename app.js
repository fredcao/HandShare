var app = (function()
{
	// Application object.
	var app = {};

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	app.initialize = function()
	{
		document.addEventListener('deviceready', onDeviceReady, false);
	};

	function onDeviceReady()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.estimote = EstimoteBeacons;

		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 200);
	}

	function startScan()
	{
		function onBeaconsRanged(beaconInfo)
		{

			//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				// Hardcoded to the Estimotes we borrowed
				if ((beacon.major === 9905) && (beacon.minor === 54875)) {
					if (!existsClient(beacon.major, beacon.minor)) {
						//$("#debug").append($("<div>[onBeaconsRanged] Client does not exist</div>"));
						createNewClient(beacon.major, beacon.minor, "email1", "Hello, it was nice meeting you at deltaHacks today. Would you like to connect on Facebook?", beacon, true);
					}
					else {
						//$("#debug").append($("<div>[onBeaconsRanged] Client exists, update</div>"));
						updateClient(beacon.major, beacon.minor, beacon);
					}
					beacons[key] = beacon;
				}
				else if ((beacon.major === 51224) && (beacon.minor === 48474)) {
					if (!existsClient(beacon.major, beacon.minor)) {
						//$("#debug").append($("<div>[onBeaconsRanged] Client does not exist</div>"));
						createNewClient(beacon.major, beacon.minor, "email2", "Hi, it was great talking with you today. Would you like to connect on Twitter?", beacon, true);
					}
					else {
						//$("#debug").append($("<div>[onBeaconsRanged] Client exists, update</div>"));
						updateClient(beacon.major, beacon.minor, beacon);
					}
					beacons[key] = beacon;
				}
				// Major 9905 Minor 54875
				// Major 51224 Minor 48474
			}
			findHandshakes();
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		estimote.requestAlwaysAuthorization();

		// Start ranging beacons.
		estimote.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			onError);
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();

		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 5 seconds.
			if (beacon.timeStamp + 5000 > timeNow)
			{
				// Create tag to display beacon data.
				var element = $(
					'<li>'
					+	'Major: ' + beacon.major + '<br />'
					+	'Minor: ' + beacon.minor + '<br />'
					+	proximityHTML(beacon)
					+	distanceHTML(beacon)
					+	rssiHTML(beacon)
					+	'UUID: ' + beacon.proximityUUID + '<br />'
					+   'NAME: ' + beacon.name + '<br />'
					+   'UUID2: ' + beacon.motionProximityUUID + '<br />'
					+ '</li>'
				);

				$('#found-beacons').append(element);
			}
		});
	}

	function proximityHTML(beacon)
	{
		var proximity = beacon.proximity;
		if (!proximity) { return ''; }

		var proximityNames = [
			'Unknown',
			'Immediate',
			'Near',
			'Far'];

		return 'Proximity: ' + proximityNames[proximity] + '<br />';
	}

	function distanceHTML(beacon)
	{
		var meters = beacon.distance;
		if (!meters) { return ''; }

		var distance =
			(meters > 1) ?
				meters.toFixed(3) + ' m' :
				(meters * 100).toFixed(3) + ' cm';

		if (meters < 0) { distance = '?'; }

		return 'Distance: ' + distance + '<br />'
	}

	function rssiHTML(beacon)
	{
		var beaconColors = [
			'rgb(214,212,34)', // unknown
			'rgb(215,228,177)', // mint
			'rgb(165,213,209)', // ice
			'rgb(45,39,86)', // blueberry
			'rgb(200,200,200)', // white
			'rgb(200,200,200)', // transparent
		];

		// Get color value.
		var color = beacon.color || 0;
		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);
		var rgb = beaconColors[color];

		// Map the RSSI value to a width in percent for the indicator.
		var rssiWidth = 1; // Used when RSSI is zero or greater.
		if (beacon.rssi < -100) { rssiWidth = 100; }
		else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }
		// Scale values since they tend to be a bit low.
		rssiWidth *= 1.5;

		var html =
			'RSSI: ' + beacon.rssi + '<br />'
			+ '<div style="background:' + rgb + ';height:20px;width:'
			+ 		rssiWidth + '%;"></div>'

		return html;
	}

	return app;
})();

app.initialize();
