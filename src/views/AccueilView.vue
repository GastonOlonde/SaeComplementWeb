<template>
  <div id="accueil">
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
    transition: all 0.5s ease-in-out;
  }
</style>