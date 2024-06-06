<template>
  <div id="apropos">
    <ComposantApropos />
  </div>
</template>

<script setup>
  import ComposantApropos from '@/components/ComposantApropos.vue'
</script>
<style>
  #apropos{
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