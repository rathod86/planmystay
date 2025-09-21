// Globals expected from template:
//   window.MAP_TOKEN
//   window.LISTING_COORDS  -> [lng, lat] or null
//   window.LISTING_TITLE

mapboxgl.accessToken = '' + (window.MAP_TOKEN || '');

const defaultCenter = Array.isArray(window.LISTING_COORDS) && window.LISTING_COORDS.length === 2
  ? window.LISTING_COORDS
  : [77.2090, 28.6139]; // Fallback: New Delhi [lng, lat]

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: defaultCenter,
  zoom: 11
});

// Add controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

// Add listing marker if coords available
if (Array.isArray(window.LISTING_COORDS) && window.LISTING_COORDS.length === 2) {
  new mapboxgl.Marker({ color: '#0d6efd' })
    .setLngLat(window.LISTING_COORDS)
    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${window.LISTING_TITLE || 'Listing'}</strong>`))
    .addTo(map);
}

// Geolocation: show user's current position and coordinates
const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true,
  showUserHeading: true
});
map.addControl(geolocate);

geolocate.on('geolocate', (e) => {
  const lng = e.coords.longitude;
  const lat = e.coords.latitude;
  const coordsText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  const infoEl = document.getElementById('live-coords');
  if (infoEl) {
    infoEl.textContent = coordsText;
  }
});

// Button to center map on current location
const locateBtn = document.getElementById('btn-current-location');
if (locateBtn) {
  locateBtn.addEventListener('click', () => geolocate.trigger());
}
