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
        <div class="fighter-header-row">
          <img :src="avatarDefault" alt="Avatar" class="avatar-mini" />
        </div>
        <!-- Luchador principal -->
        <ul class="fighter-list blue-bg">
          <li><b>Nombre:</b> {{ personaje.nombre }}</li>
          <li><b>País:</b> {{ personaje.pais }} <span v-if="personaje.bandera">{{ personaje.bandera }}</span></li>
          <li><b>Altura:</b> {{ personaje.altura }} cm</li>
          <li><b>Peso:</b> {{ personaje.peso }} kg</li>
          <li><b>Press banca:</b> {{ personaje.pressBanca }} kg</li>
          <li><b>Agilidad:</b> {{ personaje.agilidad }}</li>
          <li><b>Objeto:</b> {{ rival.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ rival.habilidad }}</li>
          <li><b>Profesión:</b> {{ personaje.profesion }}</li>
          <li><b>Discapacidad:</b> {{ personaje.discapacidad }}</li>
        </ul>
      </div>
      <div class="vs-center">
        <span class="vs-text">VS</span>
      </div>
      <div class="fighter-card fighter-right">
        <div class="fighter-header-row">
          <img :src="avatarDefault" alt="Avatar" class="avatar-mini-rival" />
        </div>
        <!-- Rival -->
        <ul class="fighter-list red-bg">
          <li><b>Nombre:</b> {{ rival.nombre }}</li>
          <li><b>País:</b> {{ rival.pais }} <span v-if="rival.bandera">{{ rival.bandera }}</span></li>
          <li><b>Altura:</b> {{ rival.altura }} cm</li>
          <li><b>Peso:</b> {{ rival.peso }} kg</li>
          <li><b>Press banca:</b> {{ rival.pressBanca }} kg</li>
          <li><b>Agilidad:</b> {{ rival.agilidad }}</li>
          <li><b>Objeto:</b> {{ rival.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ rival.habilidad }}</li>
          <li><b>Profesión:</b> {{ rival.profesion }}</li>
          <li><b>Discapacidad:</b> {{ rival.discapacidad }}</li>
        </ul>
      </div>
    </div>
    <!-- Botones y mensaje debajo de los luchadores -->
    <div v-if="combateIniciado && !combateTerminado" class="combate-actions-center combate-bajas-row">
      <span class="combate-bajas-msg">¿Te lo bajas?</span>
      <button class="combate-btn-tick" @click="siguienteRival">✅</button>
      <button class="combate-btn-cross" @click="reiniciar">❌</button>
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
import avatarDefault from '../assets/avatar-default.png'

const props = defineProps(['personaje'])

const poblacionTotal = 100
const porcentajeLuchadores = 0.1
const cantidadLuchadores = Math.floor(poblacionTotal * porcentajeLuchadores)

const paisesProb = [
  { nombre: 'China', emoji: '🇨🇳', peso: 17.4 },
  { nombre: 'India', emoji: '🇮🇳', peso: 17.7 },
  { nombre: 'EE. UU.', emoji: '🇺🇸', peso: 4.2 },
  { nombre: 'Indonesia', emoji: '🇮🇩', peso: 3.4 },
  { nombre: 'Pakistán', emoji: '🇵🇰', peso: 3.0 },
  { nombre: 'Nigeria', emoji: '🇳🇬', peso: 2.8 },
  { nombre: 'Brasil', emoji: '🇧🇷', peso: 2.7 },
  { nombre: 'Bangladés', emoji: '🇧🇩', peso: 2.1 },
  { nombre: 'Rusia', emoji: '🇷🇺', peso: 1.8 },
  { nombre: 'México', emoji: '🇲🇽', peso: 1.6 },
  { nombre: 'Japón', emoji: '🇯🇵', peso: 1.5 },
  { nombre: 'Filipinas', emoji: '🇵🇭', peso: 1.4 },
  { nombre: 'Egipto', emoji: '🇪🇬', peso: 1.4 },
  { nombre: 'Etiopía', emoji: '🇪🇹', peso: 1.6 },
  { nombre: 'Vietnam', emoji: '🇻🇳', peso: 1.2 },
  { nombre: 'Alemania', emoji: '🇩🇪', peso: 1.0 },
  { nombre: 'Irán', emoji: '🇮🇷', peso: 1.1 },
  { nombre: 'Turquía', emoji: '🇹🇷', peso: 1.1 },
  { nombre: 'Francia', emoji: '🇫🇷', peso: 0.8 },
  { nombre: 'Reino Unido', emoji: '🇬🇧', peso: 0.8 },
  { nombre: 'Italia', emoji: '🇮🇹', peso: 0.7 },
  { nombre: 'España', emoji: '🇪🇸', peso: 0.6 },
  { nombre: 'Argentina', emoji: '🇦🇷', peso: 0.6 }
]

