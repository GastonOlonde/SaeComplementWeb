<script>
  import axios from 'axios'
  const data = ref([]);
  axios.get('http://localhost:1337/api/saes')
    .then(response => {
      data.value = response.data
      console.log(response.data)
    })
    .catch(error => {
      console.error(error)
    })
  
</script>
<template>
  <p>
    Compteur : {{ count }}
  </p>
  <button 
    @click="incremente">Incrémenter
  </button>
  <button
    @click="decremente">Décrémenter
  </button>
  <button
    @click="count = 0">Réinitialiser
  </button>
  <p>
    {{ data }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0);
function incremente() {
  count.value++;
}
function decremente() {
  count.value--;
}
</script>