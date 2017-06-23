QUnit.module('nyc311.App', {
	beforeEach: function(assert){
		
		nyc311.ORDER_URL = 'data/order.csv?';
		nyc311.CENTER_URL = 'data/311-center.csv?';

		var MockGeocoder = function(){};
		nyc.inherits(MockGeocoder, nyc.EventHandling);
		
		this.MOCK_GEOCODER = new MockGeocoder();
		
		this.AMBIGUOUS_RESPONSE = {
			possible: [{name: 'possible0'}, {name: 'possible1'}]
		};
		
		this.GEOCODE = {
			type: 'geocode',
			coordinates: [982037,197460],
			data: {
				assemblyDistrict: '65',
				bbl: '1000670001',
				bblBoroughCode: '1',
				bblTaxBlock: '00067',
				bblTaxLot: '0001',
				boardOfElectionsPreferredLgc: '1',
				boePreferredStreetName: 'MAIDEN LANE',
				boePreferredstreetCode: '12563001',
				boroughCode1In: '1',
				buildingIdentificationNumber: '1079043',
				businessImprovementDistrict: '113140',
				censusBlock2000: '2008',
				censusBlock2010: '1006',
				censusTract1990: '  1502',
				censusTract2000: '  1502',
				censusTract2010: '  1502',
				cityCouncilDistrict: '01',
				civilCourtDistrict: '01',
				coincidentSegmentCount: '1',
				communityDistrict: '101',
				communityDistrictBoroughCode: '1',
				communityDistrictNumber: '01',
				communitySchoolDistrict: '02',
				condominiumBillingBbl: '0000000000',
				congressionalDistrict: '10',
				cooperativeIdNumber: '0000',
				cornerCode: 'CR',
				crossStreetNamesFlagIn: 'E',
				dcpCommercialStudyArea: '11004',
				dcpPreferredLgc: '01',
				dotStreetLightContractorArea: '1',
				dynamicBlock: '206',
				electionDistrict: '010',
				fireBattalion: '01',
				fireCompanyNumber: '004',
				fireCompanyType: 'E',
				fireDivision: '01',
				firstBoroughName: 'MANHATTAN',
				firstStreetCode: '12563001010',
				firstStreetNameNormalized: 'MAIDEN LANE',
				fromLionNodeId: '0015262',
				fromPreferredLgcsFirstSetOf5: '01',
				genericId: '0000631',
				geosupportFunctionCode: '1B',
				geosupportReturnCode: '00',
				geosupportReturnCode2: '00',
				gi5DigitStreetCode1: '25630',
				gi5DigitStreetCode2: '45440',
				gi5DigitStreetCode3: '45440',
				gi5DigitStreetCode4: '24050',
				giBoroughCode1: '1',
				giBoroughCode2: '1',
				giBoroughCode3: '1',
				giBoroughCode4: '1',
				giBuildingIdentificationNumber1: '1079043',
				giBuildingIdentificationNumber2: '1079043',
				giBuildingIdentificationNumber3: '1079043',
				giBuildingIdentificationNumber4: '1079043',
				giDcpPreferredLgc1: '01',
				giDcpPreferredLgc2: '01',
				giDcpPreferredLgc3: '01',
				giDcpPreferredLgc4: '01',
				giHighHouseNumber1: '65',
				giHighHouseNumber2: '99',
				giHighHouseNumber3: '105',
				giHighHouseNumber4: '68',
				giLowHouseNumber1: '41',
				giLowHouseNumber2: '85',
				giLowHouseNumber3: '101',
				giLowHouseNumber4: '50',
				giSideOfStreetIndicator1: 'L',
				giSideOfStreetIndicator2: 'L',
				giSideOfStreetIndicator3: 'L',
				giSideOfStreetIndicator4: 'R',
				giStreetCode1: '12563001',
				giStreetCode2: '14544001',
				giStreetCode3: '14544001',
				giStreetCode4: '12405001',
				giStreetName1: 'MAIDEN LANE',
				giStreetName2: 'WILLIAM STREET',
				giStreetName3: 'WILLIAM STREET',
				giStreetName4: 'JOHN STREET',
				healthArea: '7700',
				healthCenterDistrict: '15',
				highBblOfThisBuildingsCondominiumUnits: '1000670001',
				highCrossStreetB5SC1: '145440',
				highCrossStreetCode1: '14544001',
				highCrossStreetName1: 'WILLIAM STREET',
				highHouseNumberOfBlockfaceSortFormat: '000065000AA',
				houseNumber: '59',
				houseNumberIn: '59',
				houseNumberSortFormat: '000059000AA',
				hurricaneEvacuationZone: '5',
				instructionalRegion: 'MS',
				interimAssistanceEligibilityIndicator: 'I',
				internalLabelXCoordinate: '0982037',
				internalLabelYCoordinate: '0197460',
				latitude: 40.708266006244315,
				latitudeInternalLabel: 40.7086585249236,
				legacySegmentId: '0023213',
				lionBoroughCode: '1',
				lionBoroughCodeForVanityAddress: '1',
				lionFaceCode: '3140',
				lionFaceCodeForVanityAddress: '3140',
				lionKey: '1314000030',
				lionKeyForVanityAddress: '1314000030',
				lionSequenceNumber: '00030',
				lionSequenceNumberForVanityAddress: '00030',
				listOf4Lgcs: '01',
				longitude: -74.0082309440472,
				longitudeInternalLabel: -74.00798211500157,
				lowBblOfThisBuildingsCondominiumUnits: '1000670001',
				lowCrossStreetB5SC1: '127100',
				lowCrossStreetCode1: '12710001',
				lowCrossStreetName1: 'NASSAU STREET',
				lowHouseNumberOfBlockfaceSortFormat: '000029000AA',
				lowHouseNumberOfDefiningAddressRange: '000041000AA',
				nta: 'MN25',
				ntaName: 'Battery Park City-Lower Manhattan',
				numberOfCrossStreetB5SCsHighAddressEnd: '1',
				numberOfCrossStreetB5SCsLowAddressEnd: '1',
				numberOfCrossStreetsHighAddressEnd: '1',
				numberOfCrossStreetsLowAddressEnd: '1',
				numberOfEntriesInListOfGeographicIdentifiers: '0004',
				numberOfExistingStructuresOnLot: '0001',
				numberOfStreetFrontagesOfLot: '03',
				physicalId: '0000753',
				policePatrolBoroughCommand: '1',
				policePrecinct: '001',
				returnCode1a: '00',
				returnCode1e: '00',
				roadwayType: '1',
				rpadBuildingClassificationCode: 'O4',
				rpadSelfCheckCodeForBbl: '7',
				sanbornBoroughCode: '1',
				sanbornPageNumber: '011',
				sanbornVolumeNumber: '01',
				sanbornVolumeNumberSuffix: 'S',
				sanitationDistrict: '101',
				sanitationSnowPriorityCode: 'C',
				segmentAzimuth: '302',
				segmentIdentifier: '0023213',
				segmentLengthInFeet: '00460',
				segmentOrientation: '4',
				segmentTypeCode: 'U',
				sideOfStreetIndicator: 'L',
				sideOfStreetOfVanityAddress: 'L',
				splitLowHouseNumber: '000029000AA',
				stateSenatorialDistrict: '26',
				streetName1In: 'MAIDEN',
				streetStatus: '2',
				streetWidth: '22',
				taxMapNumberSectionAndVolume: '10102',
				toLionNodeId: '0015337',
				toPreferredLgcsFirstSetOf5: '01',
				trafficDirection: 'A',
				underlyingStreetCode: '12563001',
				uspsPreferredCityName: 'NEW YORK',
				workAreaFormatIndicatorIn: 'C',
				xCoordinate: '0981968',
				xCoordinateHighAddressEnd: '0982031',
				xCoordinateLowAddressEnd: '0981785',
				xCoordinateOfCenterofCurvature: '0000000',
				yCoordinate: '0197317',
				yCoordinateHighAddressEnd: '0197212',
				yCoordinateLowAddressEnd: '0197601',
				yCoordinateOfCenterofCurvature: '0000000',
				zipCode: '10038'
			},
			accuracy: 0,
			name: '59 Maiden Lane, Manhattan, NY 10038'
		};
		
		this.SHELTERS = [{
			ID:'Q505',
			X:'1038959.20684',
			Y:'197885.084923',
			NAME:'Hillcrest HS',
			ADDRESS:'160-05 Highland Avenue',
			BOROCODE:'4',
			CITY:'Jamaica',
			CROSS1:'Parsons Blvd',
			CROSS2:'162 Street',
			ZIP:'11432',
			ACCESSIBLE:'N',
			ACC_FEAT:''
		},{
			ID:'Q515',
			X:'1033758.24448',
			Y:'207098.497926',
			NAME:'Townsend Harris HS',
			ADDRESS:'149-11 Melbourne Avenue',
			BOROCODE:'4',
			CITY:'Flushing',
			CROSS1:'149 Street',
			CROSS2:'150 Street',
			ZIP:'11367',
			ACCESSIBLE:'Y',
			ACC_FEAT:'The main/accessible entrance to this location for sheltering purposes is on 149th Street (Close to the intersection with Melbourne Avenue)'
		},{
			ID:'Q268',
			X:'1043802.51638',
			Y:'197171.097834',
			NAME:'PS - IS 268',
			ADDRESS:'92-07 175 Street',
			BOROCODE:'4',
			CITY:'Jamaica',
			CROSS1:'Jamaica Avenue',
			CROSS2:'93 Avenue',
			ZIP:'11433',
			ACCESSIBLE:'Y',
			ACC_FEAT:'The main/accessible entrance to this location for sheltering purposes is 92-07 175th Street'
		}];
	},
	afterEach: function(assert){
		delete this.MOCK_GEOCODER;
		delete this.SHELTERS;
		delete this.GEOCODE;
		$('#sheltersList tr').remove();
		$('#address').val('');
		$('#order, #possible, #userAddr, #userZone, #userEvac').empty().hide();
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
	var scopes = [];
	
	window.setInterval = function(fn, ms){
		functions.push(fn[0]);
		scopes.push(fn[1]);
		assert.equal(ms, 600000);
	};
	
	var proxy = $.proxy;
	
	$.proxy = function(fn, scope){
		return [fn, scope];
	};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	assert.equal(functions.length, 2);

	assert.deepEqual(functions[0], app.getOrders);
	assert.deepEqual(functions[1], app.getShelters);
	assert.deepEqual(scopes[0], app);
	assert.deepEqual(scopes[1], app);
	
	nyc311.App.prototype.getOrders = getOrders;
	nyc311.App.prototype.getShelters = getShelters;
	nyc311.App.prototype.found = found;
	nyc311.App.prototype.ambiguous = ambiguous;
	nyc311.App.prototype.geocodeError = geocodeError;
	
	
	window.setInterval = setInterval;
	$.proxy = proxy;
});

QUnit.test('getOrders', function(assert){
	assert.expect(4);
	
	var ajax = $.ajax;
	var proxy = $.proxy;
	
	$.proxy = function(fn, scope){};
	$.ajax = function(args){};

	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	$.ajax = function(args){
		assert.equal(args.url, nyc311.ORDER_URL + 'now');
		assert.deepEqual(args.error, app.loadError);
	};
	
	$.proxy = function(fn, scope){
		assert.deepEqual(fn, app.gotOrders);
		assert.deepEqual(scope, app);
	};

	var getTime = Date.prototype.getTime;
	Date.prototype.getTime = function(){
		return 'now';
	};
	app.getOrders();
	
	$.ajax = ajax;
	$.proxy = proxy;
	Date.prototype.getTime = getTime;
	
});

QUnit.test('gotOrders/getOrderTxt (has orders)', function(assert){
	assert.expect(3);
	
	var done = assert.async();
	
	var test = function(){
		if (app.evOrder) {
			assert.equal(app.evOrder.text, 'An Evacuation Order is in effect for Zones 1, 4 and 6');
			assert.equal($('#order').html(), app.evOrder.text);
			assert.deepEqual(app.evOrder.zones, ['1', '4', '6']);
			done();
		}else{
			setTimeout(test, 100);
		}
		
	};
	var app = new nyc311.App(this.MOCK_GEOCODER);
	test();
});

QUnit.test('gotOrders/getOrderTxt (no orders)', function(assert){
	assert.expect(3);
	
	var done = assert.async();
	
	nyc311.ORDER_URL = 'data/no-order.csv?';

	var test = function(){
		if (app.evOrder) {
			assert.equal(app.evOrder.text, 'There is not an Evacuation Order in effect for any Zone');
			assert.equal($('#order').html(), app.evOrder.text);
			assert.notOk(app.evOrder.zones.length);
			done();
		}else{
			setTimeout(test, 100);
		}
		
	};

	var app = new nyc311.App(this.MOCK_GEOCODER);
	test();
});

QUnit.test('gotShelters', function(assert){
	assert.expect(2);
	
	var done = assert.async();
	
	var expected = this.SHELTERS;
	var listShelters = nyc311.App.prototype.listShelters;
	
	nyc311.App.prototype.listShelters = function(){
		assert.ok(true);
	};
	
	var test = function(){
		if (app.shelters) {
			assert.deepEqual(app.shelters, expected);
			done();
			nyc311.App.prototype.listShelters = listShelters;
		}else{
			setTimeout(test, 100);
		}
	};

	var app = new nyc311.App(this.MOCK_GEOCODER);
	test();
});

QUnit.test('listShelters (w/o distance)', function(assert){
	assert.expect(8);

	var getShelters = nyc311.App.prototype.getShelters;	
	nyc311.App.prototype.getShelters = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);

	app.shelters = this.SHELTERS;
	app.shelterInfo = function(){
		return 'info';
	};
	
	assert.equal($('#sheltersList tr').length, 0);
	
	app.listShelters();
	
	assert.equal($('#sheltersList tr').length, 3);
	assert.equal($($('#sheltersList tr').get(0)).html(), '<td class="dist"></td><td>info</td>');
	assert.equal($($('#sheltersList tr').get(1)).html(), '<td class="dist"></td><td>info</td>');
	assert.equal($($('#sheltersList tr').get(2)).html(), '<td class="dist"></td><td>info</td>');

	assert.equal($('#sheltersList tr').get(0).className, 'evRow');
	assert.equal($('#sheltersList tr').get(1).className, '');
	assert.equal($('#sheltersList tr').get(2).className, 'evRow');
	
	nyc311.App.prototype.getShelters = getShelters;	
});

