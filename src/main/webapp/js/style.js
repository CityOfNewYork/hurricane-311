/** @export */
window.nyc = window.nyc || {};

nyc.ol.style.LOCATION_ICON = new ol.style.Icon({
	scale: 48 / 512,
	src: nyc.util.isIe() || nyc.util.isIos() ? 'img/me.png' : 'img/me.svg'
});

/** @export */
nyc.Style = (function(){	
	/** 
	 * @constructor  
	 */
	var styleClass = function(){
		this.zoneCache = {};
		this.centerCache = {};
	};
	
	styleClass.prototype = {
		zoneColors: {'1': [231, 86, 36], '2': [242, 133, 35], '3': [251, 237, 48], '4': [185, 212, 49], '5': [126, 195, 74], '6': [18, 147, 122]},
		zoneCache: null,
		centerCache: null,
		locationCache: null,
		imgExt: function(){
			return nyc.util.isIe() ? '.png' : '.svg';
		},
		/**
		 * @desc Return the sizeIndex for a resolution 
		 * @public
		 * @method
		 * @param {number} resolution The resolution of the map view
		 * @return {number} 
		 */
		sizeIndex: function(resolution){
			return nyc.ol.TILE_GRID.getZForResolution(resolution) - 8;
		},
		zoneStyle: function(feature, resolution){
			var zone = feature.getZone();
			if (!this.zoneCache[zone] && !feature.isSurfaceWater()){
				this.zoneCache[zone] = [new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgb(' + this.zoneColors[zone] + ')'
					})
				})];
			}
			return this.zoneCache[zone];
		},
		centerStyle: function(feature, resolution){
			var sizeIndex = this.sizeIndex(resolution),
				access = feature.isAccessible(),
				radius = [8, 8, 8, 12, 12, 12, 16, 16, 16, 16, 16, 20, 20, 20][sizeIndex],
				image = 'img/access0' + this.imgExt();
			this.centerCache[sizeIndex] = this.centerCache[sizeIndex] || {};
			if (!this.centerCache[sizeIndex][access]){
				this.centerCache[sizeIndex][access] = [new ol.style.Style({
					image: new ol.style.Circle({
						radius: radius,
						fill: new ol.style.Fill({color: '#085095'}),
						stroke: new ol.style.Stroke({color: 'white', width: radius < 12 ? 1.5 : 2})
					})
				})];
				if (access){
					this.centerCache[sizeIndex][access].push(new ol.style.Style({
						image: new ol.style.Icon({
							scale: radius / 128,
							src: image
						})
					}));
				}
			}
			return this.centerCache[sizeIndex][access];
		}
	};

	return styleClass;
}());
