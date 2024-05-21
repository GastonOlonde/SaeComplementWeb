<template>
  <h1>Cartographie</h1>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'CartographieView',
  mounted() {
    const map = L.map('map').setView([48.8534, 2.3488], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'}).addTo(map);
    
    L.marker([49.871144, 2.2641492]).addTo(map)
    .bindPopup('L\'iut magueule')
    .openPopup();
  }
}
</script>

<style scoped>
#map { height: 80vh; }
</style>