QUnit.test('listShelters (w distance)', function(assert){
	assert.expect(8);

	var getShelters = nyc311.App.prototype.getShelters;	
	nyc311.App.prototype.getShelters = function(){};
	
	$.each(this.SHELTERS, function(i, s){
		s.distance = i;
	});
	
	var app = new nyc311.App(this.MOCK_GEOCODER);

	app.shelters = this.SHELTERS;
	app.shelterInfo = function(){
		return 'info';
	};
	
	assert.equal($('#sheltersList tr').length, 0);
	
	app.listShelters();
	
	assert.equal($('#sheltersList tr').length, 3);
	assert.equal($($('#sheltersList tr').get(0)).html(), '<td class="dist"><span>0 mi</span><br></td><td>info</td>');
	assert.equal($($('#sheltersList tr').get(1)).html(), '<td class="dist"><span>1 mi</span><br></td><td>info</td>');
	assert.equal($($('#sheltersList tr').get(2)).html(), '<td class="dist"><span>2 mi</span><br></td><td>info</td>');

	assert.equal($('#sheltersList tr').get(0).className, 'evRow');
	assert.equal($('#sheltersList tr').get(1).className, '');
	assert.equal($('#sheltersList tr').get(2).className, 'evRow');
	
	nyc311.App.prototype.getShelters = getShelters;	
});

