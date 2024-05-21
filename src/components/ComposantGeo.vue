<template>
  <div>
    <button @click="loadMore">Load More</button>
    <div v-for="item in extractedData" :key="item.id">
      <p> {{ item.id }} [ {{ item.X }} , {{ item.Y }} ]</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const data = ref([]);
    const extractedData = ref([]);
    const page = ref();
    const limit = 100; // Nombre de résultats par page

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/saes', {
          params: {
            _page: 4,
            _limit: limit,
          },
          timeout: 100000, // Augmentez le timeout si nécessaire
        });

        console.log('Réponse de l\'API:', response.data); // Ajout d'un log pour vérifier la réponse de l'API

        // Vérifiez si la réponse de l'API contient un tableau de données
        if (Array.isArray(response.data.data)) {
          data.value = response.data.data;
          console.log('Données brutes:', data.value); // Ajout d'un log pour vérifier les données brutes

          // Extraction des champs X et Y
          const extracted = data.value.map(item => ({
            id: item.id, // Assurez-vous que chaque élément a un champ `id` ou une autre clé unique
            X: item.attributes?.X,
            Y: item.attributes?.Y,
          }));
          console.log('Données extraites:', extracted); // Ajout d'un log pour vérifier les données extraites

          extractedData.value.push(...extracted);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const loadMore = () => {
      page.value += 1;
      fetchData();
    };

    onMounted(() => {
      fetchData();
    });

    return {
      data,
      extractedData,
      loadMore,
    };
  },
}
</script>
