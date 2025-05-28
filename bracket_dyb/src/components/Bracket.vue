<template>
  <div class="bracket-bg main-container">
    <!-- Botón para cerrar el combate y ver el fondo -->
    <button 
      v-if="combateIniciado && !combateTerminado && !esCampeon" 
      class="close-combate-btn" 
      @click="mostrarBracket = true; combateIniciado = false"
      title="Cerrar combate"
    >✖</button>

    <!-- Botón para volver a la lucha del usuario -->
    <button 
      v-if="mostrarBracket && !esCampeon && !usuarioEliminado" 
      class="volver-combate-btn"
      @click="mostrarBracket = false; combateIniciado = true"
      title="Volver a mi combate"
    >👊 Volver a mi lucha</button>

    <!-- Bracket visual SOLO si mostrarBracket está activo o el usuario ha sido eliminado -->
    <div v-if="(mostrarBracket && !usuarioEliminado) || usuarioEliminado" class="bracket-visual-vertical-container">
      <div class="bracket-vertical">
        <div
          v-for="(ronda, rondaIdx) in [...bracket].reverse()"
          :key="rondaIdx"
          class="bracket-vertical-row"
        >
          <div
            v-for="(luchador, i) in ronda"
            :key="i"
            class="bracket-vertical-cell"
            :class="{
              'bracket-user': luchador.esUsuario,
              'bracket-winner': ganadorTorneo && luchador.nombre === ganadorTorneo.nombre
            }"
            @click="verStatsLuchador(luchador)"
          >
            <span class="bracket-flag">
              <span v-if="ganadorTorneo && luchador.nombre === ganadorTorneo.nombre" class="bracket-copa">🏆</span>
              {{ luchador.bandera || '🏳️' }}
            </span>
            <div class="bracket-nombre">
              {{ luchador.nombre }}
              <span v-if="ganadorTorneo && luchador.nombre === ganadorTorneo.nombre" class="bracket-winner-label">GANADOR</span>
            </div>
            <!-- Línea vertical hacia arriba si no es la última ronda -->
            <div
              v-if="rondaIdx < bracket.length - 1"
              class="bracket-vertical-line"
              :style="{ height: `${getLineHeight(ronda.length)}px` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de stats del luchador -->
    <div v-if="luchadorStats" class="stats-modal">
      <button class="close-stats-btn" @click="luchadorStats = null" title="Cerrar">✖</button>
      <div class="stats-content">
        <span class="stats-flag">{{ luchadorStats.bandera || '🏳️' }}</span>
        <h2 class="stats-title">{{ luchadorStats.nombre }}</h2>
        <ul class="stats-list">
          <li><b>País:</b> {{ luchadorStats.pais }}</li>
          <li><b>Altura:</b> {{ luchadorStats.altura }} cm</li>
          <li><b>Peso:</b> {{ luchadorStats.peso }} kg</li>
          <li><b>Press banca:</b> {{ luchadorStats.pressBanca }} kg</li>
          <li><b>Agilidad:</b> {{ luchadorStats.agilidad }}</li>
          <li><b>Objeto:</b> {{ luchadorStats.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ luchadorStats.habilidad }}</li>
          <li><b>Profesión:</b> {{ luchadorStats.profesion }}</li>
          <li><b>Discapacidad:</b> {{ luchadorStats.discapacidad }}</li>
        </ul>
      </div>
    </div>

    <!-- Botón para empezar a luchar -->
    <div v-if="!combateIniciado && !mostrarBracket && !usuarioEliminado" class="header-bar">
      <h1 class="main-title">🏆 Torneo Mundial de Luchadores</h1>
      <button @click="combateIniciado = true" class="fight-btn">
        ¡Empezar a luchar!
      </button>
    </div>

    <!-- Combate: solo los luchadores y el VS -->
    <div v-if="combateIniciado && !combateTerminado && !esCampeon && !mostrarBracket && !usuarioEliminado" class="fighters-row fighters-row-centered">
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
          <li><b>Objeto:</b> {{ personaje.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ personaje.habilidad }}</li>
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
    <div v-if="combateIniciado && !combateTerminado && !esCampeon && !mostrarBracket && !usuarioEliminado" class="combate-actions-center combate-bajas-row">
      <span class="combate-bajas-msg">¿Te lo bajas?</span>
      <button class="combate-btn-tick" @click="siguienteRival">✅</button>
      <button class="combate-btn-cross" @click="perderRival">❌</button>
    </div>

    <!-- Log y botones de avanzar o salir tras el combate -->
    <div v-if="combateTerminado && !esCampeon && !mostrarBracket && !usuarioEliminado" class="combate-post">
      <ul class="combate-log">
        <li v-for="log in combateLog" :key="log" class="combate-log-item">{{ log }}</li>
      </ul>
      <div class="combate-actions">
        <button class="combate-btn-tick" @click="siguienteRival">✅</button>
        <button class="combate-btn-cross" @click="reiniciar">❌</button>
      </div>
    </div>

    <!-- Cartel de CAMPEÓN -->
    <div v-if="esCampeon" class="campeon-modal">
      <button class="close-campeon-btn" @click="reiniciar" title="Cerrar">✖</button>
      <div class="campeon-content">
        <span class="campeon-copa">🏆</span>
        <h2 class="campeon-title">¡{{ personaje.nombre }} es el CAMPEÓN!</h2>
        <p class="campeon-subtitle">¡Felicidades, has ganado el torneo mundial!</p>
      </div>
    </div>

    <!-- Si el usuario ha sido eliminado, muestra el bracket y el ganador final -->
    <div v-if="usuarioEliminado">
      <div class="bracket-visual-vertical-container">
        <div class="bracket-vertical">
          <div
            v-for="(ronda, rondaIdx) in [...bracket].reverse()"
            :key="rondaIdx"
            class="bracket-vertical-row"
          >
            <div
              v-for="(luchador, i) in ronda"
              :key="i"
              class="bracket-vertical-cell"
              :class="{
                'bracket-user': luchador.esUsuario,
                'bracket-winner': ganadorTorneo && luchador.nombre === ganadorTorneo.nombre
              }"
              @click="verStatsLuchador(luchador)"
            >
              <span class="bracket-flag">
                <span v-if="ganadorTorneo && luchador.nombre === ganadorTorneo.nombre" class="bracket-copa">🏆</span>
                {{ luchador.bandera || '🏳️' }}
              </span>
              <div class="bracket-nombre">
                {{ luchador.nombre }}
                <span v-if="ganadorTorneo && luchador.nombre === ganadorTorneo.nombre" class="bracket-winner-label">GANADOR</span>
              </div>
              <div
                v-if="rondaIdx < bracket.length - 1"
                class="bracket-vertical-line"
                :style="{ height: `${getLineHeight(ronda.length)}px` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="usuario-eliminado-simple-msg">
        Has sido eliminado del torneo
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  'Cuerda', 'Taza', 'Regla', 'Martillo', 'Destornillador', 'Bolso', 'Sombrero', 'Piedra', 'Cuchara', 'Escoba', 'Calcetín', 'Palo selfie',
  'Almohada', 'Linterna', 'Pelota', 'Botella', 'Paraguas', 'Cascabel', 'Cinta adhesiva', 'Cubo', 'Espejo', 'Zapatilla',
  'Candelabro', 'Teléfono viejo', 'Llave inglesa', 'Cuaderno', 'Cacerola', 'Estuche', 'Cinta métrica', 'Gafas de sol', 'Juguete', 'Percha',
  'Mochila', 'Colador', 'Bote de pintura', 'Tijeras', 'Radiocasete', 'Muñeca', 'Cepillo para el pelo', 'Toalla', 'Globo', 'Alambre',
  'Dildo de Goma Rosa de 30 cm' ,'Muñeca inchable','Porro', 'Bastón de madera', 'Cinturón de castidad', 'Pipa de agua', 'Bola de bolos', 'Cuchara de palo', 'Escudo medieval',
];