QUnit.test('shelterInfo', function(assert){
	assert.expect(1);
	
	var app = new nyc311.App(this.MOCK_GEOCODER);

	var info = app.shelterInfo(this.SHELTERS[1]);
	
	assert.equal(info, '<div class="shelterInfo"><div class="name">Townsend Harris HS</div><div class="addr1">149-11 Melbourne Avenue</div><div class="addr2">Flushing, NY 11367</div><div class="accessY"></div></div>');
});


QUnit.test('sortShelters', function(assert){
	assert.expect(4);

	var listShelters = nyc311.App.prototype.listShelters;
	
	nyc311.App.prototype.listShelters = function(){
		assert.ok(true);
	};

	var s0 = this.SHELTERS[0];
	var s1 = this.SHELTERS[1];
	var s2 = this.SHELTERS[2];
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	app.shelters = this.SHELTERS;
	
	app.sortShelters(this.GEOCODE);
	
	assert.equal(app.shelters[0], s1);
	assert.equal(app.shelters[1], s0);
	assert.equal(app.shelters[2], s2);
	
	nyc311.App.prototype.listShelters = listShelters;
});

QUnit.test('distance', function(assert){
	assert.expect(3);
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	assert.equal(app.distance(this.GEOCODE.coordinates, [this.SHELTERS[0].X, this.SHELTERS[0].Y]), 10.78);
	assert.equal(app.distance(this.GEOCODE.coordinates, [this.SHELTERS[1].X, this.SHELTERS[1].Y]), 9.96);
	assert.equal(app.distance(this.GEOCODE.coordinates, [this.SHELTERS[2].X, this.SHELTERS[2].Y]), 11.69);
});

