<template>
  <h1>Cartographie</h1>
  <div id="map"></div>
  <button @click="centerMap">Centrer sur moi</button>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import axios from 'axios';

export default {
  setup() {
    const map = ref(null);
    const markers = ref([]);
    const markerIds = ref(new Set());

    onMounted(() => {
      map.value = L.map('map').setView([48.8534, 2.3488], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);

      // Ajout des écouteurs d'événements
      map.value.on('moveend', loadMarkers);
      map.value.on('zoomend', loadMarkers);

      // Charger les marqueurs initiaux
      loadMarkers();
    });

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.off('moveend', loadMarkers);
        map.value.off('zoomend', loadMarkers);
        map.value.remove();
        map.value = null;
      }
    });

    const centerMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          if (map.value) {
            map.value.setView([latitude, longitude], 12);
            addMarker(latitude, longitude, 'Vous êtes ici');
          }
        }, (error) => {
          console.error(error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const clearMarkers = () => {
      if (map.value) {
        markers.value.forEach(marker => {
          map.value.removeLayer(marker);
        });
        markers.value = [];
        markerIds.value.clear();
      }
    };

    const addMarker = (lat, lng, popupText, id = null) => {
      if (map.value && (id === null || !markerIds.value.has(id))) {
        const marker = L.marker([lat, lng])
          .addTo(map.value)
          .bindPopup(popupText);
        markers.value.push(marker);
        if (id !== null) {
          markerIds.value.add(id);
        }
      }
    };

    const loadMarkers = async () => {
      if (map.value) {
        const bounds = map.value.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        const minLat = southWest.lat;
        const maxLat = northEast.lat;
        const minLng = southWest.lng;
        const maxLng = northEast.lng;

        const baseUrl = `http://localhost:1337/api/saes?filters[X][$lte]=${maxLng}&filters[X][$gte]=${minLng}&filters[$and][0][Y][$lte]=${maxLat}&filters[$and][0][Y][$gte]=${minLat}`;
        const firstRequest = `${baseUrl}&pagination[page]=1&pagination[pageSize]=100`;

        try {
          const response = await axios.get(firstRequest);
          const totalPages = response.data.meta.pagination.pageCount;

          // Add initial batch of markers
          response.data.data.forEach(item => {
            const lat = item.attributes.X;
            const lng = item.attributes.Y;
            const id = item.id;
            addMarker(lat, lng, `Element ID: ${id}`, id);
          });

          // Load additional pages if necessary
          for (let page = 2; page <= totalPages; page++) {
            const url = `${baseUrl}&pagination[page]=${page}&pagination[pageSize]=100`;
            const additionalResponse = await axios.get(url);
            additionalResponse.data.data.forEach(item => {
              const lat = item.attributes.X;
              const lng = item.attributes.Y;
              const id = item.id;
              addMarker(lng, lat, `Element ID: ${id}`, id);
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des éléments de l\'API:', error);
        }
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