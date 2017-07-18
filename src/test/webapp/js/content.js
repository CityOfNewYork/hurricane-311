QUnit.module('nyc.HurricaneContent');	

QUnit.test('locationMsg (no zone)', function(assert){
	assert.expect(1);
	
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		
		var content = new nyc.HurricaneContent([MESSAGES, csvMessages]);
		content.zoneOrders = {'1': true, '2': false, '3': true};
		assert.equal(
			content.locationMsg({name: 'my location', data:{hurricaneEvacuationZone: 'X'}}),
			'<div class=\"inf-location\"><div class=\"inf-name\">You are not located in an Evacuation Zone</div><div class=\"inf-name addr\">my location</div></div>'
		);
		
		done();
	});
});

QUnit.test('locationMsg (zone unkown)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		
		var content = new nyc.HurricaneContent([MESSAGES, csvMessages]);
		content.zoneOrders = {'1': true, '2': false, '3': true};
		
		assert.notOk(content.locationMsg({name: 'my location', data:{}}));
		assert.notOk(content.locationMsg({name: 'my location'}));
		
		done();
	});
});

QUnit.test('locationMsg (has zone, no evac)', function(assert){
	assert.expect(1);
	
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		
		var content = new nyc.HurricaneContent([MESSAGES, csvMessages]);
		content.zoneOrders = {'1': true, '2': false, '3': true};

		assert.equal(
			content.locationMsg({name: 'my location', data:{hurricaneEvacuationZone: '2'}}),
			'<div class=\"inf-location\"><div class=\"inf-name\">You are located in Zone 2</div><div class=\"order\">No evacuation order currently in effect</div><div class=\"inf-name addr\">my location</div></div>'
		);
		
		done();
	});
});

QUnit.test('locationMsg (has zone, evac)', function(assert){
	assert.expect(1);
	
	var done = assert.async();
		
	new nyc.CsvContent('data/pre-storm-content.csv', function(csvMessages){
		
		var content = new nyc.HurricaneContent([MESSAGES, csvMessages]);
		content.zoneOrders = {'1': true, '2': false, '3': true};

		assert.equal(
			content.locationMsg({name: 'my location', data:{hurricaneEvacuationZone: '1'}}),
			'<div class=\"inf-location\"><div class=\"inf-name\">You are located in Zone 1</div><div class=\"order active-order\">You are required to evacuate</div><div class=\"inf-name addr\">my location</div></div>'
		);
		
		done();
	});
});