QUnit.test('find', function(assert){
	assert.expect(5);
	
	this.MOCK_GEOCODER.search = function(input){
		assert.equal(input, $('#address').val());
	};
	
	$('#address').val('59 maiden mn');
	$('#possible, #userAddr, #userZone, #userEvac').html('html');

	var app = new nyc311.App(this.MOCK_GEOCODER);

	app.find();
	
	assert.notOk($('#possible').html());
	assert.notOk($('#userAddr').html());
	assert.notOk($('#userZone').html());
	assert.notOk($('#userEvac').html());
});

QUnit.test('doFind', function(assert){
	assert.expect(1);
	
	var app = new nyc311.App(this.MOCK_GEOCODER);

	app.find = function(){
		assert.ok(true);
	};
	
	app.doFind({keyCode: 13});
	app.doFind({keyCode: 10});
});

QUnit.test('found (no zone, has order)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	delete geocode.data.hurricaneEvacuationZone;
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: ['1', '2', '5']};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'The Evacuation Zone for this location cannot be determined - Please try another location');
	assert.equal($('#userEvac').html(), '');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (no zone, no order)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	delete geocode.data.hurricaneEvacuationZone;
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: []};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'The Evacuation Zone for this location cannot be determined - Please try another location');
	assert.equal($('#userEvac').html(), '');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (has zone, has order, requires evac)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: ['1', '2', '5']};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'is located in Evacuation Zone ' + geocode.data.hurricaneEvacuationZone);
	assert.equal($('#userEvac').html(), 'AN EVACUATION ORDER IS IN EFFECT FOR ZONE ' + geocode.data.hurricaneEvacuationZone);
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (has zone, has order, no evac)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: ['1', '2', '3']};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'is located in Evacuation Zone ' + geocode.data.hurricaneEvacuationZone);
	assert.equal($('#userEvac').html(), 'No evacuation order in effect for this zone');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (has zone, no order, no evac)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: []};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'is located in Evacuation Zone ' + geocode.data.hurricaneEvacuationZone);
	assert.equal($('#userEvac').html(), 'No evacuation order in effect for this zone');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (X zone, has order)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	geocode.data.hurricaneEvacuationZone = 'X';
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: ['1', '2', '5']};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'is not located in an Evactuation Zone');
	assert.equal($('#userEvac').html(), '');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('found (X zone, no order)', function(assert){
	assert.expect(6);
	
	var geocode = this.GEOCODE;
	geocode.data.hurricaneEvacuationZone = 'X';
	
	var getOrder = nyc311.App.getOrder;
	nyc311.App.getOrder = function(){};
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.evOrder = {zones: []};
	app.sortShelters = function(location){
		assert.deepEqual(location, geocode);
	};
	
	$('#possible').html('html').show();

	app.found(geocode);
	
	assert.equal($('#userAddr').html(), geocode.name);
	assert.equal($('#userZone').html(), 'is not located in an Evactuation Zone');
	assert.equal($('#userEvac').html(), '');
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	nyc311.App.getOrder = getOrder;
});

