<template>
  <div class="crear-bg">
    <div class="crear-card">
      <h2 class="crear-title">Crea tu Luchador</h2>
      <div class="crear-form-row">
        <div class="crear-form-col">
          <input v-model="nombre" placeholder="Nombre" class="crear-input" />
          <input v-model="pais" placeholder="País" class="crear-input" />
          <input v-model="altura" placeholder="Altura (cm)" type="number" min="160" max="199" class="crear-input" />
          <input v-model="peso" placeholder="Peso (kg)" type="number" min="50" max="150" class="crear-input" />
          </div>
        <div class="crear-form-col">
          <input v-model="pressBanca" placeholder="Press banca (kg)" type="number" min="50" max="150" class="crear-input" />
          <input v-model="agilidad" placeholder="Agilidad" type="number" min="0" max="100" class="crear-input" />
          <input v-model="profesion" placeholder="Profesión" class="crear-input" />
          <input v-model="discapacidad" placeholder="Discapacidad" class="crear-input" />
        </div>
      </div>
      <button @click="crear" class="crear-btn">Crear</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['creado'])

const nombre = ref('')
const pais = ref('')
const altura = ref('')
const pressBanca = ref('')
const agilidad = ref('')
const resistencia = ref('')
const objeto = ref('')
const habilidad = ref('')
const profesion = ref('')
const peso = ref('')
const discapacidad = ref('')

// Limita el valor de agilidad a 99
function limitarAgilidad() {
  if (Number(agilidad.value) > 99) {
    agilidad.value = '99'
  }
}

function crear() {
  if (!nombre.value || !pais.value || !altura.value) return
  emit('creado', {
    nombre: nombre.value,
    pais: pais.value,
    altura: Number(altura.value),
    pressBanca: Number(pressBanca.value),
    agilidad: Number(agilidad.value),
    resistencia: Number(resistencia.value),
    objeto: objeto.value,
    habilidad: Number(habilidad.value),
    profesion: profesion.value,
    peso: Number(peso.value),
    discapacidad: discapacidad.value,
  })
}
</script>

<style scoped>
.crear-bg {
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center; /* Esto centra horizontal y verticalmente */
}
.crear-card {
  background: rgba(255,255,255,0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px #1e3a8a22;
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 420px;
  border: 2px solid #2563eb33;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.crear-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  letter-spacing: 0.04em;
  text-shadow: 1px 2px 8px #b3b3b3;
}
.crear-input {
  border: 1.5px solid #2563eb55;
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 1.08rem;
  background: #f8fafc;
  transition: border 0.2s;
  outline: none;
}
.crear-input:focus {
  border-color: #2563eb;
  background: #fff;
}
.crear-btn {
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: #fff;
  font-weight: bold;
  padding: 0.8rem 2.2rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  border: none;
  box-shadow: 0 2px 12px #2563eb33;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.crear-btn:hover {
  background: linear-gradient(90deg, #1e40af 60%, #0ea5e9 100%);
  transform: scale(1.04);
}
.crear-form-row {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 1rem;
}
.crear-form-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>