<template>
  <div id="contenu_infopoint" :class="{ 'fade-transition': isFading }" v-for="marker in markers" :key="marker.id">
    <button id="close_tab" @click="viderTabMarkers()">x</button>
    <div id="tabs">
      <button v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === index }"
        @click="activeTab = index">
        {{ tab }}
      </button>
    </div>
    <div id="tab_content">
      <div v-if="activeTab === 0">
        <p v-for="line in marker.adresse.split(',')" :key="line">
          {{ line }}
        </p>
      </div>
      <div v-if="activeTab === 1" id="div_info">
        <p v-if="marker.capacite">
          <img id="icon_info" src="../../public/infosPointIcon/parking.png">
          <span id="info_point_span">{{ marker.capacite }}</span>
          Places
        </p>
        <p v-if="marker.mobilier">
          <img id="icon_info" src="../../public/infosPointIcon/arceau.png">
          {{ marker.mobilier }}
        </p>
        <p v-if="marker.acces">
          <img id="icon_info" src="../../public/infosPointIcon/prive.png">
          {{ marker.acces }}
        </p>
        <p v-if="marker.gratuit">
          <img id="icon_info" src="../../public/infosPointIcon/piece-en-euros.png">
          {{ marker.gratuit === "true" ? 'Gratuit' : 'Payant' }}
        </p>
        <p v-if="marker.couverture">
          <img id="icon_info" src="../../public/infosPointIcon/toit.png">
          {{ marker.couverture === "true" ? 'Couvert' : 'Non couvert' }}
        </p>
        <p v-if="marker.surveillance">
          <img id="icon_info" src="../../public/infosPointIcon/surveillance.png">
          {{ marker.surveillance === "true" ? 'Surveillé' : 'Non surveillé' }}
        </p>
      </div>
    </div>
    <div id="itinary_div">
      <button @click="sendItineraryRequest(marker)">Itinéraire</button>
    </div>
  </div>
</template>

<script>
import eventBus from '../EventBus';
import 'boxicons';

export default {
  data() {
    return {
      markers: [],
      tabs: ['Adresse', 'Caractéristiques'],
      activeTab: 0,
      isFading: false
    };
  },
  created() {
    eventBus.on('markerAdded', (data) => {
      this.cleanMarkerData(data);
      this.fadeMarkers(() => {
        this.markers = [];
        this.markers.push(data);
      });
    });
  },
  methods: {
    sendItineraryRequest(marker) {
      eventBus.emit('requestItinerary', { lat: marker.lat, lng: marker.lng });
    },
    viderTabMarkers() {
      this.fadeMarkers(() => {
        this.markers = [];
        eventBus.emit('removeItinerary');
      });
    },
    fadeMarkers(callback) {
      this.isFading = true;
      setTimeout(() => {
        callback();
        this.isFading = false;
      }, 500);
    },
    cleanMarkerData(marker) {
      for (const key in marker) {
        if (marker[key] === '' || marker[key] === 'nonprécisé' || marker[key] === 'AUTRE' || marker[key] === null) {
          delete marker[key];
        }
        if(marker[key] !== null && marker[key] !== undefined && marker[key].length > 0 && key !== 'adresse') {
          // mettre tout en minuscule
          marker[key] = marker[key].toLowerCase();
          // mettre la première lettre en majuscule
          marker[key] = marker[key].charAt(0).toUpperCase() + marker[key].slice(1);
        }
        
      }
    }
  },
};

</script>

<style>
#contenu_infopoint {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding: 1rem;
  color: var(--color-text);
  border-radius: 10px;
  box-shadow: 0 0 10px #1a73e8a1;
  background-color: var(--background-color);
  border: 0.5px solid #1a73e8;
  margin-bottom: 1rem;
  width: 300px;
  opacity: 1;
  transition: all 0.5s ease-in-out;
}

#contenu_infopoint.fade-transition {
  opacity: 0;
}

#close_tab {
  position: relative;
  top: -30px;
  left: 269px;
  background-color: #1a73e8;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

#close_tab:hover {
  background-color: #478be3;
}

#tabs {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

#tabs button {
  flex: 1;
  padding: 0.5rem;
  background-color: #478be3;
  color: white;
  border: none;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

#tabs button.active {
  background-color: #1a73e8;
}

#tabs button:not(.active):hover {
  background-color: #5a9bf4;
}

#tab_content {
  width: 100%;
  padding: 1rem;
  background-color: var(--background-color);
  border: 0.5px solid #1a73e8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 0 10px #1a73e8a1;
}

#tab_content p {
  margin: 0.2rem 0;
}

#itinary_div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}

button {
  font-size: medium;
  padding: 0.5rem 1rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

button:hover {
  background-color: #478be3;
}

#info_point_span {
  color: #1a73e8;
}

#icon_info {
  width: 40px;
  background-color: #1a73e8;
  padding: 2px;
  border-radius: 15%;
  color: white;
}

#icon_info_adresse {
  width: 30px;
  background-color: #1a73e8;
  padding: 2px;
  border-radius: 15%;
  color: white;
}

#div_info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#div_info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
}
</style>
