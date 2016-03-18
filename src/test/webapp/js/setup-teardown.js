QUnit.config.requireExpects = true;

function setup(assert, hooks){
		
	hooks.SURFACE_WATER_ZONE = 7;
	
	hooks.FEATURE_DECORATIONS = {
		center: {
			fieldAccessors: {
				getCoordinates: function(){
					var g = this.getGeometry();
					return g ? g.getCoordinates() : null;
				},
				getName: function(){
					return this.get('NAME');
				},
				getAddress: function(){
					return this.getAddress1() + ', ' + this.getAddress2();
				},
				getAddress1: function(){
					return this.get('ADDRESS');
				},
				getCross1: function(){
					return this.get('CROSS1');
				},
				getCross2: function(){
					return this.get('CROSS2');
				},
				getAddress2: function(){
					return this.get('CITY') + ', NY ' + this.get('ZIP');
				},
				isAccessible: function(){
					return this.get('ACCESSIBLE') != 'N';
				},
				getAccessibleFeatures: function(){
					return this.get('ACC_FEAT');
				},
				getDistance: function(){
					return this.get('distance');
				},
				setDistance: function(distance){
					this.set('distance', distance);
				}
			},
			htmlRenderer: {
				html: function(renderFor){
					var id = this.getId(), div = $('<div></div>'), result = $('<div></div>');
					result.append(div);
					div.addClass(renderFor)
						.addClass('inf-center')
						.append(this.message('center_info_field', {css: 'inf-name', value: this.getName()}))
						.append(this.message('center_info_field', {css: 'inf-addr', value: this.getAddress1()}))
						.append(this.message('center_cross_st_field', {cross1: this.getCross1(), cross2: this.getCross2()}))
						.append(this.message('center_info_field', {css: 'inf-addr', value: this.getAddress2()}))
						.append(this.message('center_info_map', {id: id}))
						.append(this.message('center_info_dir', {id: id}));
					this.accessBtn(div, this.getAccessibleFeatures());
					if (this.isAccessible()) div.addClass('access');
					if (!isNaN(this.getDistance()))
						div.prepend(this.message('center_distance', {distance: (this.getDistance() / 5280).toFixed(2)}));
					return result.html();
				},
				accessBtn: function(parent, v){
					if (v){
						parent.append(this.message('center_info_access', {detail: v}));
					}
				}
			}
		},
		zone: {
			fieldAccessors: {
				getZone: function(){
					return this.get('zone');
				},
				isSurfaceWater: function(){
					return this.getZone() == hooks.SURFACE_WATER_ZONE;
				}
			},
			htmlRenderer: {
				html: function(){
					var zone = this.getZone(), 
						evacuate = this.orders[zone],
						order = this.message(evacuate ? 'yes_order' : 'no_order');
					if (!this.isSurfaceWater()){
						return this.message('zone_info', {zone: zone, order: order});				
					}
				}
			}
		}
	};
	
	hooks.MESSAGES = {
		yes_order: '<div class="order active-order">You are required to evacuate</div>',
		no_order: '<div class="order">No evacuation order currently in effect</div>',
		splash_yes_order: '<div class="capitalize inf-name">an evacuation order is in effect for</div>',
		splash_zone_order: '<div class="zone">${zones}</div>',
		location_no_zone: '<div class="inf-location"><div class="inf-name">You are not located in an Evacuation Zone</div><div class="inf-name">${name}</div></div>',
		location_zone_order: '<div class="inf-location"><div class="inf-name">You are located in Zone ${zone}</div>${order}<div class="inf-name">${name}</div></div>',
		location_zone_unkown: '<div class="inf-location"><div class="inf-name">Zone Finder cannot determine Zone for your address.</div><div>Try alternative address or determine Zone by examining map and clicking on your location.</div><div class="inf-name">${name}</div></div>',
		zone_info: '<div class="inf-zone"><div class="inf-name">Zone ${zone}</div>${order}</div>',
		zone_tip: '<div class="capitalize">evacuation zone ${zone}</div><div>${order}</div>',
		center_info_field: '<div class="${css} notranslate" translate="no">${value}</div>',
		center_cross_st_field: '<div class="inf-addr inf-cross">Between <span class="notranslate" translate="no">${cross1}</span> and <span class="notranslate" translate="no">${cross2}</span>',
		center_distance: '<div class="inf-dist">&#8226; ${distance} miles &#8226;</div>',
		center_info_map: '<div class="capitalize inf-btn inf-map"><a data-role="button" onclick=\'nyc.app.zoomFacility("${id}");\'>map</a></div>',
		center_info_dir: '<div class="capitalize inf-btn inf-dir"><a data-role="button" onclick=\'nyc.app.direct("${id}");\'>directions</a></div>',
		center_info_access: '<div class="capitalize inf-btn inf-detail-btn"><a data-role="button" onclick=\'nyc.util.preventDblEventHandler(event, nyc.app.access, nyc.app);\'>details...</a></div><div class="inf-detail">${detail}</div>',
		center_tip: '<div class="${css}">${name}</div>',
		bad_input: 'The location you entered was not uderstood',
		data_load_error: 'There was a problem loading map data. Please refresh the page to try again.',
		copyright: '&copy; ${yr} City of New York'
	};
	
	hooks.TEST_CONTENT = new nyc.Content(hooks.MESSAGES);
	
	hooks.TEST_MAP = (function(){
		var div = $('<div class="test-map"></div>')[0];
		$('body').append(div);
		var map = new ol.Map({
			target: div,
			view: new ol.View({
				projection: 'EPSG:2263',
				resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS
			})
		});
		map.getView().fit(nyc.ol.EXTENT, map.getSize());
		return map;
	}());
	
};

function teardown(assert, hooks){
	delete hooks.SURFACE_WATER_ZONE;
	delete hooks.FEATURE_DECORATIONS;
	delete hooks.MESSAGES;
	delete hooks.TEST_CONTENT;
	
	var div = hooks.TEST_MAP.getTarget();
	delete hooks.TEST_MAP;
	$(div).remove();
};