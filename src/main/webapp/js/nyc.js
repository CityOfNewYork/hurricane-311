if (typeof String.prototype.trim != "function") {
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, "");
	};
};

/**
 * @public
 */
window.nyc = window.nyc || {};

/**
 * @desc The zone designation of surface waters
 * @public
 * @const {string}
 */
nyc.SURFACE_WATER_ZONE = '7';
/**
 * @desc The zone designation of unaffected upland areas
 * @public
 * @const {string}
 */
nyc.NO_ZONE = 'X';
