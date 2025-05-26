<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
    <CrearPersonaje v-if="!personaje" @creado="personaje = $event" />
    <Bracket v-else :personaje="personaje" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Bracket from './components/Bracket.vue'
import CrearPersonaje from './components/CrearPersonaje.vue'

const personaje = ref(null)
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
