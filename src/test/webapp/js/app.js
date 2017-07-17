QUnit.module('nyc.App', {
	beforeEach: function(assert){
		setup(assert, this);
				
		nyc.SURFACE_WATER_ZONE = '7';
		nyc.NO_ZONE = 'X';

		var filter_btns_html = '<div id="filter">' +
			'<input id="filter-all" type="radio" name="filter" data-prop="ACCESSIBLE" data-vals="N,A,P">' +
			'<input id="filter-access" type="radio" name="filter" data-prop="ACCESSIBLE" data-vals="A,P">' +
			'</div>';
		var tabs_html = '<div id="tabs" data-role="tabs">' +
			'<div data-role="navbar">' +
			'<ul>' +
			'<li id="map-tab-btn"><a href="#map-tab">map</a></li>' +
			'<li id="centers-tab-btn"><a class="ui-btn-active" href="#centers-tab">centers</a></li>' +
			'<li><a href="#legend-tab>legend</a></li></ul>' +
			'</div>' +
			'<div id="map-tab"></div>' +
			'<div id="centers-tab"><div class="centers-top"></div><div class="centers-bottom"></div></div>' +
			'<div id="legend-tab"></div>' +
			'</div>';
		var first_load_html = '<div id="first-load"></div>';
		var centers_html = '<div id="centers-list"></div>';
		var panel_html = '<div id="panel"></div>';
		var transparency_html = '<input id="transparency" value="50">';
		var legend_html = '<div class="leg-sw zone" style="opacity:0.5"></div><div class="leg-sw zone" style="opacity:0.5"></div>';
		var splash_html = '<div id="splash"><div id="splash-cont"><div class="orders"></div><button id="btn-view-map" class="capitalize"></button></div></div>';
		
		$('body').append(filter_btns_html)
			.append(tabs_html)
			.append(centers_html)
			.append(first_load_html)
			.append(panel_html)
			.append(splash_html)
			.append(transparency_html)
			.append(legend_html)
			.trigger('create');
	
		var MockLocationMgr = function(){
			this.locate = {
				geocoder: new nyc.Geoclient()
			}
		};
		nyc.inherits(MockLocationMgr, nyc.EventHandling);
		this.MOCK_LOCATION_MGR = new MockLocationMgr();
		
		var MockDirections = function(){
			this.directionsArgs = null;
			this.directions = function(args){
				this.directionsArgs = args;
			};
		};
		nyc.inherits(MockDirections, nyc.EventHandling);
		this.MOCK_DIRECTIONS = new MockDirections();
		
		var MockPopup = function(map, options){
			this.options = options;
			this.panned = false;
			this.offset = null;
			this.pan = function(){
				this.panned = true;
			};
			this.setOffset = function(offset){
				this.offset = offset;
			};
			this.show = function(options){
				this.options = options;
			};
		};
		this.MOCK_POPUP = new MockPopup();		
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.TEST_APP;
		$('#filter, #tabs, #first_load_html, #centers-list, #panel, #transparency, .leg-sw, #splash').remove();
	}
});

QUnit.test('zone (yes order, is in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};

		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '5 Water Street, Manhattan, NY 10004',
			coordinates: [-8238980.4561055275, 4968508.079970751],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {hurricaneEvacuationZone: '1'}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml, 
					'<div class="inf-location"><div class="inf-name">You are located in Zone 1</div><div class="order active-order">You are required to evacuate</div><div class="inf-name addr">5 Water Street<br> Manhattan, NY 10004</div></div>'
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
	
});

