<template>
  <div id="loading" class="bike-wheel-loader" style="display: none;"></div>
  <div id="filter_blur"></div>
  <div id="map">
    <div id="div_options">
      <div id="research">        
        <button id="center_me" @click="centerMap" title="Centrer sur ma localisation">
          <img src="../../public/broche-cible.png" alt="">
        </button>
        <div id="search_cross_div">
          <input id="search_input" type="text" v-model="searchQuery"
            placeholder="Entrez une adresse ou des coordonnées">
          <button id="vide_searchBar" title="Effacer">x</button>
        </div>
        <!-- <button id="search_button" @click="searchLocation">Rechercher</button> -->
      </div>
    </div>
    <div id="hide_compo">
      <ComposantApropos />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, h } from 'vue';
import L, { Icon } from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import EventBus from '../EventBus';
import ComposantApropos from '@/components/ComposantApropos.vue';
// import { icon } from 'leaflet';

export default {
  components: {
    ComposantApropos
  },
  setup() {
    const map = ref(null);
    const markers = ref(null);
    const markerIds = ref(new Set());
    const routeLayer = ref(null);
    const userMarker = ref(null);
    const searchQuery = ref('');
    const searchMarker = ref(null);
    const geolocation = ref(null);

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
      map.value = L.map('map', { zoomControl: false }).setView([49.8710245, 2.2639386], 12);
      map.marker = L.marker([49.8710245, 2.2639386], { icon: userIcon }, 10).addTo(map.value);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.value);

      markers.value = L.markerClusterGroup({
        maxClusterRadius: 100,
        showCoverageOnHover: true,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        animate: true,
        animateAddingMarkers: false,
        chunkLoading: true,
        chunkInterval: 10,
        chunkDelay: 10,
      });
      map.value.addLayer(markers.value);

      map.value.on('moveend', loadMarkers);
      map.value.on('zoomend', throttle(loadMarkers, 3000));

      loadMarkers();

      EventBus.on('requestItinerary', (data) => {
        if (data.lat && data.lng) {
          getItinerary(data.lat, data.lng);
        } else {
          console.error("Invalid coordinates for itinerary:", data);
        }
      });
      EventBus.on('removeItinerary', () => {
        if (routeLayer.value) {
          map.value.removeLayer(routeLayer.value);
        }
      });

      const searchInput = document.getElementById('search_input');
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          searchLocation();
        }
      });

      const videSearchBar = document.getElementById('vide_searchBar');
      videSearchBar.addEventListener('click', () => {
        viderSearchBar();
      });
    });

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.off('moveend', loadMarkers);
        map.value.off('zoomend', loadMarkers);
        map.value.remove();
        map.value = null;
      }
    });
    const showLoading = () => {
      const loadingIndicator = document.getElementById('loading');
      loadingIndicator.style.display = 'block';
    };

    const hideLoading = () => {
      const loadingIndicator = document.getElementById('loading');
      loadingIndicator.style.display = 'none';
    };

    const viderSearchBar = () => {
      searchQuery.value = '';
    };

    const centerMap = async () => {

      const getGeolocation = () => {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            showLoading();

            const options = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(resolve, reject, options);
          } else {
            reject(new Error('Geolocation is not supported by this browser.'));
          }
        });
      };

      try {
        const position = await getGeolocation();
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
      } catch (error) {
        console.error(error);
        alert('veuillez activer la géolocalisation et réeassayer dans quelques instants');

      } finally {
        hideLoading();
      }
    };



    const addMarker = async (lat, lng, popupText, id = null, code_com, capacite, mobilier, acces, gratuit, protection, couverture, surveillance) => {
      if (markers.value && (id === null || !markerIds.value.has(id))) {
        const marker = L.marker([lat, lng]);
        marker.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          const address = await getGeocodingData(lat, lng);
          const loadingIndicator = document.getElementById('loading');
          loadingIndicator.style.display = 'block';

          const additionalData = {
            lat: lat,
            lng: lng,
            adresse: address,
            capacite: capacite,
            mobilier: mobilier,
            acces: acces,
            gratuit: gratuit,
            protection: protection,
            couverture: couverture,
            surveillance: surveillance
          };
          setTimeout(() => {
            hideLoading();
          }, 300);
          EventBus.emit('markerAdded', additionalData);  // Émettre les données

          const header = document.querySelector('header');
          header.style.left = '0';
          const hide = document.querySelector('#hide');
          hide.style.transform = 'rotate(0deg)';
          hide.style.left = 'calc(100% - 20px)';

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
              addMarker(lat, lng, `Element ID: ${id} Lat : ${lat} Lng : ${lng}`, id, item.attributes.code_com, item.attributes.capacite, item.attributes.mobilier, item.attributes.acces, item.attributes.gratuit, item.attributes.protection, item.attributes.couverture, item.attributes.surveillance);
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
                addMarker(lat, lng, `Element ID: ${id} Lat : ${lat} Lng : ${lng}`, id, item.attributes.code_com, item.attributes.capacite, item.attributes.mobilier, item.attributes.acces, item.attributes.gratuit, item.attributes.protection, item.attributes.couverture, item.attributes.surveillance);
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
      const loadingIndicator = document.getElementById('loading');
      loadingIndicator.style.display = 'block';
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
            loadingIndicator.style.display = 'none';
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
  height: 100vh;
  width: 100%;
  margin: 0 auto;
}

#filter_blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 9999;
  transition: all 0.5s ease-in-out;
  display: none;
}


#loading {
  position: absolute;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 10px;
  z-index: 1000;
  border: 10px solid #f3f3f3;
  border-top: 10px solid #3498db;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.leaflet-control-zoom .leaflet-bar .leaflet-control {
  display: none !important;
}

button {
  font-size: 1.2rem;
  padding: 0.7rem 1.2rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 50px;
  height: auto;
  width: auto;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

button:hover {
  background-color: #478be3;
}

#center_me{
  margin-right: 2.5rem;
  padding: 2.5px ;
  background-color: #1a73e8;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.5s ease-in-out;
}
#center_me:hover {
  background-color: #478be3;
  transform: scale(1.1);
}

#center_me img {
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
}

input {
  padding: 0.5rem 3rem 0.5rem 1rem;
  border: 1px solid #1a73e8;
  border-radius: 50px;
  height: 100%;
}

#div_options {
  position: relative;
  top: 1rem;
  z-index: 1000;
  transition: all 0.5s ease-in-out;
}

#research {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 2.75rem;
  width: 100%;
}

#search_cross_div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 2.75rem;
  width: 100%;
}

#search_cross_div button {
  position: relative;
  right: 3rem;
  font-size: 1.5rem;
  padding: 0 0.5rem 0 1rem;
  height: 2.7rem;
  border-radius: 0;
  border-left: 1px solid #1a73e8;
  background-color: transparent;
  color: #1a73e8;
}
#search_cross_div button:hover {
  color: #478be3;
}

#search_input {
  width: 100%;
  font-size: medium;
  background-color: rgb(241, 237, 237);
}

#hide_compo {
  display: none;
  /* overflow: scroll; */
  width: auto;
  margin-left: 10%;
  transition: all 0.5s ease-in-out;
}
</style>
