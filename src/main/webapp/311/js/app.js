/** 
 * @public 
 * @namespace
 */
window.nyc311 = {
	/**
	 * @desc The URL to the order.csv data
	 * @public
	 * @const {string}
	 */
	ORDER_URL: '../data/order.csv?',
	/**
	 * @desc The URL to the center.csv data
	 * @public
	 * @const {string}
	 */
	CENTER_URL: '../data/center.csv?',
	/**
	 * @desc The URL to the content.csv data
	 * @public
	 * @const {string}
	 */
	CONTENT_URL: '../data/content.csv?'
};

/**
 * @desc A class to manage 311 call taker interaction with the hurricane evacuation data
 * @public
 * @class
 * @constructor
 * @param {nyc.Geoclient} geocoder Address geocoder that provides hurricane zone data
 * @param {nyc.HurricaneContent} content Manages content messages
 */
nyc311.App = function(geocoder, content){
	this.geocoder = geocoder;
	this.content = content;
	
	this.getContent();
	setInterval($.proxy(this.getContent, this), 60000);
	this.getOrders();
	setInterval($.proxy(this.getOrders, this), 60000);
	this.getShelters();
	setInterval($.proxy(this.getShelters, this), 60000);

	geocoder.on(nyc.Locate.EventType.GEOCODE, $.proxy(this.found, this));
	geocoder.on(nyc.Locate.EventType.AMBIGUOUS, $.proxy(this.ambiguous, this));
	geocoder.on(nyc.Locate.EventType.ERROR, $.proxy(this.geocodeError, this));
};

nyc311.App.prototype = {
	/**
	 * @private
	 * @member {nyc.Geoclient}
	 */
	geocoder: null,
	/**
	 * @private
	 * @member {nyc.HurricaneContent}
	 */
	content: null,
	/**
	 * @private
	 * @member {Object<string, boolean>}
	 */
	zoneOrders: null,
	/**
	 * @private
	 * @member {Array<Object<string, Object>>}
	 */	
	shelters: null,
	/**
	 * @private
	 * @method
	 */
	getContent: function(){
		new nyc.CsvContent(nyc311.CONTENT_URL + new Date().getTime(), $.proxy(this.gotContent, this));
	},
	/**
	 * @private
	 * @method
	 */
	getOrders: function(){
		$.ajax({
			url: nyc311.ORDER_URL + new Date().getTime(), 
			success: $.proxy(this.gotOrders, this),
			error: this.loadError
		});
	},
	/**
	 * @private
	 * @method
	 */
	getShelters: function(){
		$.ajax({
			url: nyc311.CENTER_URL + new Date().getTime(),
			success: $.proxy(this.gotShelters, this),
			error: this.loadError
		});			
	},
	/**
	 * @private
	 * @method
	 * @param {Object<string, string>} content
	 */
	gotContent: function(content){
		for (var msg in content){
			this.content.messages[msg] = content[msg];
		}
		this.setHeadline();
	},
	/**
	 * @private
	 * @method
	 * @param {string} csv
	 */
	gotOrders: function(csv){
		var data = $.csv.toObjects(csv), zoneOrders = this.zoneOrders = {}, zones = [];
		$.each(data, function(_, zone){
			if (zone.EVACUATE == 'YES'){
				zones.push(zone.ZONE);
				zoneOrders[zone.ZONE] = true;
			}
		});
		this.content.zoneOrders = zoneOrders; 
		this.setHeadline();
	},
	/**
	 * @private
	 * @method
	 * @param {string} csv
	 */
	gotShelters: function(csv){
		this.shelters = $.csv.toObjects(csv);
		this.listShelters();
	},
	/**
	 * @private
	 * @method
	 */
	setHeadline: function(){
		var content = this.content, banner = content.message('banner_text'), title = 'NYC ' + banner;
		if (content.messages.post_storm == 'NO'){
			$('#order').html(this.getOrderTxt());
		}else{
			$('#order').html(content.message('splash_msg'));
		}
		document.title = title;
		$('#evac-ctr').html(content.message('centers_tab'));
		$('#banner div').html(banner).attr('title', title);		
		$('#banner img').attr('alt', title);		
	},
	/**
	 * @private
	 * @method
	 */
	getOrderTxt: function(){
		var zones = [];
		for (var z in this.zoneOrders){
			if (this.zoneOrders[z]){
				zones.push(z);
			}
		};
		if (!zones.length){
			return 'There is not an Evacuation Order in effect for any Zone';
		}
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
	/**
	 * @private
	 * @method
	 */
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
	/**
	 * @private
	 * @method
	 * @param {Object<string, Object>} shelter
	 * @return {string}
	 */
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
	/**
	 * @private
	 * @method
	 * @param {Object<string, Object>} shelter
	 * @return {string}
	 */
	getAccessibleDetails: function(shelter){
		if (shelter.ACCESSIBLE == 'Y'){
			return '<a href="#" onclick="$(this).next().slideToggle();">Details</a>' + this.content.message('acc_feat', shelter);
		}
		return '';
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Locate.Result} location
	 */
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
	/**
	 * @private
	 * @method
	 * @param {Object<string, Object>} a
	 * @param {Object<string, Object>} b
	 * @return {number}
	 */
	distance: function(a, b){
		var dx = a[0] - b[0], 
			dy = a[1] - b[1], 
			d = '' + ((0.0001) + Math.sqrt(dx*dx + dy*dy)/5280),
			r = d.substr(0, d.indexOf('.') + 3);
		return r * 1;
	},
	/**
	 * @private
	 * @method
	 */
	find: function(){
		$('#possible').empty().hide();
		$('#evac-msg, #userZone, #userEvac').empty();
		this.geocoder.search($('#address').val());
	},
	/**
	 * @private
	 * @method
	 * @param {JQueryEvent}
	 */
	doFind: function(event){
		if (event.keyCode == 13) this.find();
	},
	found: function(location){
		var content = this.content, html = content.locationMsg(location);
		$('#possible').empty().hide();
		this.sortShelters(location);
		if (!html){
			html = content.message('location_zone_unkown_311', {
				name: location.name, 
				oem_supplied: content.message('user_zone_unkown_311')
			}); 
		}
		$('#evac-msg').html(html);
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Ambiguous} response
	 */
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
	/**
	 * @private
	 * @method
	 */
	toTop: function(){
		$('#address').focus();
		$('#address').select();
		window.scrollTo(0,0);
	},
	/**
	 * @private
	 * @method
	 */
	geocodeError: function(){
		$('#possible').empty().hide();
		alert('Unable to locate\n' + $('#address').val());
	},
	/**
	 * @private
	 * @method
	 */
	loadError: function(){
		alert('There was an error loading data');
	}	
};