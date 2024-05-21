<template>
  <h1>Cartographie</h1>
  <div id="map"></div>
  <button @click="centerMap">Centrer sur moi</button>
</template>

<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';

export default {
  setup() {
    const map = ref(null);

    onMounted(() => {
      map.value = L.map('map').setView([48.8534, 2.3488], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);

      L.marker([49.871144, 2.2641492]).addTo(map.value)
        .bindPopup('L\'iut magueule')
        .openPopup();
    });

    const centerMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          map.value.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              map.value.removeLayer(layer);
            }
          });
          map.value.setView([latitude, longitude], 12);
          L.marker([latitude, longitude])
            .addTo(map.value)
            .bindPopup('Vous êtes ici')
            .openPopup();
          //centrer
        }, (error) => {
          console.error(error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    

    return {
      centerMap
    };
  }
};


</script>

<style scoped>
#map { 
  height: 60vh;
  width: 80%;
  margin: 0 auto;
}
</style>