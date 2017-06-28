window.nyc311 = {
	ORDER_URL: '../data/order.csv?',
	CENTER_URL: '../data/center.csv?'
};

nyc311.App = function(geocoder, content){
	this.geocoder = geocoder;
	this.content = content;
	
	this.getOrders();
	setInterval($.proxy(this.getOrders, this), 600000);
	this.getShelters();
	setInterval($.proxy(this.getShelters, this), 600000);

	geocoder.on(nyc.Locate.EventType.GEOCODE, $.proxy(this.found, this));
	geocoder.on(nyc.Locate.EventType.AMBIGUOUS, $.proxy(this.ambiguous, this));
	geocoder.on(nyc.Locate.EventType.ERROR, $.proxy(this.geocodeError, this));
};

nyc311.App.prototype = {
	zoneOrders: null,
	shelters: null,
	getOrders: function(){
		$.ajax({
			url: nyc311.ORDER_URL + new Date().getTime(), 
			success: $.proxy(this.gotOrders, this),
			error: this.loadError
		});
	},
	getShelters: function(){
		$.ajax({
			url: nyc311.CENTER_URL + new Date().getTime(),
			success: $.proxy(this.gotShelters, this),
			error: this.loadError
		});			
	},
	gotOrders: function(csv){
		var data = $.csv.toObjects(csv), zoneOrders = this.zoneOrders = {}, zones = [];
		$.each(data, function(_, zone){
			if (zone.EVACUATE == 'YES'){
				zones.push(zone.ZONE);
				zoneOrders[zone.ZONE] = true;
			}
		});
		zoneOrders.text = zones.length ? this.getOrderTxt(zones) : 'There is not an Evacuation Order in effect for any Zone';
		$('#order').html(zoneOrders.text);
	},
	getOrderTxt: function(zones){
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
	},
	gotShelters: function(csv){
		this.shelters = $.csv.toObjects(csv);
		this.listShelters();
	},
	listShelters: function(){
		var me = this, t = $('#sheltersList table')[0];
		$('#sheltersList tr').remove();
		$.each(me.shelters, function(i, s){
			var r = t.insertRow(i);
			if (i % 2 == 0) $(r).addClass('evRow');
			var c = r.insertCell(0);
			$(c).addClass('dist');
			if (!isNaN(s.distance)) $(c).append('<span>' + s.distance + ' mi</span><br>');
			c = r.insertCell(1);
			$(c).append(me.shelterInfo(s));
			c.shelter = s;
		});
	},
	shelterInfo: function(shelter){
		return '<div class="shelterInfo">' +
			'<div class="name">' + shelter.OEM_LABEL + '</div>' +
			'<div class="addr1">' + shelter.BLDG_ADD  + '</div>' +
			'<div class="addr1">Between ' + shelter.CROSS1 + ' and ' + shelter.CROSS2  + '</div>' +
			'<div class="addr2">' +  shelter.CITY + ', NY ' + shelter.ZIP_CODE + '</div>' +
			'<div class="access' + shelter.ACCESSIBLE + '"></div>' + 
			this.getAccessibleDetails(shelter) + 
			'</div>';
	},
	getAccessibleDetails: function(shelter){
		if (shelter.ACCESSIBLE == 'Y'){
			return '<a href="#" onclick="$(this).next().slideToggle();">Details</a>' + this.content.message('acc_feat', shelter);
		}
		return '';
	},
	sortShelters: function(location){
		var me = this;
		$.each(me.shelters, function(_, s){
			s.distance = me.distance(location.coordinates, [s.X, s.Y]);
		});
		me.shelters.sort(function(a, b){
			if (a.distance < b.distance) return -1;
			if (a.distance > b.distance) return 1;
			return 0;
		});
		me.listShelters();
	},
	distance: function(a, b){
		var dx = a[0] - b[0], 
			dy = a[1] - b[1], 
			d = '' + ((0.0001) + Math.sqrt(dx*dx + dy*dy)/5280),
			r = d.substr(0, d.indexOf('.') + 3);
		return r * 1;
	},
	find: function(){
		$('#possible').empty().hide();
		$('#userAddr, #userZone, #userEvac').empty();
		this.geocoder.search($('#address').val());
	},
	doFind: function(event){
		if (event.keyCode == 13) this.find();
	},
	found: function(location){
		var content = this.content, zone = location.data.hurricaneEvacuationZone, html;
		$('#possible').empty().hide();
		this.sortShelters(location);
		if (zone){
			if (zone == 'X') {
				html = content.message('location_no_zone', location);
			}else{
				var order = content.message(this.zoneOrders[zone] ? 'yes_order' : 'no_order');
				html = content.message('location_zone_order', {zone: zone, order: order, name: location.name});			
			}
		}else{
			html = content.message('location_zone_unkown_311', location);
		}
		$('#userAddr').html(html);
	},
	ambiguous: function(response){
		if (response.possible.length){
			var me = this, div = $('<div class="name"></div>');
			div.html('"' + $('#address').val() + '" was not found.  Please choose from the possible alternatives:');
			$('#possible').html(div).append('<br>').show();
			$.each(response.possible, function(){
				var name = this.name, a = $('<a href="#"></a>');
				a.html(name).click(function(){
					$('#address').val(name);
					me.find();
				});
				$('#possible').append(a).append('<br>');
			});
		}else{
			this.geocodeError();
		}
	},
	toTop: function(){
		$('#address').focus();
		$('#address').select();
		window.scrollTo(0,0);
	},
	geocodeError: function(){
		$('#possible').empty().hide();
		alert('Unable to locate\n' + $('#address').val());
	},
	loadError: function(){
		alert('There was an error loading data');
	}	
};