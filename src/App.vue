<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  
  <header>
    <button id="hide" @click="toggleMenu">
      <i id="fleche_cache" class="bi bi-arrow-left-circle-fill"></i>
    </button>
    <div class="wrapper">
      <nav>
        <RouterLink to="/cartographie">Cartographie</RouterLink>
        <RouterLink to="/apropos">À Propos</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>  
  // cacher le header au bouton hide
  const toggleMenu = () => {
    const header = document.querySelector('header');
    const hide = document.querySelector('#hide');
    // const accueil = document.querySelector('#accueil');
    // const donnees = document.querySelector('#donnees');
    // const geoloc = document.querySelector('#geoloc');
    const divopt = document.querySelector('#div_options');
    const apropos = document.querySelector('#apropos');


    // récupérer la largueur du header
    const headerWidth = header.offsetWidth;
    // déplacer le header à gauche de la largeur du header avec animation
    header.style.left = header.style.left === `-${headerWidth}px` ? `0px` : `-${headerWidth}px`;
    // on tourne la flèche de 180° et on la décale de 1rem soit à gauche soit à droite
    hide.style.transform = hide.style.transform === `rotate(180deg)` ? `rotate(0deg)` : `rotate(180deg)`;
    // ajouter une autre animation scale sur le hide
    hide.style.left = hide.style.left === `13.3rem` ? `10rem` : `13.3rem`;

    const url = window.location.href;
    const page = url.split('/').pop();

    if(header.style.left === `-${headerWidth}px`){
      // à partir de l'url on récupère le nom de la page
      

      switch(page){
        case 'apropos':
          apropos.style.width = `100%`;
          break;
        case 'cartographie':
          divopt.style.width = `80%`;
          divopt.style.left = `10%`;
          break;
      }
    }else{
      switch(page){
        case 'apropos':
          apropos.style.width = `85%`;
          break;
        case 'cartographie':
          divopt.style.width = `75%`;
          divopt.style.left = `20%`;
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
  z-index: 10000;
  transition: all 0.5s ease-in-out; 
}
#hide{
  position: relative;
  top: 0.5rem;
  left: 10rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out; 
}

#fleche_cache{
  color: #1a73e8;
  margin-top: 0;
  font-size: 3rem;
  transition: all 0.5s ease-in-out;
}
#fleche_cache:hover{
  color: #478be3;
}


.wrapper {
  height: 50%;
  margin: 30vh 1rem 0 1rem;
}

nav {
  width: 100%;
  height: 50%;
  font-size: 1.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

/* nav a:first-of-type {
  border: 0;
} */




/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
