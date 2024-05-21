<template>
  <div id="carto">
    <ComposantCarto />
    <ComposantRecupPosition />
  </div>
</template>

<script setup>
import ComposantCarto from '@/components/ComposantCarto.vue'
import ComposantRecupPosition from '@/components/ComposantRecupPosition.vue';
</script>
<style>
  #carto{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: auto;
    height: 100vh;
    width: 85%;
  }
</style>