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
		
	hooks.TEST_MAP = (function(){
		var div = $('<div class="test-map"></div>')[0];
		$('body').append(div);
		var map = new nyc.ol.Basemap({target: div});
		return map;
	}());
	
};

function teardown(assert, hooks){
	delete hooks.SURFACE_WATER_ZONE;
	delete hooks.FEATURE_DECORATIONS;
	delete hooks.MESSAGES;
	
	var div = hooks.TEST_MAP.getTarget();
	delete hooks.TEST_MAP;
	$(div).remove();
};