QUnit.test('ambiguous (has possibles)', function(assert){
	assert.expect(4);

	var possibles = [];
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	app.find = function(){
		possibles.push($('#address').val());
	};

	$('#address').val('ambiguous input');
	
	app.ambiguous(this.AMBIGUOUS_RESPONSE);
	
	assert.equal($('#possible').html(), '<div class="name">"ambiguous input" was not found.  Please choose from the possible alternatives:</div><br><a href="#">possible0</a><br><a href="#">possible1</a><br>');
	assert.equal($('#possible').css('display'), 'block');
	
	$.each($('#possible a'), function(){
		$(this).trigger('click');
	});
	
	assert.equal(possibles[0], this.AMBIGUOUS_RESPONSE.possible[0].name);
	assert.equal(possibles[1], this.AMBIGUOUS_RESPONSE.possible[1].name);
});

QUnit.test('ambiguous (no possibles)', function(assert){
	assert.expect(4);

	this.AMBIGUOUS_RESPONSE.possible = [];
	
	var possibles = [];
	
	var app = new nyc311.App(this.MOCK_GEOCODER);
	
	app.find = function(){
		possibles.push($('#address').val());
	};
	app.geocodeError = function(){
		assert.ok(true);
	};
	
	$('#address').val('ambiguous input');
	
	app.ambiguous(this.AMBIGUOUS_RESPONSE);
	
	assert.equal($('#possible').html(), '');
	assert.equal($('#possible').css('display'), 'none');
	
	$.each($('#possible a'), function(){
		$(this).trigger('click');
	});
	
	assert.notOk(possibles.length);
});
