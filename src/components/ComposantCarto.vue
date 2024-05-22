<template>
  <h1>Cartographie</h1>
  <div id="map"></div>
  <button @click="centerMap">Centrer sur moi</button>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster'; // Importer le plugin de clustering
import 'leaflet/dist/leaflet.css'; // Importer les styles de Leaflet
import 'leaflet.markercluster/dist/MarkerCluster.css'; // Importer les styles du cluster
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Importer les styles par défaut du cluster
import axios from 'axios';

export default {
  setup() {
    const map = ref(null);
    const markers = ref(null);
    const markerIds = ref(new Set());

    onMounted(() => {
      map.value = L.map('map').setView([48.8534, 2.3488], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);

      // Initialiser le groupe de clusters
      markers.value = L.markerClusterGroup(
        {
          disableClusteringAtZoom: 16, // Désactiver le clustering à partir du niveau de zoom 16
          maxClusterRadius: 50, // Rayon maximum du cluster en pixels
        }
      );
      map.value.addLayer(markers.value);

      // Ajouter les écouteurs d'événements
      map.value.on('moveend', throttle(loadMarkers, 3000)); // Throttle les requêtes
      map.value.on('zoomend', throttle(loadMarkers, 3000)); // Throttle les requêtes

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
      if (markers.value) {
        markers.value.clearLayers();
        markerIds.value.clear();
      }
    };

    const addMarker = (lat, lng, popupText, id = null) => {
      if (markers.value && (id === null || !markerIds.value.has(id))) {
        const marker = L.marker([lat, lng]).bindPopup(popupText);
        markers.value.addLayer(marker);
        if (id !== null) {
          markerIds.value.add(id);
        }
      }
    };

    const loadedMarkers = ref(new Set());

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

      // Ajouter le premier lot de marqueurs
      response.data.data.forEach(item => {
        const lng = item.attributes.X;
        const lat = item.attributes.Y;
        const id = item.id;
        if (!loadedMarkers.value.has(id)) {
          addMarker(lat, lng, `Element ID: ${id} Lat : ${lat} Lng : ${lng}`, id);
          loadedMarkers.value.add(id);
        }
      });

      // Charger les pages supplémentaires si nécessaire
      for (let page = 2; page <= totalPages; page++) {
        const url = `${baseUrl}&pagination[page]=${page}&pagination[pageSize]=100`;
        const additionalResponse = await axios.get(url);
        additionalResponse.data.data.forEach(item => {
          const lng = item.attributes.X;
          const lat = item.attributes.Y;
          const id = item.id;
          if (!loadedMarkers.value.has(id)) {
            addMarker(lat, lng, `Element ID: ${id} Lat : ${lat} Lng : ${lng}`, id);
            loadedMarkers.value.add(id);
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de l\'API:', error);
    }
  }
};


    const throttle = (func, delay) => {
      let lastCall = 0;
      return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        return func(...args);
      };
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