/*
QUnit.test('zone, no order, is in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '59 Maiden Lane, Manhattan, NY 10038',
			coordinates: [-8238530.883679672, 4969463.37417323],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {hurricaneEvacuationZone: '5'}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message(
						'location_zone_order',
						{zone: 5, order: app.content.message('no_order'), name: '59 Maiden Lane<br> Manhattan, NY 10038'}
					)
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (surface water, is in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
			
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: 'Brooklyn Bridge, Manhattan, NY 10038',
			coordinates: [-8237490.54653364, 4969295.73564776],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {hurricaneEvacuationZone: '1'}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_zone_order', {zone: 1, order: app.content.message('yes_order'), name: 'Brooklyn Bridge<br> Manhattan, NY 10038'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (no zone, is in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '102-25 67 Drive, Queens, NY 11375',
			coordinates: [-8221025.695549702, 4972117.922980856],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {hurricaneEvacuationZone: 'X'}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_no_zone', {name: '102-25 67 Drive<br> Queens, NY 11375'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});



QUnit.test('zone (accuracy = nyc.Geocoder.Accuracy.HIGH, yes order, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};

		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '5 Water Street, Manhattan, NY 10004',
			coordinates: [-8238980.4561055275, 4968508.079970751],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message(
						'location_zone_order',
						{zone: 1, order: app.content.message('yes_order'), name: '5 Water Street<br> Manhattan, NY 10004'}
					)
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
	
});

QUnit.test('zone (accuracy = nyc.Geocoder.Accuracy.HIGH, no order, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '59 Maiden Lane, Manhattan, NY 10038',
			coordinates: [-8238530.883679672, 4969463.37417323],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message(
						'location_zone_order',
						{zone: 5, order: app.content.message('no_order'), name: '59 Maiden Lane<br> Manhattan, NY 10038'}
					)
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy = nyc.Geocoder.Accuracy.HIGH, surface water, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
			
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: 'Brooklyn Bridge, Manhattan, NY 10038',
			coordinates: [-8237490.54653364, 4969295.73564776],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_zone_order', {zone: 1, order: app.content.message('yes_order'), name: 'Brooklyn Bridge<br> Manhattan, NY 10038'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy = nyc.Geocoder.Accuracy.HIGH, no zone, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '102-25 67 Drive, Queens, NY 11375',
			coordinates: [-8221025.695549702, 4972117.922980856],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_no_zone', {name: '102-25 67 Drive<br> Queens, NY 11375'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy != nyc.Geocoder.Accuracy.HIGH, yes order, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: 'Beach 20 Street And Cornaga Avenue, Queens, NY 11691',
			coordinates: [-8210185.959213057, 4953852.79882015],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message(
						'location_zone_order',
						{zone: 1, order: app.content.message('yes_order'), name: 'Beach 20 Street And Cornaga Avenue<br> Queens, NY 11691'}
					)
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy != nyc.Geocoder.Accuracy.HIGH, no order, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: 'Dutch Street And John Street, Manhattan, NY 10038',
			coordinates: [-8238511.616313086, 4969526.6589722885],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message(
						'location_zone_order',
						{zone: 5, order: app.content.message('no_order'), name: 'Dutch Street And John Street<br> Manhattan, NY 10038'}
					)
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy != nyc.Geocoder.Accuracy.HIGH, surface water, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: 'Brooklyn Bridge, Manhattan, NY 10038',
			coordinates: [-8237490.54653364, 4969295.73564776],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_zone_order', {zone: 1, order: app.content.message('yes_order'), name: 'Brooklyn Bridge<br> Manhattan, NY 10038'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy != nyc.Geocoder.Accuracy.HIGH, no zone, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '67 Drive And Queens Boulevard, Queens, NY 11375',
			coordinates: [-8221130.281596985, 4972021.7406895375],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_no_zone', {name: '67 Drive And Queens Boulevard<br> Queens, NY 11375'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zone (accuracy != nyc.Geocoder.Accuracy.HIGH, multiple zone, not in geocoded data)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.location = {
			name: '10038',
			coordinates: [-8237976.3885189565, 4969601.664933239],
			accuracy: nyc.Geocoder.Accuracy.ZIP_CODE,
			data: {}
		};
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for zones to load
				app.zone();
				assert.deepEqual(popupCoords, app.location.coordinates);
				assert.equal(
					popupHtml,
					app.content.message('location_zone_unkown', {name: '10038'})
				);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Zone features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
}); 

QUnit.test('initList', function(assert){
	assert.expect(3);
	
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
	
		app.list = function(coordinates){
			assert.notOk(coordinates);
		};
		app.initList();
		
		app.list = function(coordinates){
			assert.deepEqual(coordinates, [1, 2]);
		};
		app.location = {coordinates: [1, 2]};
		app.initList();
		
		var listCalled = false;
		app.list = function(coordinates){
			listCalled = true;
		};
		$('centers-list').append('<div></div>');
		assert.notOk(listCalled);
		done();
		nyc.App.prototype.getOrderUrl = getOrderUrl;
	});
});

QUnit.test('zoomFacility (panel.width == window.width)', function(assert){
	assert.expect(8);
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
	
		var tries = 0;
		var expectedCoords = null;
		var expectedHtml = null;
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('Q505');
				expectedCoords = feature.getCoordinates();
				expectedHtml = feature.html('inf-pop');
				app.zoomFacility('Q505');
				app.map.once('moveend', test);
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		var test = function(){
			assert.equal(app.view.getCenter()[0].toFixed(5), expectedCoords[0].toFixed(5));
			assert.equal(app.view.getCenter()[1].toFixed(5), expectedCoords[1].toFixed(5));
			assert.equal(Math.round(app.view.getZoom()), 17);
			assert.equal($('#tabs').tabs('option','active'), 0);
			assert.ok($('#map-tab-btn a').hasClass('ui-btn-active'));
			assert.notOk($('#centers-tab-btn a').hasClass('ui-btn-active'));
			done();
			nyc.App.prototype.getOrderUrl = getOrderUrl;
		};
		
		$('#panel').width($(window).width());
		$('#tabs').tabs({active: 1});
		
		app.showPopup = function(coords, html){
			assert.deepEqual(coords, expectedCoords);
			assert.equal(html, expectedHtml);
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('zoomFacility (panel.width < window.width)', function(assert){
	assert.expect(8);
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var tries = 0;
		var expectedCoords = null;
		var expectedHtml = null;
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('Q505');
				expectedCoords = feature.getCoordinates();
				expectedHtml = feature.html('inf-pop');
				app.zoomFacility('Q505');
				app.map.once('moveend', test);
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		var test = function(){
			assert.equal(app.view.getCenter()[0].toFixed(5), expectedCoords[0].toFixed(5));
			assert.equal(app.view.getCenter()[1].toFixed(5), expectedCoords[1].toFixed(5));
			assert.equal(Math.round(app.view.getZoom()), 17);
			assert.equal($('#tabs').tabs('option','active'), 1);
			assert.notOk($('#map-tab-btn a').hasClass('ui-btn-active'));
			assert.ok($('#centers-tab-btn a').hasClass('ui-btn-active'));
			done();
			nyc.App.prototype.getOrderUrl = getOrderUrl;
		};
		
		$('#tabs').tabs({active: 1});
		
		app.showPopup = function(coords, html){
			assert.deepEqual(coords, expectedCoords);
			assert.equal(html, expectedHtml);
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('located (nyc.Locate.EventType.GEOCODE)', function(assert){
	assert.expect(3);
	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
	
		var geocode = {
			type: nyc.Locate.ResultType.GEOCODE,
			coordinates: [-8218773.035225957, 4962078.81206489],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '2 Broadway, Queens, NY 11414'			
		};
	
		app.zone = function(){
			assert.ok(true);
		};
		app.list = function(coords){
			assert.deepEqual(coords, geocode.coordinates);
		};
			
		theTest.MOCK_LOCATION_MGR.trigger(nyc.Locate.EventType.GEOCODE, geocode);
	
		assert.deepEqual(app.location, geocode);
	
		done();
		nyc.App.prototype.getOrderUrl = getOrderUrl;
	});
});
QUnit.test('located (nyc.Locate.EventType.GEOLOCATION)', function(assert){
	assert.expect(3);

	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);	
		
		var geolocation = {
			type: nyc.Locate.ResultType.GEOLOCATION,
			coordinates: [-8237226.233076041, 4972059.553663225],
			accuracy: 3000,
			name:"40° 43′ 35″ N 73° 59′ 47″ W"
		};
			
		app.zone = function(){
			assert.ok(true);
		};
		app.list = function(coords){
			assert.deepEqual(coords, geolocation.coordinates);
		};
			
		theTest.MOCK_LOCATION_MGR.trigger(nyc.Locate.EventType.GEOLOCATION, geolocation);
	
		assert.deepEqual(app.location, geolocation);
		
		done();
		nyc.App.prototype.getOrderUrl = getOrderUrl;

	});
});

QUnit.test('mapSize', function(assert){
	assert.expect(1);

	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);	
		
		app.map.updateSize = function(){
			assert.ok(true);
			done();
			nyc.App.prototype.getOrderUrl = getOrderUrl;
		};
		
		$('#map-tab-btn a').trigger('click');
	});
});


QUnit.test('listHeight', function(assert){
	assert.expect(1);

	var theTest = this;
	var done = assert.async();
	
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);			

		$('#tabs').tabs({active: 1});
		$('#centers-tab').height(500);
		$('#centers-tab .centers-top').height(200);
	
		app.listHeight();
		
		assert.equal(
			$('#centers-tab .centers-bottom').height(), 
			$('#centers-tab').height() - $('#centers-tab .centers-top').height() - 5
		);

		done();
		nyc.App.prototype.getOrderUrl = getOrderUrl;
	});
});

QUnit.test('transparency', function(assert){
	assert.expect($('.leg-sw.zone').length + 2);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);			
		
		app.map.render = function(){
			assert.ok(true);
		};
	
		$('#transparency').val(30).trigger('change');
		
		var expected = (100 - $('#transparency').val()) / 100;
		assert.equal(app.zoneLayer.getOpacity(), expected);
		$.each($('.leg-sw.zone'), function(_, sw){
			var actual = new Number($(sw).css('opacity')).toFixed(1);
			assert.equal(actual, expected);
		});
	
		app.map.render = function(){};
		
		done();
		nyc.App.prototype.getOrderUrl = getOrderUrl;
	});
});

QUnit.test('access (popup - slide open)', function(assert){
	assert.expect(2);
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		nyc.app = app;
	
		var tries = 0;
		
		var test = function(){
			setTimeout(function(){
				assert.equal($('#access-popup-html .inf-detail').css('display'), 'block');
				assert.ok(app.popup.panned);
				$('#access-popup-html').remove();
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}, 1000);
		};
	
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('K430');
				$('body').append('<div id="access-popup-html"></div>');
				$('#access-popup-html').append($(feature.html('inf-pop')));
				$('#access-popup-html .inf-detail').css('display', 'none');
				$('#access-popup-html .inf-detail-btn a').one('click', test);
				app.popup.panned = false;
				$('#access-popup-html .inf-detail-btn a').trigger('click');
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				nyc.App.prototype.getOrderUrl = getOrderUrl;
				done();
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('access (popup - slide closed)', function(assert){
	assert.expect(2);
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		nyc.app = app;
	
		var tries = 0;
		
		var test = function(){
			setTimeout(function(){
				assert.equal($('#access-popup-html .inf-detail').css('display'), 'none');
				assert.ok(app.popup.panned);
				$('#access-popup-html').remove();
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}, 1000);
		};
	
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('K430');
				$('body').append('<div id="access-popup-html"></div>');
				$('#access-popup-html').append($(feature.html('inf-pop')));
				$('#access-popup-html .inf-detail').css('display', 'block');
				$('#access-popup-html .inf-detail-btn a').one('click', test);
				app.popup.panned = false;
				$('#access-popup-html .inf-detail-btn a').trigger('click');
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('access (list - slide open)', function(assert){
	assert.expect(2);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		nyc.app = app;
	
		var tries = 0;
		
		var test = function(){
			setTimeout(function(){
				assert.equal($('#access-list-html .inf-detail').css('display'), 'block');
				assert.notOk(app.popup.panned);
				$('#access-list-html').remove();
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}, 1000);
		};
	
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('K430');
				$('body').append('<div id="access-list-html"></div>');
				$('#access-list-html').append($(feature.html('inf-list')));
				$('#access-list-html .inf-detail').css('display', 'none');
				$('#access-list-html .inf-detail-btn a').one('click', test);
				app.popup.panned = false;
				$('#access-list-html .inf-detail-btn a').trigger('click');
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('access (list - slide closed)', function(assert){
	assert.expect(2);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
		nyc.app = app;
	
		var tries = 0;
		
		var test = function(){
			setTimeout(function(){
				assert.equal($('#access-list-html .inf-detail').css('display'), 'none');
				assert.notOk(app.popup.panned);
				$('#access-list-html').remove();
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
		}, 1000);
		};
	
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for features to load
				var feature = app.centerSource.getFeatureById('X235');
				$('body').append('<div id="access-list-html"></div>');
				$('#access-list-html').append($(feature.html('inf-list')));
				$('#access-list-html .inf-detail').css('display', 'block');
				$('#access-list-html .inf-detail-btn a').one('click', test);
				app.popup.panned = false;
				$('#access-list-html .inf-detail-btn a').trigger('click');
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl;
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('getOrderUrl', function(assert){
	assert.expect(1);
	
	nyc.cacheBust = 'yo';

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);
		
	assert.equal(app.getOrderUrl(), 'data/order.csv?' + nyc.cacheBust);
});

QUnit.test('getOrders (error)', function(assert){
	assert.expect(1);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var jqAjax = $.ajax;
	$.ajax = function(options) {
        options.error('error');
    };
   
    app.error = function(){
		assert.ok(true);
		$.ajax = jqAjax;
	};
	
    app.getOrders();
});


QUnit.test('getOrders (success)', function(assert){
	assert.expect(1);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var jqAjax = $.ajax;
	$.ajax = function(options) {
        options.success('csvData');
    };

    app.gotOrders = function(data){
		assert.deepEqual(data, 'csvData');
		$.ajax = jqAjax;
	};
    app.getOrders();
});

QUnit.test('gotOrders (none)', function(assert){
	assert.expect(2);
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/no-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var test = function(){
			if (app.ordersLoaded){
				assert.deepEqual(app.zoneOrders, {});
				assert.equal($('#splash-cont .orders').html(), '<div class="order">' + app.content.message('splash_msg') + '</div>');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else{
				setTimeout(test, 100);
			}
		};
		
		test();
	});
});

QUnit.test('gotOrders (Zones 1)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/one-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP			
		);

		var test = function(){
			if (app.ordersLoaded){
				assert.deepEqual(app.zoneOrders, {'1': true});
				assert.equal($('#splash-cont .orders').html(), app.content.message('splash_yes_order') + '<div class="zone">Zone 1</div>');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else{
				setTimeout(test, 100);
			}
		};
		
		test();
	});	
});

QUnit.test('gotOrders (Zones 1, 4 and 6)', function(assert){
	assert.expect(2);
	
	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var test = function(){
			if (app.ordersLoaded){
				assert.deepEqual(app.zoneOrders, {'1': true, '4': true, '6': true});
				assert.equal($('#splash-cont .orders').html(), app.content.message('splash_yes_order') + '<div class="zone">Zones 1, 4 and 6</div>');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else{
				setTimeout(test, 100);
			}
		};
		
		test();
	});
});

QUnit.test('filter', function(assert){
	assert.expect(4);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var filtersApplied = null;
	var coordsApplied = null;

	app.location.coordinates = [1, 2];
	app.centerSource.filter = function(filters){
		filtersApplied = filters;
	};
	app.list = function(coords){
		coordsApplied = coords;
	};
	
	$('#filter-all').trigger('click');
	assert.deepEqual(filtersApplied, [{property: 'ACCESSIBLE', values: ['N', 'A', 'P']}]);
	assert.deepEqual(coordsApplied, [1, 2]);

	$('#filter-access').trigger('click');
	assert.deepEqual(filtersApplied, [{property: 'ACCESSIBLE', values: ['A', 'P']}]);
	assert.deepEqual(coordsApplied, [1, 2]);
});

QUnit.test('zoomCoords', function(assert){
	assert.expect(3);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var done = assert.async();
	
	app.zoomCoords(nyc.ol.Basemap.CENTER);
	
	setTimeout(function(){
		assert.equal(Math.round(app.view.getCenter()[0]), Math.round(nyc.ol.Basemap.CENTER[0]));
		assert.equal(Math.round(app.view.getCenter()[1]), Math.round(nyc.ol.Basemap.CENTER[1]));
		assert.equal(Math.round(app.view.getZoom()), 17);
		done();
	}, 1000);
});

QUnit.test('mapClick (center)', function(assert){
	assert.expect(3);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);

		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.centerSource.getFeatures().length){ //wait for evac centers to load
				var feature = app.centerSource.getFeatures()[0];
				app.map.forEachFeatureAtPixel = function(pixel, func){
					assert.deepEqual(pixel, [1, 2]);
					func(feature, app.centerLayer);
				};
				app.mapClick({pixel: [1, 2]});
				assert.deepEqual(popupCoords, feature.getCoordinates());
				assert.equal(popupHtml, feature.html('inf-pop'));
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('mapClick (zone)', function(assert){
	assert.expect(3);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
			
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.showPopup = function(coords, html){
			popupCoords = coords;
			popupHtml = html;
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for evac centers to load
				var feature = app.zoneSource.getFeatures()[0];
				app.map.forEachFeatureAtPixel = function(pixel, func){
					assert.deepEqual(pixel, [1, 2]);
					func(feature, app.zoneLayer);
				};
				app.mapClick({pixel: [1, 2]});
				assert.deepEqual(popupCoords, app.map.getCoordinateFromPixel([1, 2]));
				assert.equal(popupHtml, feature.html('inf-pop'));
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('mapClick (nothing)', function(assert){
	assert.expect(3);

	var theTest = this;
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		var getOrderUrl = nyc.App.prototype.getOrderUrl;
		nyc.App.prototype.getOrderUrl = function(){
			return 'data/yes-order.csv';
		};
		
		var app = new nyc.App(
			theTest.TEST_MAP,
			theTest.FEATURE_DECORATIONS,
			new nyc.HurricaneContent([MESSAGES, csvMessages]),
			new nyc.Style(),
			theTest.MOCK_LOCATION_MGR,
			theTest.MOCK_DIRECTIONS,
			theTest.MOCK_POPUP
		);
			
		var popupCoords = null;
		var popupHtml = null;
		var tries = 0;
		
		app.showPopup = function(coords, html){
			assert.ok(false, 'showPopup should not be called');
		};
		
		var wait = function(){
			tries++;
			if (app.zoneSource.getFeatures().length){ //wait for evac centers to load
				var feature = app.zoneSource.getFeatures()[0];
				app.map.forEachFeatureAtPixel = function(pixel, func){
					assert.deepEqual(pixel, [1, 2]);
				};
				app.mapClick({pixel: [1, 2]});
				assert.notOk(popupCoords);
				assert.notOk(popupHtml);
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}else if (tries < 20){
				setTimeout(wait, 100);
			}else{
				assert.ok(false, 'Evac Center features failed to load');
				done();
				nyc.App.prototype.getOrderUrl = getOrderUrl; 
			}
		};
		
		setTimeout(wait, 100);
	});
});

QUnit.test('showPopup', function(assert){
	assert.expect(3);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var hidTips = false;
	
	app.hideTips = function(){
		hidTips = true;
	};
	
	app.showPopup([1, 2], 'some html');
	
	assert.ok(hidTips);
	assert.deepEqual(app.popup.offset, [0, -10]);
	assert.deepEqual(app.popup.options, {coordinates: [1, 2], html: 'some html'});
});

QUnit.test('zoneTip (yes evacuate)', function(assert){
	assert.expect(1);

	var feature = new ol.Feature();
	feature.zoneTip = nyc.App.prototype.zoneTip;
	feature.orders = {'1': true};
	feature.getZone = function(){return 1;};	
	feature.replace = nyc.HurricaneContent.prototype.replace;
	feature.message = nyc.HurricaneContent.prototype.message;
	feature.messages = MESSAGES;
	assert.deepEqual(feature.zoneTip(), {
		cssClass: 'tip-zone',
		text: feature.message('zone_tip', {zone: 1, order: feature.message('yes_order')})
	});
});

QUnit.test('zoneTip (no evacuate)', function(assert){
	assert.expect(1);

	var feature = new ol.Feature();
	feature.zoneTip = nyc.App.prototype.zoneTip;
	feature.orders = {'1': true};
	feature.getZone = function(){return 2;};
	feature.replace = nyc.HurricaneContent.prototype.replace;
	feature.message = nyc.HurricaneContent.prototype.message;
	feature.messages = MESSAGES;
	assert.deepEqual(feature.zoneTip(), {
		cssClass: 'tip-zone',
		text: feature.message('zone_tip', {zone: 2, order: feature.message('no_order')})
	});
});

QUnit.test('centerTip (accessible)', function(assert){
	assert.expect(1);

	var feature = new ol.Feature();
	feature.centerTip = nyc.App.prototype.centerTip;
	feature.getName = function(){return 'evac center';};	
	feature.isAccessible = function(){return true;};	
	feature.replace = nyc.HurricaneContent.prototype.replace;
	feature.message = nyc.HurricaneContent.prototype.message;
	feature.messages = MESSAGES;
	assert.deepEqual(feature.centerTip(), {
		cssClass: 'tip-center',
		text: feature.message('center_tip', {css: 'access', name: feature.getName()})
	});
});

QUnit.test('centerTip (not accessible)', function(assert){
	assert.expect(1);

	var feature = new ol.Feature();
	feature.centerTip = nyc.App.prototype.centerTip;
	feature.getName = function(){return 'evac center';};	
	feature.isAccessible = function(){return false;};	
	feature.replace = nyc.HurricaneContent.prototype.replace;
	feature.message = nyc.HurricaneContent.prototype.message;
	feature.messages = MESSAGES;
	assert.deepEqual(feature.centerTip(), {
		cssClass: 'tip-center',
		text: feature.message('center_tip', {css: '', name: feature.getName()})
	});
});

QUnit.test('locationTip', function(assert){
	assert.expect(1);

	var feature = new ol.Feature();
	feature.locationTip = nyc.App.prototype.locationTip;
	feature.getName = function(){return '59 Maiden Lane, Manhattan, NY 10038';};	
	assert.deepEqual(feature.locationTip(), {
		cssClass: 'tip-location',
		text: '59 Maiden Lane<br> Manhattan, NY 10038'
	});
});

QUnit.test('error', function(assert){
	assert.expect(1);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var alertMsg = null;
	
	app.alert = function(msg){
		alertMsg = msg;
	};
	app.error();
	assert.equal(alertMsg, app.content.message('data_load_error'));
});
	

QUnit.test('alert', function(assert){
	assert.expect(5);

	var app = new nyc.App(
		this.TEST_MAP,
		this.FEATURE_DECORATIONS,
		new nyc.HurricaneContent([MESSAGES]),
		new nyc.Style(),
		this.MOCK_LOCATION_MGR,
		this.MOCK_DIRECTIONS,
		this.MOCK_POPUP
	);

	var done = assert.async();
	
	assert.notOk(app.dialog);
	app.alert('a message');
	assert.ok(app.dialog);
	
	setTimeout(function(){
		assert.equal($('.dia-msg').html(), 'a message');
		assert.equal($('.dia-container').css('display'), 'block');
		assert.ok($('*:focus').get(0) === $('.dia .btn-ok').get(0));
		$('.dia-container').remove();
		done();
	}, 1000);
});

*/