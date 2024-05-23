<template>
  <div id="accueil">
    <h1>Vous êtes sur la page d'Accueil</h1>
    <ComposantAccueil />
  </div>
</template>

<script setup>
  import ComposantAccueil from '@/components/ComposantAccueil.vue'
</script>
<style>
  #accueil{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    margin-left: auto;
    height: 100vh;
    width: 85%;
  }
</style>