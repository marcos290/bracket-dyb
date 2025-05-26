<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
    <div class="bg-white p-8 rounded shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Crea tu Luchador</h2>
      <input v-model="nombre" placeholder="Nombre" class="border p-2 w-full mb-2" />
      <input v-model="pais" placeholder="País" class="border p-2 w-full mb-2" />
      <input v-model="altura" placeholder="Altura (cm)" type="number" class="border p-2 w-full mb-2" />
      <button @click="crear" class="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2">Crear</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['creado'])

const nombre = ref('')
const pais = ref('')
const altura = ref('')

function crear() {
  if (!nombre.value || !pais.value || !altura.value) return
  emit('creado', {
    nombre: nombre.value,
    pais: pais.value,
    altura: Number(altura.value),
  })
}
</script>