// Función para elegir país según peso
function generarPaisProb() {
  const total = paisesProb.reduce((sum, p) => sum + p.peso, 0)
  let r = Math.random() * total
  for (const p of paisesProb) {
    if (r < p.peso) return p
    r -= p.peso
  }
  return paisesProb[paisesProb.length - 1]
}

const nombresBase = [
  'Carlos', 'Luisa', 'Pedro', 'Sofía', 'Andrés', 'Marta', 'Juan', 'Laura', 'Diego', 'Ana',
  'Miguel', 'Lucía', 'David', 'Paula', 'Javier', 'Sara', 'Alberto', 'Elena', 'Manuel', 'Carmen',
  'Raúl', 'Patricia', 'Rubén', 'Isabel', 'Sergio', 'Cristina', 'Álvaro', 'María', 'Iván', 'Beatriz',
  'Hugo', 'Nuria', 'Pablo', 'Silvia', 'Mario', 'Rosa', 'Daniel', 'Eva', 'Alejandro', 'Julia',
  'Francisco', 'Teresa', 'Antonio', 'Natalia', 'José', 'Mónica', 'Guillermo', 'Lorena', 'Samuel', 'Clara',
  'Óscar', 'Patricio', 'Esteban', 'Alicia', 'Gabriel', 'Noelia', 'Tomás', 'Andrea', 'Emilio', 'Victoria',
  'Ángel', 'Sandra', 'Adrián', 'Irene', 'Enrique', 'Raquel', 'Felipe', 'Gloria', 'Joaquín', 'Verónica',
  'Eduardo', 'Rocío', 'Fernando', 'Miriam', 'Jorge', 'Aitana', 'Luis', 'Lidia', 'Saúl', 'Elsa',
  'Martín', 'Ainhoa', 'Bruno', 'Berta', 'Mateo', 'Ariadna', 'Lucas', 'Jimena', 'Marcos', 'Olga',
  'Iván', 'Esther', 'Dario', 'Carla', 'Julio', 'Lara', 'Sebastián', 'Aina', 'Ricardo', 'Nerea'
]
const sexos = ['Masculino', 'Femenino']

const generarNombre = () => nombresBase[Math.floor(Math.random() * nombresBase.length)]
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
const generarPressBanca = () => Math.floor(Math.random() * 101) + 50 // 50 a 150

const profesiones = [
  'Ingeniero', 'Camionero', 'Profesor', 'Médico', 'Panadero', 'Policía', 'Bombero', 'Carpintero', 'Fontanero',
  'Cocinero', 'Mecánico', 'Abogado', 'Artista', 'Músico', 'Deportista', 'Científico', 'Enfermero', 'Piloto',
  'Electricista', 'Jardinero', 'Veterinario', 'Periodista', 'Informático', 'Arquitecto', 'Estilista'
]
const generarProfesion = () => profesiones[Math.floor(Math.random() * profesiones.length)]

const objetos = [
  'Sin objetos', 'Desatascador', 'Cepillo de dientes', 'Cuchillo', 'Bate', 'Sartén', 'Pala', 'Peluche', 'Libro', 'Ladrillo',
  'Cuerda', 'Taza', 'Regla', 'Martillo', 'Destornillador', 'Bolso', 'Sombrero', 'Piedra', 'Cuchara', 'Escoba', 'Calcetín', 'Palo selfie'
]
const generarObjeto = () => objetos[Math.floor(Math.random() * objetos.length)]

const discapacidades = [
  'Ninguna', 'Sin un ojo', 'Sin un brazo', 'Sin una pierna', 'Sin piernas', 'Sin dedo pulgar', 'Sin oreja',
  'Cojea', 'Brazo ortopédico', 'Pierna ortopédica', 'Ceguera parcial', 'Sin dedos de los pies', '8 dedos en una mano', 'Solo 3 dedos',
  'Brazo hasta el codo', 'Sin boca', 'Sin pie', 'Sin mano', 'Sin rodilla', 'Sin codo', 'Sin hombro', 'Pierna hasta la rodilla'
]
// Nueva función para generar discapacidad con un 20% de probabilidad
function generarDiscapacidadProb() {
  // 20% de probabilidad de tener discapacidad
  if (Math.random() < 0.45) {
    // Elige una discapacidad aleatoria que no sea 'Ninguna'
    const soloDiscapacidades = discapacidades.filter(d => d !== 'Ninguna');
    return soloDiscapacidades[Math.floor(Math.random() * soloDiscapacidades.length)];
  }
  // 80% de probabilidad de no tener discapacidad
  return 'Ninguna';
}

