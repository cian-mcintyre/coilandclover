
	function initMap() {
		var options = {
			zoom: 10,
			center: {lat: 53.323766, lng: -6.340310}, 
      styles: [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "geometry.stroke",
          stylers: [{ color: "#dcd2be" }],
        },
        
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ae9e90" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#93817c" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#a5b076" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#447530" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#f5f1e6" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#fdfcf8" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#f8c967" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e9bc62" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry",
          stylers: [{ color: "#e98d58" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry.stroke",
          stylers: [{ color: "#db8555" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#806b63" }],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8f7d77" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ebe3cd" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#29AFB0" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#29AFB0" }],
        },
      ]}

		
		var map = new google.maps.Map(document.getElementById('mapBox'), options);
	
		// Array of dealership info
		var dealerships = [
			{lat: 53.276575, lng: -6.155940, name: "Mercedes-Benz MSL Grange Motors, Deansgrange"},
			{lat: 53.370717, lng: -6.315604, name: "MSL Park Motors"},
			{lat: 53.333155, lng: -6.234673, name: "Mercedes-Benz MSL Ballsbridge Motors"}
		];

		//loop
		for (var i = 0; i < dealerships.length; i++) {
			var dealer = dealerships[i];

			
			var marker = new google.maps.Marker({
				position: {lat: dealer.lat, lng: dealer.lng},
				map: map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        },
			});

			// info window
			var infowindow = new google.maps.InfoWindow({
				content: dealer.name
			});

			
			marker.addListener('click', (function(marker, infowindow) {
				return function() {
					infowindow.open(map, marker);
				}
			})(marker, infowindow));
		}
	}
