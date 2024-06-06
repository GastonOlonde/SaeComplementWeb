<template>
  <div id="accueilcomp">
    <div>
      <router-link id="lien" to="/geolocalisation">Géolocalisation</router-link>
      <router-link id="lien" to="/donnees">Accès données</router-link>
    </div>
    <router-link id="lien" class="bottom" to="/cartographie">Cartographie</router-link>
  </div>  
</template>

<script setup>

</script>

<style>

  #accueilcomp{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: 0 auto;
  }

  #accueilcomp div{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-left: 0 auto;
  }

  #lien{
    margin: 1rem;
    padding: 5rem;
    font-size: 2rem;
    border-radius: 5px;
    background-color: lightgrey;
    text-decoration: none;
    color: black;
    transition: all 0.5s ease-in-out;
  }
  #lien:hover{
    background-color: grey;
    transform: scale(1.01);
  }
  
  .bottom{
    width: 95%;
    text-align: center;
    background-image: url('../../public/back-carto.png');
    background-size: cover;
  }
</style>