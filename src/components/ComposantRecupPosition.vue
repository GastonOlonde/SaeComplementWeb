<template>
    <div>
        <p>Latitude: {{ latitude }}</p>
        <p>Longitude: {{ longitude }}</p>
    </div>
</template>

<script>
export default {
  data() {
    return {
      latitude: null,
      longitude: null,
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleSuccess,
        this.handleError
      );
    } else {
      alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
  },
  methods: {
    handleSuccess(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    },
    handleError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("L'utilisateur a refusé la demande de géolocalisation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Les informations de localisation ne sont pas disponibles.");
          break;
        case error.TIMEOUT:
          alert("La demande de localisation de l'utilisateur a expiré.");
          break;
        case error.UNKNOWN_ERROR:
          alert("Une erreur inconnue s'est produite lors de la récupération de la localisation.");
          break;
      }
    }
  }
};
</script>
