
<template>
  <p>
    Compteur : {{ count }}
  </p>
  <p>
    <button 
      @click="handleClick">Incrémenter
    </button>
  </p>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0);

function handleClick() {
  count.value++;
}
</script>