/** @public */
window.nyc = window.nyc || {};

/**
 * @desc A class to manage hurricane evacuation messages
 * @public
 * @class
 * @extends {nyc.Content}
 * @constructor
 * @param {Object<string, string>|Array<Object<string, string>>} messages The messages with optional tokens mapped by message id
 */
nyc.HurricaneContent = function(messages){
	nyc.Content.call(this, messages);
};

nyc.HurricaneContent.prototype = {
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {string} An HTML message
	 */
	locationMsg: function(location){
		var zone = location.data ? location.data.hurricaneEvacuationZone : null,
			name = location.name.replace(/,/, '<br>'), 
			html;
		if (zone){
			if (zone == nyc.NO_ZONE) {
				html = this.message('location_no_zone', {
					name: name, 
					oem_supplied: this.message('user_in_x_zone')
				});
			}else{
				html = this.message('location_zone_order', { 
					order: this.zoneMsg(zone), 
					name: name, 
					oem_supplied: this.message('user_zone', {zone: zone})
				});			
			}
		}
		return html;
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} zone
	 * @return {string}
	 */
	zoneMsg: function(zone){
		if (this.zoneOrders[zone]){
			return this.message('yes_order', {
				oem_supplied: this.message('evac_order')
			});
		}else{
			return this.message('no_order', {
				oem_supplied: this.message('no_evac_order')
			});
		}
	}
};

nyc.inherits(nyc.HurricaneContent, nyc.Content);
