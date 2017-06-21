window.evOrder = {};
window.uiMgr = window;

window.geocoder = new nyc.Geoclient('https://maps.nyc.gov/geoclient/v1/search.json?app_key=A159073974562987C&app_id=hurricane-evac', 'EPSG:2263');

window.shelters = [];

if (typeof String.prototype.trim != "function") {
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, "");
	};
};

function getOrderTxt(zones){
	var result = 'An Evacuation Order is in effect for Zone';
	if (zones.length > 1){
		result += 's';
		for (var i = 0; i < zones.length - 1; i++){
			result += (' ' + zones[i] + ',');
		}
		return result.substr(0, result.length - 1) + ' and ' + zones[zones.length - 1];
	}else{
		return result + ' ' + zones[0];
	}
};

function gotOrders(csv){
	var data = $.csv.toObjects(csv), zones = [];
	$.each(data, function(_, zone){
		if (zone.EVACUATE == 'YES'){
			zones.push(zone.ZONE);
		}
	});
	evOrder = zones.length ? {text: getOrderTxt(zones), zones: zones} : {text: 'There is not an Evacuation Order in effect for any Zone', zones: []};
	$('#order').html(evOrder.text);
};

function getOrders(){
	$.ajax({
		url: '../data/order.csv?' + new Date().getTime(), 
		success: gotOrders,
		error: loadError
	});
};

function gotShelters(csv){
	window.shelters = $.csv.toObjects(csv);
	listShelters();
};

function shelterInfo(shelter){
	return '<div class="shelterInfo">' +
		'<div class="name">' + shelter.NAME + '</div>' +
		'<div class="addr1">' + shelter.ADDRESS  + '</div>' +
		'<div class="addr2">' +  shelter.CITY + ', NY ' + shelter.ZIP + '</div>' +
		'<div class="access' + shelter.ACCESSIBLE + '"></div>' + 
		'</div>';
};	

function listShelters(){
	var t = $('#sheltersList table')[0];
	$('#sheltersList tr').remove();
	$.each(shelters, function(i, s){
		var r = t.insertRow(i);
		if (i % 2 == 0) $(r).addClass('evRow');
		var c = r.insertCell(0);
		$(c).addClass('dist');
		if (!isNaN(s.distance)) $(c).append('<span>' + s.distance + ' mi</span><br>');
		c = r.insertCell(1);
		$(c).append(shelterInfo(s));
		c.shelter = s;
	});
};

function toTop(){
	$('#address').focus();
	$('#address').select();
	window.scrollTo(0,0);
};

function sortShelters(location){
	$.each(shelters, function(_, s){
		s.distance = window.distance(location.coordinates, [s.X, s.Y]);
	});
	shelters.sort(function(a, b){
		if (a.distance < b.distance) return -1;
		if (a.distance > b.distance) return 1;
		return 0;
	});
	listShelters();
};

function distance(a, b){
	var dx = a[0] - b[0], 
		dy = a[1] - b[1], 
		d = '' + ((0.0001) + Math.sqrt(dx*dx + dy*dy)/5280),
		r = d.substr(0, d.indexOf('.') + 3);
	return r * 1;
};

function find(){
	$('#possible').empty().hide();
	geocoder.search($('#address').val());
};

function doFind(event){
	if (event.keyCode == 13) find();
};

function found(location){
	var zone = location.data.hurricaneEvacuationZone;
	$('#possible').empty().hide();
	sortShelters(location);
	$('#userAddr').html(location.name);
	$('#userZone').html('is located in Evacuation Zone ' + zone);
	if ($.inArray(zone, evOrder.zones) > -1){
		$('#userEvac').html('AN EVACUATION ORDER IS IN EFFECT FOR ZONE ' + zone);
	}else{
		$('#userEvac').html('No evacuation order in effect for this zone');
	}
};

function ambiguous(response){
	var div = $('<div class="name"></div>');
	div.html('"' + $('#address').val() + '" was not found.  Please choose from the possible alternatives:');
	$('#possible').html(div).append('<br>').show();
	$.each(response.possible, function(){
		var name = this.name, a = $('<a href="#"></a>');
		a.html(name).click(function(){
			$('#address').val(name);
			find();
		});
		$('#possible').append(a).append('<br>');
	});
};

function geocodeError(){
	alert('Unable to find address');
};

function loadError(){
	alert('There was an error loading data');
};

geocoder.on(nyc.Locate.EventType.GEOCODE, found);
geocoder.on(nyc.Locate.EventType.AMBIGUOUS, ambiguous);
geocoder.on(nyc.Locate.EventType.ERROR, geocodeError);

$(document).ready(function(){
	getOrders();
	setInterval(getOrders, 600000);
	//get shelters
	$.ajax({
		url: '../data/center.csv?' + new Date().getTime(),
		success: gotShelters,
		error: loadError
	});	
});
