# NYC Hurricane Evacuation Zone Finder

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

* The ```center.json``` file included is a snapshot of the evacuation center data for development use only.
* The ```zone.json``` file included is a snapshot of the evacuation zone data for development use only.
* The ```order.json``` file included is sample evacuation order data for development use only.
* In production ```center.json```, ```zone.json``` and ```order.json``` may change without notice and are regularly cached at a CDN.

## Geocoding:
* To use ```nyc.Geoclient``` as the implementation of ```nyc.Geocoder``` you must first get your Geoclient App ID and App Key from the NYC Developer Portal [https://developer.cityofnewyork.us/api/geoclient-api](https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
  * Set ```hurricane.local.geoclient.url='//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID'``` in ```$GRADLE_USER_HOME/gradle.properties```
	
## Building and Deploying to NYC DoITT GIS environments:
* The following properties should be set in ```$GRADLE_USER_HOME/gradle.properties```
	* __File location properties:__
		* ```archive.dir``` - the location on the remote server to store the zipped application
		* ```mobile.dir``` - the deployment directory for mobile friendly HTML5 apps 
	* __Development environment properties:__
		* ```dev.host``` - the name of the dev server you wish to deploy to 
		* ```dev.user``` - the user on the dev server you wish to use to execute deployment commands
		* ```dev.basemap.urls``` - the basemap URLs for a dev deployment 
		* ```hurricane.dev.geoclient.url``` - the Geoclient URL for a dev deployment
		* ```hurricane.dev.google.url``` - the Google URL for a dev deployment
	* __Staging environment properties:__
		* ```stg.host``` - the name of the stg server you wish to deploy to 
		* ```stg.user``` - the user on the stg server you wish to use to execute deployment commands
		* ```stg.basemap.urls``` - the basemap URLs for a stg deployment 
		* ```hurricane.stg.geoclient.url``` - the Geoclient URL for a stg deployment
		* ```hurricane.stg.google.url``` - the Google URL for a stg deployment
	* __Production environment properties:__
		* ```prd.host``` - the name of the prd server you wish to deploy to 
		* ```prd.user``` - the user on the prd server you wish to use to execute deployment commands
		* ```prd.basemap.urls``` - the basemap URLs for a prd deployment 
		* ```hurricane.prd.geoclient.url``` - the Geoclient URL for a prd deployment
		* ```hurricane.prd.google.url``` - the Google URL for a prd deployment
* __Building the application:__
	* Use ```gradle -Penv=dev buildApp``` to build for gis dev environment
	* Use ```gradle -Penv=stg buildApp``` to build for gis stg environment
	* Use ```gradle -Penv=prd buildApp``` to build for gis prd environment
* __Deploying the application:__
	* Use ```gradle -Penv=dev deploy``` to build and deploy to gis dev environment
	* Use ```gradle -Penv=stg deploy``` to build and deploy to gis stg environment
	* Use ```gradle -Penv=prd deploy``` to build and deploy to gis prd environment

