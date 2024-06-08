// eventBus.js
import { ref } from 'vue';

const eventBus = ref({});

export default {
  on(event, callback) {
    if (!eventBus.value[event]) {
      eventBus.value[event] = [];
    }
    eventBus.value[event].push(callback);
  },
  emit(event, data) {
    if (eventBus.value[event]) {
      eventBus.value[event].forEach(callback => callback(data));
    }
  }
};
