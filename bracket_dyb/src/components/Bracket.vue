<template>
  <div class="bracket-bg main-container">
    <!-- Fondo de clasificación SOLO si no ha empezado el combate -->
    <div v-if="!combateIniciado" class="champions-bracket-bg">
      <div class="bracket-elim">
        <div v-for="(ronda, idx) in rondas" :key="idx" class="bracket-elim-col">
          <div v-for="(flag, i) in ronda" :key="i" class="bracket-elim-cell">
            <span class="bracket-flag">{{ flag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón para empezar a luchar -->
    <div v-if="!combateIniciado" class="header-bar">
      <h1 class="main-title">🏆 Torneo Mundial de Luchadores</h1>
      <button @click="combateIniciado = true" class="fight-btn">
        ¡Empezar a luchar!
      </button>
    </div>

    <!-- Combate: solo los luchadores y el VS -->
    <div v-if="combateIniciado && !combateTerminado" class="fighters-row fighters-row-centered">
      <div class="fighter-card fighter-left">
        <h2 class="fighter-title blue">Tu Luchador</h2>
        <ul class="fighter-list blue-bg">
          <li><b>Nombre:</b> {{ personaje.nombre }}</li>
          <li><b>Edad:</b> {{ personaje.edad }}</li>
          <li><b>Sexo:</b> {{ personaje.sexo }}</li>
          <li><b>Altura:</b> {{ personaje.altura }} cm</li>
          <li><b>País:</b> {{ personaje.pais }}</li>
          <li><b>Fuerza:</b> {{ personaje.fuerza }}</li>
          <li><b>Agilidad:</b> {{ personaje.agilidad }}</li>
          <li><b>Resistencia:</b> {{ personaje.resistencia }}</li>
          <li><b>Habilidad:</b> {{ personaje.habilidad }}</li>
          <li><b>Inteligencia:</b> {{ personaje.inteligencia }}</li>
          <li><b>Peso:</b> {{ personaje.peso }} kg</li>
          <li><b>Experiencia:</b> {{ personaje.experiencia }} años</li>
          <li><b>Condición Física:</b> {{ personaje.condicionFisica }}</li>
          <li><b>Coef. Lucha:</b> {{ personaje.coeficienteLucha }}</li>
          <li><b>Vida:</b> {{ personaje.vida }}</li>
        </ul>
      </div>
      <div class="vs-center">
        <span class="vs-text">VS</span>
        <!-- Botones de avanzar o salir SIEMPRE visibles debajo del VS -->
        <div class="combate-actions-center">
          <button class="combate-btn-tick" @click="siguienteRival">✅</button>
          <button class="combate-btn-cross" @click="reiniciar">❌</button>
        </div>
      </div>
      <div class="fighter-card fighter-right">
        <h2 class="fighter-title red">Rival</h2>
        <ul class="fighter-list red-bg">
          <li><b>Nombre:</b> {{ rival.nombre }}</li>
          <li><b>Edad:</b> {{ rival.edad }}</li>
          <li><b>Sexo:</b> {{ rival.sexo }}</li>
          <li><b>Altura:</b> {{ rival.altura }} cm</li>
          <li><b>País:</b> {{ rival.pais }}</li>
          <li><b>Fuerza:</b> {{ rival.fuerza }}</li>
          <li><b>Agilidad:</b> {{ rival.agilidad }}</li>
          <li><b>Resistencia:</b> {{ rival.resistencia }}</li>
          <li><b>Habilidad:</b> {{ rival.habilidad }}</li>
          <li><b>Inteligencia:</b> {{ rival.inteligencia }}</li>
          <li><b>Peso:</b> {{ rival.peso }} kg</li>
          <li><b>Experiencia:</b> {{ rival.experiencia }} años</li>
          <li><b>Condición Física:</b> {{ rival.condicionFisica }}</li>
          <li><b>Coef. Lucha:</b> {{ rival.coeficienteLucha }}</li>
          <li><b>Vida:</b> {{ rival.vida }}</li>
        </ul>
      </div>
    </div>

    <!-- Log y botones de avanzar o salir tras el combate -->
    <div v-if="combateTerminado" class="combate-post">
      <ul class="combate-log">
        <li v-for="log in combateLog" :key="log" class="combate-log-item">{{ log }}</li>
      </ul>
      <div class="combate-actions">
        <button class="combate-btn-tick" @click="siguienteRival">✅</button>
        <button class="combate-btn-cross" @click="reiniciar">❌</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['personaje'])

const poblacionTotal = 100
const porcentajeLuchadores = 0.1
const cantidadLuchadores = Math.floor(poblacionTotal * porcentajeLuchadores)

const paises = [
  'España', 'Brasil', 'Japón', 'EEUU', 'Nigeria', 'Alemania', 'México', 'Francia', 'Argentina', 'Italia',
  'Inglaterra', 'Portugal', 'Holanda', 'Bélgica', 'Uruguay', 'Chile', 'Colombia', 'Senegal', 'Croacia', 'Suiza'
]
const nombresBase = ['Carlos', 'Luisa', 'Pedro', 'Sofía', 'Andrés', 'Marta', 'Juan', 'Laura', 'Diego', 'Ana']
const sexos = ['Masculino', 'Femenino']

const generarNombre = () => `${nombresBase[Math.floor(Math.random() * nombresBase.length)]} #${Math.floor(Math.random() * 1000)}`
const generarPais = () => paises[Math.floor(Math.random() * paises.length)]
const generarAltura = () => Math.floor(Math.random() * 40) + 160
const generarEdad = () => Math.floor(Math.random() * 22) + 18
const generarSexo = () => sexos[Math.floor(Math.random() * sexos.length)]
const generarFuerza = () => Math.floor(Math.random() * 51) + 50
const generarAgilidad = () => Math.floor(Math.random() * 51) + 50
const generarResistencia = () => Math.floor(Math.random() * 51) + 50
const generarHabilidad = () => Math.floor(Math.random() * 51) + 50
const generarInteligencia = () => Math.floor(Math.random() * 51) + 50
const generarPeso = () => Math.floor(Math.random() * 51) + 60
const generarExperiencia = () => Math.floor(Math.random() * 11)
const generarCondicionFisica = () => Math.floor(Math.random() * 51) + 50
const generarCoeficienteLucha = () => (Math.random() * 2 + 1).toFixed(2)

const luchadores = ref([])

for (let i = 0; i < cantidadLuchadores - 1; i++) {
  luchadores.value.push({
    nombre: generarNombre(),
    edad: generarEdad(),
    sexo: generarSexo(),
    altura: generarAltura(),
    pais: generarPais(),
    fuerza: generarFuerza(),
    agilidad: generarAgilidad(),
    resistencia: generarResistencia(),
    habilidad: generarHabilidad(),
    inteligencia: generarInteligencia(),
    peso: generarPeso(),
    experiencia: generarExperiencia(),
    condicionFisica: generarCondicionFisica(),
    coeficienteLucha: Number(generarCoeficienteLucha()),
    vida: 100
  })
}

luchadores.value.unshift({
  nombre: props.personaje.nombre,
  edad: props.personaje.edad ?? generarEdad(),
  sexo: props.personaje.sexo ?? generarSexo(),
  altura: props.personaje.altura ?? generarAltura(),
  pais: props.personaje.pais ?? generarPais(),
  fuerza: props.personaje.fuerza ?? generarFuerza(),
  agilidad: props.personaje.agilidad ?? generarAgilidad(),
  resistencia: props.personaje.resistencia ?? generarResistencia(),
  habilidad: props.personaje.habilidad ?? generarHabilidad(),
  inteligencia: props.personaje.inteligencia ?? generarInteligencia(),
  peso: props.personaje.peso ?? generarPeso(),
  experiencia: props.personaje.experiencia ?? generarExperiencia(),
  condicionFisica: props.personaje.condicionFisica ?? generarCondicionFisica(),
  coeficienteLucha: props.personaje.coeficienteLucha ?? Number(generarCoeficienteLucha()),
  vida: 100
})

const combateLog = ref([])
const ganador = ref(null)
const combateIniciado = ref(false)
const combateTerminado = ref(false)

const personaje = computed(() => luchadores.value[0])
const rival = computed(() => luchadores.value[1])

const rondas = [
  // Octavos (16)
  ['🇪🇸','🇧🇷','🇯🇵','🇺🇸','🇳🇬','🇩🇪','🇲🇽','🇫🇷','🇦🇷','🇮🇹','🇬🇧','🇵🇹','🇳🇱','🇧🇪','🇺🇾','🇨🇱'],
  // Cuartos (8)
  ['🇪🇸','🇧🇷','🇯🇵','🇺🇸','🇳🇬','🇩🇪','🇲🇽','🇫🇷'],
  // Semis (4)
  ['🇪🇸','🇧🇷','🇯🇵','🇺🇸'],
  // Final (2)
  ['🇪🇸','🇧🇷'],
  // Campeón (1)
  ['🏆']
]

// Ya no hay combate automático, solo log de enfrentamiento
function luchar() {
  combateLog.value = [`${personaje.value.nombre} vs ${rival.value.nombre}`]
  combateTerminado.value = true
}

function siguienteRival() {
  combateTerminado.value = false
  if (luchadores.value.length > 1) {
    // El usuario decide si gana, así que siempre pasa el personaje principal
    luchadores.value.splice(1, 1)
    if (luchadores.value.length === 1) {
      ganador.value = personaje.value
    }
  }
}

function reiniciar() {
  window.location.reload()
}
</script>

<style scoped>
.bracket-bg {
  background: url('/bracket-bg.png'), linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
  background-size: cover;
  background-blend-mode: lighten;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main-container {
  width: 100%;
}
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 32rem;
  margin-bottom: 2rem;
}
.main-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #1e3a8a;
  text-shadow: 1px 2px 6px #b3b3b3;
}
.fight-btn {
  background: linear-gradient(to right, #facc15, #fde047);
  color: #222;
  font-weight: bold;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px #eab30855;
  border: 2px solid #fde047;
  transition: background 0.2s;
  animation: bounce 1s infinite alternate;
  font-size: 1.1rem;
}
@keyframes bounce {
  to { transform: translateY(-6px);}
}
.winner-msg {
  color: #16a34a;
  font-size: 2rem;
  font-weight: bold;
  background: rgba(255,255,255,0.8);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px #16a34a33;
}
.fighters-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  max-width: 64rem;
  padding: 2rem 0;
  background: rgba(255,255,255,0.8);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px #60a5fa33;
  border: 4px solid #bfdbfe;
}
.fighter-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 12rem;
  max-width: 16rem;
}
.fighter-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
.fighter-title.blue {
  color: #2563eb;
}
.fighter-title.red {
  color: #dc2626;
}
.fighter-list {
  font-size: 0.8rem;
  width: 100%;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 1px 4px #0001;
  margin: 0;
  list-style: none;
}
.fighter-list.blue-bg {
  background: #eff6ff;
}
.fighter-list.red-bg {
  background: #fee2e2;
}
.vs-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 8rem;
}
.vs-text {
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 2px 2px 8px #fca5a5;
  user-select: none;
}
.combate-log {
  margin-top: 2rem;
  max-width: 36rem;
  width: 100%;
  background: rgba(255,255,255,0.9);
  border-radius: 1rem;
  box-shadow: 0 2px 12px #0001;
  padding: 1rem;
  list-style: square;
}
.combate-log-item {
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}
.champions-bracket-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0.18;
}

.bracket-elim {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  width: 80vw;
  max-width: 1200px;
  margin: auto;
}

.bracket-elim-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.bracket-elim-cell {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #0002;
  padding: 0.7rem 1.2rem;
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  color: #2563eb;
  border: 2px solid #93c5fd;
  opacity: 0.85;
  min-width: 2.5em;
}

.bracket-flag {
  font-size: 2rem;
  letter-spacing: 0.04em;
}
.combate-actions-center {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
}
.combate-btn-tick, .combate-btn-cross {
  font-size: 2.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.1s;
}
.combate-btn-tick:hover { color: #16a34a; transform: scale(1.2);}
.combate-btn-cross:hover { color: #dc2626; transform: scale(1.2);}
</style>