const generarObjeto = () => objetos[Math.floor(Math.random() * objetos.length)]

const discapacidades = [
  'Ninguna', 'Sin un ojo', 'Sin un brazo', 'Sin una pierna', 'Sin piernas', 'Sin dedo pulgar', 'Sin oreja',
  'Cojea', 'Brazo ortopédico', 'Pierna ortopédica', 'Ceguera parcial', 'Sin dedos de los pies', '8 dedos en una mano', 'Solo 3 dedos',
  'Brazo hasta el codo', 'Sin boca', 'Sin pie', 'Sin mano', 'Sin rodilla', 'Sin codo', 'Sin hombro', 'Pierna hasta la rodilla','Impotencia','Sin testículos','Dierna',
  'Cegera total', 'Sin nariz', 'Sin cadera', 'Sin tobillo', 'Sin muñeca', 
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

// Genera objeto y habilidad aleatorios SOLO UNA VEZ para el jugador principal
const objetoJugador = ref(props.personaje.objeto || generarObjeto())
const habilidadJugador = ref(props.personaje.habilidad || generarHabilidad())

luchadores.value.unshift({
  nombre: props.personaje.nombre,
  edad: props.personaje.edad ?? generarEdad(),
  sexo: props.personaje.sexo ?? generarSexo(),
  altura: props.personaje.altura ?? generarAltura(),
  pais: props.personaje.pais ?? generarPais(),
  pressBanca: props.personaje.pressBanca ?? generarPressBanca(),
  agilidad: props.personaje.agilidad ?? generarAgilidad(),
  resistencia: props.personaje.resistencia ?? generarResistencia(),
  objeto: objetoJugador.value,         // ← SIEMPRE el mismo, aleatorio si no se pasa
  habilidad: habilidadJugador.value,   // ← SIEMPRE el mismo, aleatorio si no se pasa
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
const mostrarBracket = ref(false)
const rondaActual = ref(0)
const bracket = ref([]) // Array de arrays, cada subarray es una ronda

// Marca el usuario
luchadores.value[0].esUsuario = true

function generarBracketInicial() {
  // Mezcla los luchadores y los coloca en el bracket
  const mezclados = [...luchadores.value]
  for (let i = mezclados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]]
  }
  bracket.value = [mezclados]
  rondaActual.value = 0
}
onMounted(generarBracketInicial)

const usuarioEliminado = ref(false)
const ganadorTorneo = ref(null)

// Modifica avanzarBracket para guardar el ganador si solo queda uno
function avanzarBracket(usuarioPasa = false) {
  const ronda = bracket.value[rondaActual.value]
  const siguiente = []
  for (let i = 0; i < ronda.length; i += 2) {
    const a = ronda[i]
    const b = ronda[i + 1]
    if (!b) {
      siguiente.push(a)
      continue
    }
    // Si uno es el usuario y el usuario pasa
    if (a.esUsuario && usuarioPasa) {
      siguiente.push(a)
    } else if (b.esUsuario && usuarioPasa) {
      siguiente.push(b)
    } else if (a.esUsuario || b.esUsuario) {
      // Si el usuario NO pasa, no lo metemos en siguiente
      // El rival pasa automáticamente
      siguiente.push(a.esUsuario ? b : a)
    } else {
      // Gana el de mayor peso+altura
      const sumaA = a.peso + a.altura
      const sumaB = b.peso + b.altura
      siguiente.push(sumaA >= sumaB ? a : b)
    }
  }
  bracket.value.push(siguiente)
  rondaActual.value++
  // Si solo queda uno, es el ganador
  if (siguiente.length === 1) {
    ganadorTorneo.value = siguiente[0]
  }
}

// Cuando el usuario gana su combate:
function siguienteRival() {
  combateTerminado.value = false
  if (luchadores.value.length > 1) {
    // El usuario pasa, avanza el bracket con usuarioPasa=true
    avanzarBracket(true)
    // Actualiza luchadores.value para el siguiente combate del usuario
    const nuevaRonda = bracket.value[rondaActual.value]
    // El usuario siempre es el primero en el array
    luchadores.value.splice(0, luchadores.value.length, ...nuevaRonda)
    if (luchadores.value.length === 1) {
      ganador.value = personaje.value
    }
  }
}

// Cuando el usuario pierde su combate:
function perderRival() {
  usuarioEliminado.value = true
  avanzarBracket(false)
  // Elimina al usuario de luchadores.value para que no siga apareciendo en combates
  const nuevaRonda = bracket.value[rondaActual.value]
  luchadores.value.splice(0, luchadores.value.length, ...nuevaRonda)
  avanzarHastaElFinal() // <-- AVANZA HASTA EL FINAL
}

function avanzarHastaElFinal() {
  // Mientras no haya ganador, sigue avanzando el bracket
  while (bracket.value[bracket.value.length - 1].length > 1) {
    avanzarBracket(false)
  }
}

const personaje = computed(() => luchadores.value[0])
const rival = computed(() => luchadores.value[1])

// Detecta si ya eres campeón
const esCampeon = computed(() => luchadores.value.length === 1 && ganador.value)

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

function reiniciar() {
  window.location.reload()
}

const luchadorStats = ref(null)
function verStatsLuchador(luchador) {
  luchadorStats.value = luchador
}

function getLineHeight(numLuchadores) {
  // Ajusta la altura de la línea según el número de luchadores en la ronda
  if (numLuchadores <= 2) return 80;
  if (numLuchadores <= 4) return 60;
  if (numLuchadores <= 8) return 40;
  return 30;
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
.close-combate-btn {
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  z-index: 10;
  font-size: 2.2rem;
  background: #fff;
  border: 2px solid #dc2626;
  color: #dc2626;
  border-radius: 50%;
  width: 2.7rem;
  height: 2.7rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, color 0.2s, transform 0.1s;
}
.close-combate-btn:hover {
  background: #fee2e2;
  color: #fff;
  transform: scale(1.1);
}
.volver-combate-btn {
  position: fixed;
  top: 1.5rem;
  left: 2rem;
  z-index: 10;
  font-size: 1.2rem;
  background: #fff;
  border: 2px solid #2563eb;
  color: #2563eb;
  border-radius: 1.5rem;
  padding: 0.5rem 1.3rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, color 0.2s, transform 0.1s;
}
.volver-combate-btn:hover {
  background: #dbeafe;
  color: #1e40af;
  transform: scale(1.08);
}
.bracket-user {
  border: 3px solid #facc15 !important;
  background: #fef9c3 !important;
  color: #b45309 !important;
}
.campeon-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.65);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.campeon-content {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 6px 32px #0005;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 320px;
}
.campeon-copa {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 12px #facc15aa;
}
.campeon-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #f59e42;
  margin-bottom: 0.7rem;
  text-shadow: 0 2px 12px #facc15aa;
  text-align: center;
}
.campeon-subtitle {
  font-size: 1.2rem;
  color: #2563eb;
  text-align: center;
}
.close-campeon-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  font-size: 2rem;
  background: #fff;
  border: 2px solid #dc2626;
  color: #dc2626;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  z-index: 101;
}
.close-campeon-btn:hover {
  background: #fee2e2;
  color: #fff;
  transform: scale(1.1);
}
.bracket-visual-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: rgba(255,255,255,0.15);
  pointer-events: auto;
}
.bracket-elim-visual-vertical {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bracket-svg-lines {
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 1;
}
.bracket-elim-rows-center {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
}
.bracket-elim-row-visual {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
}
.bracket-elim-cell-visual {
  position: absolute;
  left: 0;
  width: 140px;
  height: 90px;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #0002;
  padding: 0.7rem 1.2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2563eb;
  border: 2px solid #93c5fd;
  opacity: 0.97;
  transition: border 0.2s, background 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bracket-elim-cell-visual .bracket-flag {
  font-size: 2rem;
  display: block;
}
.bracket-elim-cell-visual .bracket-nombre {
  font-size: 0.9em;
  margin-top: 0.2em;
  color: #222;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.bracket-elim-cell-visual.bracket-user {
  border: 3px solid #facc15 !important;
  background: #fef9c3 !important;
  color: #b45309 !important;
}
.bracket-elim-cell-visual.bracket-winner {
  border: 4px solid #16a34a !important;
  background: #dcfce7 !important;
  color: #166534 !important;
  box-shadow: 0 0 18px #16a34a88;
  position: relative;
}
.bracket-copa {
  font-size: 2rem;
  margin-right: 0.2em;
  vertical-align: middle;
  filter: drop-shadow(0 0 6px #facc15cc);
}
.bracket-winner-label {
  display: inline-block;
  background: #16a34a;
  color: #fff;
  font-size: 0.8em;
  font-weight: bold;
  border-radius: 0.7em;
  padding: 0.1em 0.7em;
  margin-left: 0.5em;
  margin-top: 0.2em;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 6px #16a34a33;
  vertical-align: middle;
}
.bracket-vertical-line {
  position: absolute;
  left: 50%;
  top: -80%;
  width: 3px;
  background: #60a5fa;
  z-index: 1;
  transform: translateX(-50%);
}
.bracket-visual-vertical-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: rgba(255,255,255,0.15);
  pointer-events: auto;
}
.bracket-vertical {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-end;
  gap: 2.5rem;
  width: 100%;
  max-width: 900px;
  margin: auto;
}
.bracket-vertical-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: 2.5rem;
  min-height: 90px;
  position: relative;
}
.bracket-vertical-cell {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #0002;
  padding: 0.7rem 1.2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2563eb;
  border: 2px solid #93c5fd;
  opacity: 0.97;
  min-width: 120px;
  min-height: 70px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: border 0.2s, background 0.2s;
}
.bracket-vertical-cell .bracket-flag {
  font-size: 2rem;
  display: block;
}
.bracket-vertical-cell .bracket-nombre {
  font-size: 0.9em;
  margin-top: 0.2em;
  color: #222;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.bracket-vertical-cell.bracket-user {
  border: 3px solid #facc15 !important;
  background: #fef9c3 !important;
  color: #b45309 !important;
}
.bracket-vertical-cell.bracket-winner {
  border: 4px solid #16a34a !important;
  background: #dcfce7 !important;
  color: #166534 !important;
  box-shadow: 0 0 18px #16a34a88;
  position: relative;
}
.stats-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.75);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stats-content {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 6px 32px #0008;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  animation: popStats 0.4s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes popStats {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.08);}
  100% { transform: scale(1); opacity: 1;}
}
.stats-flag {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.stats-title {
  font-size: 1.7rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 1rem;
  text-align: center;
}
.stats-list {
  font-size: 1.1rem;
  color: #222;
  list-style: none;
  padding: 0;
  margin: 0;
}
.stats-list li {
  margin-bottom: 0.4em;
}
.close-stats-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  font-size: 2rem;
  background: #fff;
  border: 2px solid #dc2626;
  color: #dc2626;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  z-index: 10001;
}
.close-stats-btn:hover {
  background: #fee2e2;
  color: #fff;
  transform: scale(1.1);
}
.usuario-eliminado-simple-msg {
  margin-top: 2.5rem;
  font-size: 2rem;
  color: #dc2626;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.03em;
}
</style>
