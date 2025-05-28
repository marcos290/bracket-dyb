<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
    <Portada v-if="!iniciado" @iniciar="iniciado = true" />
    <template v-else>
      <CrearPersonaje v-if="!personaje" @creado="personaje = $event" />
      <Bracket v-else :personaje="personaje" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Bracket from './components/Bracket.vue'
import CrearPersonaje from './components/CrearPersonaje.vue'
import Portada from './components/Portada.vue'

const iniciado = ref(false)
const personaje = ref(null)
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
