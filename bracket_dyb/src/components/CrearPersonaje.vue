<template>
  <div class="crear-bg">
    <div class="particles"></div>
    <div class="ring-bg"></div>
    <div class="crear-card" data-tilt>
      <!-- Título descriptivo mejorado -->
      <div class="title-container">
        <h2 class="crear-title">Crea tu Luchador</h2>
        <p class="crear-subtitle">Personaliza las características de tu guerrero para el torneo</p>
      </div>

      <div class="crear-form-row">
        <div class="crear-form-col">
          <div class="input-container" style="--i: 1">
            <label class="input-label">Nombre</label>
            <input v-model="nombre" placeholder="Ingresa el nombre del luchador" class="crear-input" />
          </div>
          <div class="input-container" style="--i: 2">
            <label class="input-label">País</label>
            <input v-model="pais" placeholder="País de origen" class="crear-input" />
          </div>
          <div class="input-container" style="--i: 3">
            <label class="input-label">Altura (cm)</label>
            <input v-model="altura" type="number" min="160" max="210" 
                   placeholder="160-210 cm" class="crear-input" @input="limitarAltura" />
          </div>
          <div class="input-container" style="--i: 4">
            <label class="input-label">Peso (kg)</label>
            <input v-model="peso" type="number" min="50" max="180" 
                   placeholder="50-180 kg" class="crear-input" @input="limitarPeso" />
          </div>
        </div>
        <div class="crear-form-col">
          <div class="input-container" style="--i: 5">
            <label class="input-label">Press banca (kg)</label>
            <input v-model="pressBanca" type="number" min="50" max="150" 
                   placeholder="50-150 kg" class="crear-input" />
          </div>
          <div class="input-container" style="--i: 6">
            <label class="input-label">Agilidad</label>
            <input v-model="agilidad" type="number" :max="99" 
                   placeholder="1-99" class="crear-input" @input="limitarAgilidad" />
          </div>
          <div class="input-container" style="--i: 7">
            <label class="input-label">Profesión</label>
            <input v-model="profesion" placeholder="Ocupación actual" class="crear-input" />
          </div>
          <div class="input-container" style="--i: 8">
            <label class="input-label">Discapacidad</label>
            <input v-model="discapacidad" placeholder="Opcional" class="crear-input" />
          </div>
        </div>
      </div>
      <button @click="crear" class="crear-btn">
        <span class="btn-text">CREAR LUCHADOR</span>
        <span class="btn-icon">🥊</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


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

// Limita el valor de altura a 210
function limitarAltura() {
  if (Number(altura.value) > 210) {
    altura.value = '210'
  }
}

// Limita el valor de peso a 180
function limitarPeso() {
  if (Number(peso.value) > 180) {
    peso.value = '180'
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
:root {
  --primary: #ffd700;
  --secondary: #ff4d00;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --bg-dark: #000000;
  --card-bg: rgba(20, 20, 20, 0.95);
  --input-bg: rgba(255, 255, 255, 0.05);
  --glow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.crear-bg {
  min-height: 100vh;
  width: 100%;
  background: var(--bg-dark);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crear-card {
  position: relative;
  background: var(--card-bg);
  width: 90%;
  max-width: 800px;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 
    0 0 40px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.1);
  transform: translateZ(0);
  margin: auto;
}

/* Fondo con efecto de partículas */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, 
    rgba(255, 215, 0, 0.1) 0%,
    transparent 70%);
  pointer-events: none;
}

/* Efecto de anillo */
.ring-bg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: 
    radial-gradient(circle at center,
      transparent 0%,
      rgba(255, 215, 0, 0.05) 30%,
      transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Mejora el efecto de hover en la tarjeta */
.crear-card:hover {
  transform: translateZ(20px);
  box-shadow: 
    0 0 60px rgba(0, 0, 0, 0.6),
    0 0 120px rgba(255, 215, 0, 0.2);
}

.title-container {
  text-align: center;
  margin-bottom: 3rem;
}

.crear-title {
  font-size: 2.5rem;
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.crear-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.crear-form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.input-container {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.crear-input {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.crear-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.crear-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.crear-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg-dark);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.btn-text {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .crear-card {
    width: 95%;
    padding: 2rem;
    margin: 1rem;
  }

  .crear-form-row {
    grid-template-columns: 1fr;
  }

  .crear-title {
    font-size: 2rem;
  }
}

/* Animación suave de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.crear-card {
  animation: fadeIn 0.5s ease-out;
}

/* Estilo para inputs tipo number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>