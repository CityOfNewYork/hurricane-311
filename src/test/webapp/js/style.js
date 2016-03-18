QUnit.module('nyc.Style', {
	beforeEach: function(assert){
		setup(assert, this);
		window.TEST_ZONES = [1, 2, 3, 4, 5, 6, 7];
		this.IS_IE = nyc.util.isIe;
		this.IS_IOS = nyc.util.isIos;
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete window.TEST_ZONES;
		nyc.util.isIe = this.IS_IE;
		nyc.util.isIos = this.IS_IOS;
	}
});

QUnit.test('zoom', function(assert){
	assert.expect(24);

	var style = new nyc.Style();
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[0]), 0);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[0] + 1), 0);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[0] - 1), 1);

	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[1]), 1);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[1] + 1), 1);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[2]), 2);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[2] + 1), 2);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[3]), 3);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[3] + 1), 3);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[4]), 4);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[4] + 1), 4);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[5]), 5);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[5] + 1), 5);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[6]), 6);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[6] + 1), 6);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[7]), 7);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[7] + 1), 7);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[8]), 8);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[8] + 1), 8);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[9]), 9);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[9] + 1), 9);
	
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[10]), 10);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[10] + 1), 9);
	assert.equal(style.zoom(nyc.ol.layer.BaseLayer.RESOLUTIONS[10] - 1), 10);
	
});

QUnit.test('locationStyle (not IE)', function(assert){
	assert.expect(23);
	
	nyc.util.isIe = function(){
		return false;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.svg');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		var locationStyle = style.locationStyle(feature, resolution);
		assert.deepEqual(locationStyle, [new ol.style.Style({
			image: new ol.style.Icon({
				scale: 48 / 512,
				src: 'img/me0.svg',
				offset: [0, 24]
			})
		})]);
		assert.deepEqual(locationStyle, style.locationCache[i]);
	});
});

QUnit.test('locationStyle (not IE, is iOS)', function(assert){
	assert.expect(23);
	
	nyc.util.isIe = function(){
		return false;
	};
	nyc.util.isIos = function() {
		return true;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.svg');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		var locationStyle = style.locationStyle(feature, resolution);
		assert.deepEqual(locationStyle, [new ol.style.Style({
			image: new ol.style.Icon({
				scale: 48 / 512,
				src: 'img/me0.svg'
			})
		})]);
		assert.deepEqual(locationStyle, style.locationCache[i]);
	});
});

QUnit.test('locationStyle (IE)', function(assert){
	assert.expect(23);

	nyc.util.isIe = function(){
		return true;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.png');
	
	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		var locationStyle = style.locationStyle(feature, resolution);
		assert.deepEqual(locationStyle, [new ol.style.Style({
			image: new ol.style.Icon({
				scale: 48 / 512,
				src: 'img/me0.png',
				offset: [0, 24]
			})
		})]);
		assert.deepEqual(locationStyle, style.locationCache[i]);
	});
});

QUnit.test('locationStyle (cached)', function(assert){
	assert.expect(11);

	nyc.util.isIe = function(){
		return false;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style(true);
	
	//seed the cache
	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		style.locationCache[i] = 'zoom' + i;
	});
	
	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		var locationStyle = style.locationStyle(feature, resolution);
		assert.equal(locationStyle, 'zoom' + i);
	});
});

QUnit.test('centerStyle (not IE, not accessible)', function(assert){
	assert.expect(23);
	var radii = [8, 8, 8, 12, 12, 12, 16, 16, 16, 16, 16];
	
	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.svg');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return false;};
		
		var radius = radii[i];
		var centerStyle = style.centerStyle(feature, resolution);
		assert.deepEqual(centerStyle, [new ol.style.Style({
			image: new ol.style.Circle({
				radius: radius,
				fill: new ol.style.Fill({color: '#085095'}),
				stroke: new ol.style.Stroke({color: 'white', width: radius < 12 ? 1.5 : 2})
			})
		})]);
		assert.deepEqual(centerStyle, style.centerCache[i]['false']);
	});
});

QUnit.test('centerStyle (not IE, is accessible)', function(assert){
	assert.expect(23);
	var radii = [8, 8, 8, 12, 12, 12, 16, 16, 16, 16, 16];
	
	nyc.util.isIe = function(){
		return false;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.svg');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return true;};
		
		var radius = radii[i];
		var centerStyle = style.centerStyle(feature, resolution);
		assert.deepEqual(centerStyle, [
           new ol.style.Style({
				image: new ol.style.Circle({
					radius: radius,
					fill: new ol.style.Fill({color: '#085095'}),
					stroke: new ol.style.Stroke({color: 'white', width: radius < 12 ? 1.5 : 2})
				})
			}),
			new ol.style.Style({
				image: new ol.style.Icon({
					scale: radius / 128,
					src: 'img/access0.svg'
				})
			})
		]);
		assert.deepEqual(centerStyle, style.centerCache[i]['true']);
	});
});

