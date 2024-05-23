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
    border: 1px solid black;
    border-radius: 5px;
    background-color: lightgrey;
    text-decoration: none;
    color: black;
  }
  #lien:hover{
    background-color: grey;
  }
  
  .bottom{
    width: 95%;
    text-align: center;
  }
</style>