<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/geolocalisation">Géolocalisation</RouterLink>
        <RouterLink to="/cartographie">Cartographie</RouterLink>
        <RouterLink to="/donnees">Accéder aux données</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>


<style scoped>
body {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

header {
  line-height: 1.5;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  height: 100vh;
  width: auto; 
  z-index: 1000;
}

.wrapper {
  height: 50%;
  margin: 22vh 1rem 0 1rem;
}

nav {
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}




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