QUnit.test('centerStyle (IE, not accessible)', function(assert){
	assert.expect(23);
	var radii = [8, 8, 8, 12, 12, 12, 16, 16, 16, 16, 16];
	
	nyc.util.isIe = function(){
		return true;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.png');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return false;};
		
		var radius = radii[i];
		var centerStyle = style.centerStyle(feature, resolution);
		assert.deepEqual(centerStyle, [new ol.style.Style({
			image: new ol.style.Circle({
				radius: radius,
				fill: new ol.style.Fill({color: '#085095'}),
				stroke: new ol.style.Stroke({color: 'white', width: radius < 12 ? 1.5 : 2})
			})
		})]);
		assert.deepEqual(centerStyle, style.centerCache[i]['false']);
	});
});

QUnit.test('centerStyle (IE, is accessible)', function(assert){
	assert.expect(23);
	var radii = [8, 8, 8, 12, 12, 12, 16, 16, 16, 16, 16];
	
	nyc.util.isIe = function(){
		return true;
	};
	nyc.util.isIos = function() {
		return false;
	};

	var style = new nyc.Style();

	assert.equal(style.imgExt(), '.png');

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return true;};
		
		var radius = radii[i];
		var centerStyle = style.centerStyle(feature, resolution);
		assert.deepEqual(centerStyle, [
           new ol.style.Style({
				image: new ol.style.Circle({
					radius: radius,
					fill: new ol.style.Fill({color: '#085095'}),
					stroke: new ol.style.Stroke({color: 'white', width: radius < 12 ? 1.5 : 2})
				})
			}),
			new ol.style.Style({
				image: new ol.style.Icon({
					scale: radius / 128,
					src: 'img/access0.png'
				})
			})
		]);
		assert.deepEqual(centerStyle, style.centerCache[i]['true']);
	});
});

QUnit.test('centerStyle (cached)', function(assert){
	assert.expect(22);

	var style = new nyc.Style(true);
	
	//seed the cache
	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		style.centerCache[i] = style.centerCache[i] || {};
		style.centerCache[i]['true'] = 'zoom-true' + i;
		style.centerCache[i]['false'] = 'zoom-false' + i;
	});
	
	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return true;}
		var locationStyle = style.centerStyle(feature, resolution);
		assert.equal(locationStyle, 'zoom-true' + i);
	});

	$.each(nyc.ol.layer.BaseLayer.RESOLUTIONS, function(i, resolution){
		var feature = new ol.Feature();
		feature.isAccessible = function(){return false;}
		var locationStyle = style.centerStyle(feature, resolution);
		assert.equal(locationStyle, 'zoom-false' + i);
	});
});

QUnit.test('zoneStyle', function(assert){ 
	assert.expect(14);
	var thisTest = this;

	var style = new nyc.Style();

	$.each(TEST_ZONES, function(_, zone){
		var feature = new ol.Feature();
		feature.isSurfaceWater = function(){
			return zone == thisTest.SURFACE_WATER_ZONE;
		};
		feature.getZone = function(){return zone;};
		var zoneStyle = style.zoneStyle(feature, NaN);
		if (feature.isSurfaceWater()){
			assert.notOk(zoneStyle);
		}else{
			assert.deepEqual(zoneStyle, [new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgb(' + style.zoneColors[zone] + ')'
				})
			})]);
		}
		assert.deepEqual(zoneStyle, style.zoneCache[zone]);
	});
});

QUnit.test('zoneStyle (cached)', function(assert){ 
	assert.expect(7);
	var thisTest = this;

	var style = new nyc.Style();

	//seed the cache
	$.each(TEST_ZONES, function(_, zone){
		if (zone != thisTest.SURFACE_WATER_ZONE){
			style.zoneCache[zone] = 'zone' + zone;
		}
	});
	
	$.each(TEST_ZONES, function(_, zone){
		var feature = new ol.Feature();
		feature.isSurfaceWater = function(){
			return zone == thisTest.SURFACE_WATER_ZONE;
		};
		feature.getZone = function(){return zone;};
		var zoneStyle = style.zoneStyle(feature, NaN);
		if (feature.isSurfaceWater()){
			assert.notOk(zoneStyle);
		}else{
			assert.equal(zoneStyle, 'zone' + zone);
		}
	});
});