const luchadores = ref([])

const nombresPorPais = {
  'China': ['Wei', 'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Xu', 'Sun', 'Ma', 'Zhou', 'Gao'],
  'India': ['Amit', 'Priya', 'Rahul', 'Anjali', 'Vijay', 'Sunita', 'Raj', 'Pooja', 'Sanjay', 'Neha', 'Arjun', 'Rani', 'Deepak', 'Kiran', 'Manoj'],
  'EE. UU.': ['John', 'Emily', 'Michael', 'Jessica', 'David', 'Ashley', 'James', 'Sarah', 'Robert', 'Amanda', 'William', 'Jennifer', 'Matthew', 'Elizabeth', 'Joshua'],
  'Indonesia': ['Agus', 'Siti', 'Budi', 'Dewi', 'Joko', 'Putri', 'Rizki', 'Fitri', 'Andi', 'Nur', 'Yusuf', 'Sri', 'Hendra', 'Rina', 'Dian'],
  'Pakistán': ['Ali', 'Fatima', 'Ahmed', 'Ayesha', 'Hassan', 'Sana', 'Imran', 'Zainab', 'Bilal', 'Maryam', 'Usman', 'Sara', 'Hamza', 'Rabia', 'Kashif'],
  'Nigeria': ['Emeka', 'Ngozi', 'Chinedu', 'Amina', 'Ifeanyi', 'Bola', 'Uche', 'Chika', 'Tunde', 'Ada', 'Segun', 'Kemi', 'Yemi', 'Amaka', 'Sola'],
  'Brasil': ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Gabriel', 'Camila', 'Mateus', 'Larissa', 'Felipe', 'Beatriz', 'Rafael', 'Fernanda', 'Bruno'],
  'Bangladés': ['Abir', 'Sumaiya', 'Hasan', 'Nusrat', 'Sabbir', 'Mitu', 'Rafi', 'Tania', 'Shuvo', 'Rima', 'Sakib', 'Mou', 'Tanvir', 'Jannat', 'Rasel'],
  'Rusia': ['Ivan', 'Anna', 'Dmitry', 'Olga', 'Sergey', 'Elena', 'Alexey', 'Natalia', 'Vladimir', 'Tatiana', 'Andrey', 'Ekaterina', 'Mikhail', 'Irina', 'Nikita'],
  'México': ['Juan', 'María', 'José', 'Guadalupe', 'Luis', 'Ana', 'Carlos', 'Carmen', 'Jorge', 'Patricia', 'Miguel', 'Verónica', 'Francisco', 'Leticia', 'Ricardo'],
  'Japón': ['Haruto', 'Yui', 'Sota', 'Rin', 'Yuto', 'Sakura', 'Yuki', 'Hina', 'Kaito', 'Mio', 'Ren', 'Yuna', 'Daiki', 'Aoi', 'Takumi'],
  'Filipinas': ['Jose', 'Maria', 'Juan', 'Angel', 'Mark', 'Grace', 'Paul', 'Joy', 'James', 'Rose', 'Michael', 'Ann', 'John', 'May', 'Anthony'],
  'Egipto': ['Mohamed', 'Fatma', 'Ahmed', 'Sara', 'Omar', 'Mona', 'Youssef', 'Aya', 'Mahmoud', 'Nour', 'Mostafa', 'Salma', 'Khaled', 'Heba', 'Tamer'],
  'Etiopía': ['Abebe', 'Alem', 'Kebede', 'Mulu', 'Tsegaye', 'Hana', 'Bekele', 'Selam', 'Getachew', 'Almaz', 'Tesfaye', 'Mekdes', 'Haile', 'Tigist', 'Solomon'],
  'Vietnam': ['Nguyen', 'Anh', 'Tran', 'Hoa', 'Le', 'Huong', 'Phuong', 'Minh', 'Thu', 'Quang', 'Tuan', 'Hang', 'Duc', 'Linh', 'Son'],
  'Alemania': ['Lukas', 'Sophie', 'Leon', 'Marie', 'Finn', 'Anna', 'Paul', 'Laura', 'Jonas', 'Lea', 'Ben', 'Lena', 'Elias', 'Mia', 'Maximilian'],
  'Irán': ['Mohammad', 'Fatemeh', 'Ali', 'Zahra', 'Reza', 'Maryam', 'Hossein', 'Sara', 'Mehdi', 'Narges', 'Amir', 'Arezoo', 'Saeed', 'Shirin', 'Hassan'],
  'Turquía': ['Mehmet', 'Fatma', 'Mustafa', 'Ayşe', 'Ahmet', 'Emine', 'Ali', 'Hatice', 'Hüseyin', 'Zeynep', 'Hasan', 'Elif', 'İbrahim', 'Merve', 'Osman'],
  'Francia': ['Lucas', 'Emma', 'Nathan', 'Chloé', 'Enzo', 'Manon', 'Louis', 'Léa', 'Hugo', 'Camille', 'Gabriel', 'Sarah', 'Arthur', 'Inès', 'Jules'],
  'Reino Unido': ['Oliver', 'Olivia', 'George', 'Emily', 'Harry', 'Jessica', 'Jack', 'Sophie', 'Jacob', 'Lily', 'Charlie', 'Amelia', 'Thomas', 'Isabella', 'William'],
  'Italia': ['Francesco', 'Sofia', 'Alessandro', 'Giulia', 'Lorenzo', 'Aurora', 'Andrea', 'Alice', 'Matteo', 'Ginevra', 'Gabriele', 'Emma', 'Leonardo', 'Martina', 'Riccardo'],
  'España': ['Antonio', 'María', 'Manuel', 'Carmen', 'José', 'Ana', 'Francisco', 'Isabel', 'David', 'Laura', 'Juan', 'Cristina', 'Javier', 'Marta', 'Daniel'],
  'Argentina': ['Santiago', 'Sofía', 'Mateo', 'Valentina', 'Martín', 'Martina', 'Lucas', 'Lucía', 'Benjamín', 'Camila', 'Juan', 'Julieta', 'Pedro', 'Agustina', 'Tomás']
}

