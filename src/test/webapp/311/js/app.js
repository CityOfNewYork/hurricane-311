QUnit.module('nyc311.App', {
	beforeEach: function(assert){
		
		var MockGeocoder = function(){};
		nyc.inherits(MockGeocoder, nyc.EventHandling);
		
		this.MOCK_GEOCODER = new MockGeocoder();
		
	},
	afterEach: function(assert){
		delete this.MOCK_GEOCODER;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(9);
	
	var getOrders = nyc311.App.prototype.getOrders;
	var getShelters = nyc311.App.prototype.getShelters;
	var found = nyc311.App.prototype.found;
	var ambiguous = nyc311.App.prototype.ambiguous;
	var geocodeError = nyc311.App.prototype.geocodeError;
	
	nyc311.App.prototype.getOrders = function(){
		assert.ok(true);
	};
	nyc311.App.prototype.getShelters = function(){
		assert.ok(true);
	};

	var setInterval = window.setInterval;
	var functions = [];
	
	window.setInterval = function(fn, ms){
		functions.push(fn);
		assert.equal(ms, 600000);
	};
	
	var proxy = $.proxy;
	
	$.proxy = function(fn, scope){
		assert.deepEqual(scope, app);
		return fn;
	};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	assert.equal(functions.length, 2);

	assert.deepEqual(functions[0], app.getOrders);
	assert.deepEqual(functions[1], app.getShelters);
	
	nyc311.App.prototype.getOrders = getOrders;
	nyc311.App.prototype.getShelters = getShelters;
	nyc311.App.prototype.found = found;
	nyc311.App.prototype.ambiguous = ambiguous;
	nyc311.App.prototype.geocodeError = geocodeError;
	
	window.setInterval = setInterval;
	$.proxy = proxy;

});
