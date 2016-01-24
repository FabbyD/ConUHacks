function callInsta() {
	console.log('Instafeed');	
	var feed = new Instafeed({
			get: 'tagged',
			tagName: 'awesome',
			clientId: 'd3eb5b70c04b4356a146d2cf73988aff',
			accessToken: '2739012414.d3eb5b7.c6aaf652d65d4b3e838c233deace95a7'
		});
	
	feed.run();
}