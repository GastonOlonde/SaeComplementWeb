<template>
  <div id="contenu_apropos">
    <button id="close_apropos">x</button>
    <h1>À propos</h1>
    <p>
      Le site nommé <span>Carto'S Search</span> , permettant de visualiser les emplacements de parkings à vélos sur tout le
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

#close_apropos {
  position: relative;
  font-size: 2rem;
  background-color: #1a73e8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  margin-bottom: 1rem;
  z-index: 1000001;
}

#close_apropos:hover {
  background-color: #478be3;
}

#contenu_apropos {
  background: var(--color-background) ;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  width: 60%;
  height: 80vh;
  margin: 3rem auto;
  position: relative;
  overflow: scroll;
  transition: all 0.5s ease-in-out;
  z-index: 100000;
}

#contenu_apropos::-webkit-scrollbar {
  display: none;
}

#contenu_apropos span {
  color: #478be3;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #478be3;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: #00aaff;
  margin: 0.5rem auto 0;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: start;
}

ul {
  /* list-style-type: none; */
  margin-bottom: 2rem;
  padding-left: 1rem;
}

ul li {
  font-size: 1.2rem;
  padding: 0.5rem 0;
  position: relative;
  border-bottom: 1px solid #444;
  width: 50%;
}


@media (min-width: 1540px) {
  #contenu_apropos {
    width: 50%;
  }
}
@media (max-width: 1440px) {
  #contenu_apropos {
    width: 60%;
  }
}
@media (max-width: 1024px) {
  #contenu_apropos {
    width: 70%;
  }
}
@media (max-width: 700px) {
  #contenu_apropos {
    width: 80%;
  }
}
</style>