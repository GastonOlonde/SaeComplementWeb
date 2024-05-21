<template>
  <div id="donnees">
    <h1>Accès données</h1>
    <ComposantRecupPosition/>
  </div>
</template>

<script setup>

import ComposantRecupPosition from '@/components/ComposantRecupPosition.vue'

</script>
<style>
  #donnees{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: auto;
    height: 100vh;
    width: 85%;
  }
</style>