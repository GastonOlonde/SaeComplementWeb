<template>
  <h1>Cartographie</h1>
  <div id="map"></div>
  <div id="div_options">
    <button id="center_me" @click="centerMap">Centrer sur moi</button>
    <div id="research">
      <input id="search_input" type="text" v-model="searchQuery" placeholder="Entrez une adresse ou des coordonnées">
      <button id="search_button" @click="searchLocation">Rechercher</button>
    </div>
  </div>
  
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import { icon } from 'leaflet';

export default {
  setup() {
    const map = ref(null);
    const markers = ref(null);
    const markerIds = ref(new Set());
    const routeLayer = ref(null);
    const userMarker = ref(null);
    const searchQuery = ref('');
    const searchMarker = ref(null);

    const userIcon = L.icon({
      iconUrl: '/position_red.png',
      iconSize: [70, 70],
      iconAnchor: [19, 38],
      popupAnchor: [15, -15]
    });

    const searchIcon = L.icon({
      iconUrl: '/position_green.png',
      iconSize: [70, 70],
      iconAnchor: [19, 38],
      popupAnchor: [15, -15]
    });

    onMounted(() => {
      map.value = L.map('map').setView([49.8710245, 2.2639386], 12);
      map.marker = L.marker([49.8710245, 2.2639386], {icon: userIcon}).addTo(map.value);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);

      markers.value = L.markerClusterGroup({
        disableClusteringAtZoom: 50,
        maxClusterRadius: 70,
      });
      map.value.addLayer(markers.value);

      map.value.on('moveend', throttle(loadMarkers, 3000));
      map.value.on('zoomend', throttle(loadMarkers, 3000));

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

            if (userMarker.value) {
              userMarker.value.setLatLng([latitude, longitude]);
            } else {
              userMarker.value = L.marker([latitude, longitude], { icon: userIcon }).addTo(map.value);
              userMarker.value.on('click', async (e) => {
                const { lat, lng } = e.latlng;
                const address = await getGeocodingData(lat, lng);
                userMarker.value.bindPopup(`${address}`).openPopup();
              });
            }
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

    const addMarker = async (lat, lng, popupText, id = null) => {
      if (markers.value && (id === null || !markerIds.value.has(id))) {
        const marker = L.marker([lat, lng]);
        marker.bindPopup(`
          <button onclick="getItinerary(${lat}, ${lng})">Itinéraire</button>
        `);
        marker.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          const address = await getGeocodingData(lat, lng);
          marker.bindPopup(`
            ${address}<br>
            <button onclick="getItinerary(${lat}, ${lng})">Itinéraire</button>
          `).openPopup();
        });
        markers.value.addLayer(marker);
        if (id !== null) {
          markerIds.value.add(id);
        }
      }
    };

    const getGeocodingData = (lat, lng) => {
      return new Promise((resolve, reject) => {
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=fb0f32f0d7984466b39ed240f169d182`;
        axios.get(apiUrl)
          .then(response => {
            if (response.data && response.data.results && response.data.results.length > 0) {
              resolve(response.data.results[0].formatted);
            } else {
              resolve('Adresse non trouvée');
            }
          })
          .catch(error => {
            reject(error);
          });
      });
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

          response.data.data.forEach(item => {
            const lng = item.attributes.X;
            const lat = item.attributes.Y;
            const id = item.id;
            if (!loadedMarkers.value.has(id)) {
              addMarker(lat, lng, `Element ID: ${id} Lat : ${lat} Lng : ${lng}`, id);
              loadedMarkers.value.add(id);
            }
          });

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

    const getItinerary = (lat, lng) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;

          const routeUrl = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${lng},${lat}?overview=full&geometries=geojson`;

          try {
            const response = await axios.get(routeUrl);
            const route = response.data.routes[0].geometry;

            if (routeLayer.value) {
              map.value.removeLayer(routeLayer.value);
            }

            routeLayer.value = L.geoJSON(route).addTo(map.value);
            map.value.fitBounds(routeLayer.value.getBounds());
          } catch (error) {
            console.error('Erreur lors de la récupération de l\'itinéraire:', error);
          }
        }, (error) => {
          console.error(error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const searchLocation = async () => {
      const query = searchQuery.value;
      if (!query) return;

      // Check if the query is coordinates
      const coordRegex = /^[-+]?\d{1,2}\.\d+,\s*[-+]?\d{1,3}\.\d+$/;
      if (coordRegex.test(query)) {
        const [lat, lng] = query.split(',').map(Number);
        if (map.value) {
          if (searchMarker.value) {
            searchMarker.value.setLatLng([lat, lng]);
          } else {
            searchMarker.value = L.marker([lat, lng], { icon: searchIcon }).addTo(map.value);
          }
          map.value.setView([lat, lng], 12);
          const address = await getGeocodingData(lat, lng);
          searchMarker.value.bindPopup(`${address}`).openPopup();
        }
      } else {
        // Geocode the address
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=fb0f32f0d7984466b39ed240f169d182`;
        try {
          const response = await axios.get(apiUrl);
          if (response.data && response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            if (map.value) {
              if (searchMarker.value) {
                searchMarker.value.setLatLng([lat, lng]);
              } else {
                searchMarker.value = L.marker([lat, lng], { icon: searchIcon }).addTo(map.value);
              }
              map.value.setView([lat, lng], 12);
              const address = response.data.results[0].formatted;
              searchMarker.value.bindPopup(`${address}
              <br>
              <button onclick="getItinerary(${lat}, ${lng})">Itinéraire</button>
              `).openPopup();
            }
          } else {
            alert('Adresse non trouvée');
          }
        } catch (error) {
          console.error('Erreur lors de la recherche de l\'adresse:', error);
        }
      }
    };

    window.getItinerary = getItinerary;

    return {
      centerMap,
      searchQuery,
      searchLocation
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

  button {
    padding: 0.5rem 1rem;
    background-color: #107231;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  button:hover {
    background-color: #0d5f1f;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }

  #div_options {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: space-around;
    align-items: center;
  }
  #center_me {
    margin-top: 1rem;
  }
  #research {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 70%;
  }
  #search_input {
    width: 95%;
    margin-top: 1rem;
  }
  #search_button {
    margin-top: 1rem;
  }
</style>
