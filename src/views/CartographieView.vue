<template>
  <div id="carto">
    <ComposantCarto />
    <!-- <ComposantRecupPosition /> -->
  </div>
</template>

<script setup>
import ComposantCarto from '@/components/ComposantCarto.vue'
import ComposantRecupPosition from '@/components/ComposantRecupPosition.vue';
</script>
<style>
  #carto{
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: center; */
    align-items: center;
    margin-left: auto;
    /* padding: 1rem 0 1rem 1rem; */
    height: 100vh;
    width: 100%;
  }
</style>