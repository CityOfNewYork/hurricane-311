var timeOffset = 1000 * 60 * (document.location.href.indexOf('311') > -1 ? 1 : 5);
nyc.cacheBust = Math.round(new Date().getTime() / timeOffset) * timeOffset;

function csvContentLoaded(csvContent){
	
	$(document).ready(function(){
		var GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID',
			GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization',
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
							return this.get('OEM_LABEL');
						},
						getAddress: function(){
							return this.getAddress1() + ', ' + this.getAddress2();
						},
						getAddress1: function(){
							return this.get('BLDG_ADD');
						},
						getCross1: function(){
							return this.get('CROSS1');
						},
						getCross2: function(){
							return this.get('CROSS2');
						},
						getAddress2: function(){
							return this.get('CITY') + ', NY ' + this.get('ZIP_CODE');
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
							return this.getZone() == nyc.SURFACE_WATER_ZONE;
						}
					},
					htmlRenderer: {
						html: function(){
							var zone = this.getZone();
							if (!this.isSurfaceWater()){
								return this.message('zone_info', {zone: zone, order: this.zoneMsg(zone)});				
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
		
		new nyc.App(
			map,
			FEATURE_DECORATIONS,
			new nyc.HurricaneContent([csvContent, MESSAGES]),
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

new nyc.CsvContent('data/content.csv?' + nyc.cacheBust, csvContentLoaded);