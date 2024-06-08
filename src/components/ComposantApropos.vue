<template>
  <div id="contenu_apropos">
    <h1>À propos</h1>
    <p>
      Le site nommé Carto'S Search, permettant de visualiser les emplacements de parkings à vélos sur tout le
      territoire français, a été réalisé par l'équipe de SAE du groupe 2 parcours développement web et application.
    </p>
    <p>
      L'équipe est composée des 6 membres suivants :
    </p>
    <ul>
      <li>Gaston</li>
      <li>Léo</li>
      <li>Enzo</li>
      <li>Aurélien</li>
      <li>Zafer</li>
      <li>Emile</li>
    </ul>
    <p>
      La cartographie est réalisée grâce à l'API Leaflet et les données proviennent de l'API OpenStreetMap.
    </p>
  </div>
</template>

<script setup>



</script>

<style>
#contenu_apropos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin-left: 0 auto;
  gap: 1rem;
  padding: 4rem;
}

h1 {
  font-size: 2rem;
  align-self: center;
}

p {
  font-size: large;
  text-align: justify;
}
</style>