// Generador de nombre según país:
function generarNombrePorPais(pais) {
  const lista = nombresPorPais[pais] || ['Alex'];
  return lista[Math.floor(Math.random() * lista.length)];
}

// ...en la generación de luchadores...
for (let i = 0; i < cantidadLuchadores - 1; i++) {
  const paisObj = generarPaisProb();
  luchadores.value.push({
    nombre: generarNombrePorPais(paisObj.nombre),
    edad: generarEdad(),
    sexo: generarSexo(),
    altura: generarAltura(),
    pais: paisObj.nombre,
    bandera: paisObj.emoji,
    pressBanca: generarPressBanca(),
    agilidad: generarAgilidad(),
    resistencia: generarResistencia(),
    objeto: generarObjeto(),
    habilidad: generarHabilidad(),
    profesion: generarProfesion(),
    peso: generarPeso(),
    experiencia: generarExperiencia(),
    condicionFisica: generarCondicionFisica(),
    coeficienteLucha: Number(generarCoeficienteLucha()),
    vida: 100,
    discapacidad: generarDiscapacidadProb() // <--- aquí
  })
}

luchadores.value.unshift({
  nombre: props.personaje.nombre,
  edad: props.personaje.edad ?? generarEdad(),
  sexo: props.personaje.sexo ?? generarSexo(),
  altura: props.personaje.altura ?? generarAltura(),
  pais: props.personaje.pais ?? generarPais(),
  pressBanca: props.personaje.pressBanca ?? generarPressBanca(),
  agilidad: props.personaje.agilidad ?? generarAgilidad(),
  resistencia: props.personaje.resistencia ?? generarResistencia(),
  objeto: props.personaje.objeto ?? generarObjeto(), // ← ALEATORIO si no se pasa
  habilidad: props.personaje.habilidad ?? generarHabilidad(), // ← ALEATORIO si no se pasa
  profesion: props.personaje.profesion ?? generarProfesion(),
  peso: props.personaje.peso ?? generarPeso(),
  experiencia: props.personaje.experiencia ?? generarExperiencia(),
  condicionFisica: props.personaje.condicionFisica ?? generarCondicionFisica(),
  coeficienteLucha: props.personaje.coeficienteLucha ?? Number(generarCoeficienteLucha()),
  vida: 100,
  discapacidad: props.personaje.discapacidad ?? generarDiscapacidadProb()
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
  justify-content: flex-start;
  width: 8rem;
  margin-top: -13.5rem; /* Súbelo mucho más arriba */
}
.vs-text {
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 2px 2px 8px #fca5a5;
  user-select: none;
  margin-bottom: 1rem; /* Añade separación con los botones */
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
.fighter-avatar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar-mini {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #2563eb;
  background: #fff;
  box-shadow: 0 1px 4px #0001;
}

.avatar-mini-rival{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #eb2525;
  background: #fff;
  box-shadow: 0 1px 4px #0001;
}
</style>
