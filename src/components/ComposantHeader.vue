<template>
  <header>
    <button id="hide" @click="toggleMenu">
      <i id="fleche_cache" class="bi bi-arrow-left-circle-fill"></i>
    </button>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Cartographie</RouterLink>
        <RouterLink to="/apropos">À Propos</RouterLink>
      </nav>
    </div>
    <div id="dataCarto">
      <ComposantInfoPoint />
    </div>
  </header>
  <RouterView />
</template>


<script setup>
import { RouterLink, RouterView } from 'vue-router';
import ComposantInfoPoint from './ComposantInfoPoint.vue';
import { h } from 'vue';

// au chargement de la page (ondocumentload)
function positionHide() {
  // récupérer la largueur du header
  const header = document.querySelector('header');
  const headerWidth = header.offsetWidth;
  const hide = document.querySelector('#hide');
  const hideWidth = hide.offsetWidth;

  // si le header est affiché
  if (header.style.left === `-${headerWidth}px`) {
    // déplacer le header à gauche de la largeur du header
    hide.style.left = headerWidth  + 'px';
  } else {
    hide.style.left = headerWidth - (hideWidth/2) + 'px';
  }
};

window.onload = () => {
  positionHide();
  headerDimensions();
}

// appeler la fonction positionHide toutes les 100ms si le header est affiché

window.setInterval(() => {
  positionHide();
}, 100);

window.setInterval(() => {
  headerDimensions();
}, 100);

// cacher le header au bouton hide
const toggleMenu = () => {
  const header = document.querySelector('header');
  const hide = document.querySelector('#hide');
  const hideWidth = hide.offsetWidth;

  // récupérer la largueur du header
  const headerWidth = header.offsetWidth;
  // déplacer le header à gauche de la largeur du header avec animation
  header.style.transition = 'all 0.5s ease-in-out';
  header.style.left = header.style.left === `-${headerWidth}px` ? `0px` : `-${headerWidth}px`;
  // on tourne la flèche de 180° et on la décale de 1rem soit à gauche soit à droite
  hide.style.transform = hide.style.transform === `rotate(180deg)` ? `rotate(0deg)` : `rotate(180deg)`;
  hide.style.left = hide.style.left === headerWidth - 20 + 'px' ? headerWidth - 60 + 'px' : headerWidth - 20 + 'px';


  // si le header est affiché
  if (header.style.left === `-${headerWidth}px`) {
    // déplacer le header à gauche de la largeur du header
    hide.style.left = headerWidth  + 'px';
  } else {
    hide.style.left = headerWidth - (hideWidth/2) + 'px';
  }

  headerDimensions();
}

function headerDimensions() {
  const header = document.querySelector('header');
  const divopt = document.querySelector('#div_options');
  const apropos = document.querySelector('#apropos');
  const headerWidth = header.offsetWidth;


  const url = window.location.href;
  const page = url.split('/').pop();
  const headerWidthPct = (headerWidth / window.innerWidth) * 100;
  const innerWidthPct = (window.innerWidth / window.innerWidth) * 100;
  const largeurDispo = innerWidthPct - headerWidthPct;
  const dataCarto = document.querySelector('#dataCarto');

  if (header.style.left === `-${headerWidth}px`) {
    // à partir de l'url on récupère le nom de la page
    //convertir la largeur du header en pourcentage

    switch (page) {
      case 'apropos':
        apropos.style.width = `100%`;
        dataCarto.style.display = 'none';
        break;
      case '':
        divopt.style.width = `80%`;
        divopt.style.left = `10%`;
        dataCarto.style.display = 'block';
        break;
    }
  } else {
    switch (page) {
      case 'apropos':
        apropos.style.width = `85%`;
        dataCarto.style.display = 'none';
        break;
      case '':
        divopt.style.width = largeurDispo -8+'%';
        divopt.style.left = headerWidthPct + 5 + '%';
        dataCarto.style.display = 'block';
        break;
    }
  }
}
</script>




<style scoped>
body {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

header {
  position: absolute;
  line-height: 1.5;
  top: 0;
  left: 0;
  background-color: rgb(241, 237, 237);
  height: 100vh;
  width: auto;
  z-index: 1000;
  transition: all 0.5s ease-in-out;
}

#hide {
  position: relative;
  top: 45vh;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

#fleche_cache {
  color: #1a73e8;
  margin-top: 0;
  font-size: 3rem;
  transition: all 0.5s ease-in-out;
}

#fleche_cache:hover {
  color: #478be3;
}


.wrapper {
  height: 15vh;
  margin: 5vh 1rem 0 1rem;
  transition: all 0.5s ease-in-out;
}

nav {
  width: 100%;
  height: 100%;
  font-size: 1.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
}

nav a.router-link-exact-active {
  color: black;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid #1a73e8;
}

#dataCarto {
  padding: 1rem;
  margin: 3rem 1rem 1rem 1rem;
  height: 60vh;
  overflow-y: hidden;
  transition: all 0.5s ease-in-out;
}

#dataCarto::-webkit-scrollbar {
  display: none;
}
</style>
