var timeOffset = 1000 * 60 * 5;
var cacheBust = Math.round(new Date().getTime() / timeOffset) * timeOffset;

function csvContentLoaded(csvContent){
	
	$(document).ready(function(){
	
		var SURFACE_WATER_ZONE = 7,
			GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=A159073974562987C&app_id=hurricane-evac',
			GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization',
			MESSAGES = {
				yes_order: '<div class="order active-order">You are required to evacuate</div>',
				no_order: '<div class="order">No evacuation order currently in effect</div>',
				splash_yes_order: '<div class="capitalize">an evacuation order is in effect for</div>',
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
				bad_input: 'The location you entered was not understood',
				data_load_error: 'There was a problem loading map data. Please refresh the page to try again.',
				trip_planner: 'For directions with information regarding wheelchair accessible subway stations use the <a href="http://tripplanner.mta.info/MyTrip/ui_phone/cp/idefault.aspx" target="_blank">MTA Trip Planner</a>.',
				no_directions: '<span class="capitalize">${travelMode}</span> directions from <b><span class="notranslate" translate="no">${origin}</span></b> to <b><span class="notranslate" translate="no">${destination}</span></b> are not available.  Please try a different mode of transportation.',
				acc_feat: '<ul><li>${ACC_FEAT}</li><li>Access to the main shelter areas will be unobstructed and without steps. </li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots and mobility aids (canes, crutches, manual wheelchairs, storage space for refrigerated medication, etc.).</li></ul>'
			},
			LANGUAGES = {
			    en: {val: 'English', desc: 'English', hint: 'Translate'},
			    ar: {val: 'Arabic', desc: '&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;', hint: '&#x62A;&#x631;&#x62C;&#x645;'},
			    bn: {val: 'Bengali', desc: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
			    'zh-CN': {val: 'Chinese (Simplified)', desc: '&#x4E2D;&#x56FD;', hint: '&#x7FFB;&#x8BD1;'},
			    fr: {val: 'French', desc: 'Fran&#231;ais', hint: 'Traduire'},
			    ht: {val: 'Haitian Creole', desc: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
			    ko: {val: 'Korean', desc: '&#xD55C;&#xAD6D;&#xC758;', hint: '&#xBC88;&#xC5ED;'},
			    ru: {val: 'Russian', desc: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
			    es: {val: 'Spanish', desc: 'Espa&#241;ol', hint: 'Traducir'},
			    ur: {val: 'Urdu', desc: '&#x627;&#x631;&#x62F;&#x648;', hint: '&#x62A;&#x631;&#x62C;&#x645;&#x6C1; &#x6A9;&#x631;&#x6CC;&#x6BA;'}
			},
			FEATURE_DECORATIONS = {
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
							return this.isAccessible() ? this.message('acc_feat', this.getProperties()) : '';
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
							return this.getZone() == SURFACE_WATER_ZONE;
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
		
		var loadingComplete = function(){
			if ($('#splash .orders').html()){
				$('#first-load').fadeOut();			
			}else{
				setTimeout(loadingComplete, 100);
			}
		};
		var lang = new nyc.Lang({target: '#splash-cont', languages: LANGUAGES});
		lang.on(nyc.Lang.EventType.READY, loadingComplete);
		
		new nyc.Share('#map');
		
		var base = new nyc.ol.layer.BaseLayer();
		base.on('postcompose', nyc.ol.layer.grayscale);
		
		var map = new nyc.ol.Basemap({target: $('#map').get(0)});
		
		var style = new nyc.Style();
		
		nyc.app = new nyc.App(
			map,
			FEATURE_DECORATIONS,
			new nyc.Content([csvContent, MESSAGES]),
			style,
			new nyc.LocationMgr({
				controls: new nyc.ol.control.ZoomSearch(map),
				locate: new nyc.ol.Locate(new nyc.Geoclient(GEOCLIENT_URL)),
				locator: new nyc.ol.Locator({map: map})
			}),
			new nyc.Directions('#dir-map', '#directions', GOOGLE_URL),
			new nyc.ol.Popup(map)
		);
	
	});
};

new nyc.CsvContent('data/content.csv?' + cacheBust, csvContentLoaded);