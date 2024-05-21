
<template>
  <p>
    Compteur : {{ count }}
  </p>
  <button 
    @click="handleClick">Incrémenter
  </button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0);

function handleClick() {
  count.value++;
}
</script>