mapboxgl.accessToken =
      "pk.eyJ1IjoiZW5oZGxlc3MiLCJhIjoiY204ODBjcDNxMGt0YTJpcHFjZHBjdTh3OSJ9.6tKsfCJRlqU9nuSbZyS9bg";

const TARGET = TARGET_LOCATIONS.find(loc => loc.name === "Manhattan East Village")
const map = new mapboxgl.Map({
  container: 'map',
  style: "mapbox://styles/mapbox/light-v10",
  center: [TARGET.lon, TARGET.lat],
  zoom: 13
});


map.on("load", () => {
  map.addLayer({
    id: "isoLayer",
    type: "fill",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: TARGET_LOCATIONS.flatMap(loc => loc.isochrone.features)
      }
    },
    paint: {
      "fill-color": "red",
      "fill-opacity": 0.3
    }
  });

  map.addLayer({
    id: "traderJoesIsochrones",
    type: "fill",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: TRADER_JOES_LOCATIONS.flatMap(loc => loc.isochrone.features)
      },
    },
    paint: {
      "fill-color": "blue",
      "fill-opacity": 0.3
    }
  });
});

TARGET_LOCATIONS.forEach((place) =>
  new mapboxgl.Marker({ color: "red" })
    .setLngLat([place.lon, place.lat])
    .addTo(map)
);

TRADER_JOES_LOCATIONS.forEach((place) =>
  new mapboxgl.Marker({ color: "blue" })
    .setLngLat([place.lon, place.lat])
    .addTo(map)
);


// SUBWAY LINES
// from https://github.com/chriswhong/mapboxgl-nyc-subway/blob/master/js/scripts.js
map.on('style.load', () => {
    // add geojson sources for subway routes and stops
  map.addSource('nyc-subway-routes', {
    type: 'geojson',
    data: 'subway-data/nyc-subway-routes.geojson'
  });

  map.addSource('nyc-subway-stops', {
    type: 'geojson',
    data: 'subway-data/nyc-subway-stops.geojson'
  });

  // add layers by iterating over the styles in the array defined in subway-layer-styles.js
  subwayLayerStyles.forEach((style) => {
    map.addLayer(style)
  })
});



// FETCH DATA
// async function getIso(lon, lat, id) {
//   const urlBase = "https://api.mapbox.com/isochrone/v1/mapbox/";
//   const profile = "walking";
//   const minutes = 5;
//   const query = await fetch(
//     `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
//     { method: "GET" }
//   );
//   const data = await query.json();
//   // console.log(data);
//   return data;
// }
// Promise.all(TRADER_JOES_LOCATIONS.map(loc => getIso(loc.lon, loc.lat)))
//   .then((values) => {
//     for (let i = 0; i < TRADER_JOES_LOCATIONS.length; i++) {
//       TRADER_JOES_LOCATIONS[i].isochrone = values[i]
//     }
//     console.log(TRADER_JOES_LOCATIONS)
//   })
