
<template>
  <div id="geoloc">
    <h1>Géolocalisation</h1>
    <ComposantGeo />
  </div>
  
</template>

<script setup>
import ComposantGeo from '@/components/ComposantGeo.vue'

</script>
<style scoped>
  #geoloc{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 2rem;
    margin-left: auto;
    height: 100vh;
    width: 85%;
    overflow-y: scroll;
    transition: all 0.5s ease-in-out;
  }
</style>