<template>
  <div class="bracket-bg main-container">
    <!-- Botón para cerrar el combate y ver el fondo -->
    <button 
      v-if="combateIniciado && !combateTerminado && !esCampeon" 
      class="close-combate-btn" 
      @click="mostrarBracket = true; combateIniciado = false"
      title="Cerrar combate"
    >Ir a la Clasificacion</button>

    <!-- Botón para volver a la lucha del usuario -->
    <button 
      v-if="mostrarBracket && !esCampeon && !usuarioEliminado" 
      class="volver-combate-btn"
      @click="mostrarBracket = false; combateIniciado = true"
      title="Volver a mi combate"
    >👊 Volver a mi lucha</button>

    <!-- Bracket visual SOLO si mostrarBracket está activo o el usuario ha sido eliminado -->
    <div v-if="(mostrarBracket && !((esCampeon && !mostrarModalCampeon) || (usuarioEliminado && !mostrarModalGanador)))" class="bracket-visual-vertical-container">
      <div class="bracket-vertical">
        <div
          v-for="(ronda, rondaIdx) in [...bracket].reverse()"
          :key="rondaIdx"
          class="bracket-vertical-row"
        >
          <div class="round-label">
            {{ getRoundName(ronda.length) }}
          </div>
          
          <div v-for="(par, parIdx) in getPares(ronda)" :key="parIdx" class="bracket-match">
            <div class="bracket-pair">
              <div 
                v-for="luchador in par" 
                :key="luchador?.nombre"
                class="bracket-vertical-cell"
                :class="{
                  'bracket-user': luchador?.esUsuario,
                  'winner': isWinner(luchador, rondaIdx),
                  'eliminated': isEliminated(luchador, rondaIdx)
                }"
                @click="luchador && verStatsLuchador(luchador)"
              >
                <span class="bracket-flag">
                  <span v-if="ganadorTorneo && luchador?.nombre === ganadorTorneo.nombre" class="bracket-copa">🏆</span>
                  {{ luchador?.bandera || '🏳️' }}
                </span>
                <span class="bracket-nombre">{{ luchador?.nombre || 'TBD' }}</span>
                <span v-if="ganadorTorneo && luchador?.nombre === ganadorTorneo.nombre" class="bracket-winner-label">
                  CAMPEÓN
                </span>
              </div>
            </div>
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
        <!-- Luchador principal SIEMPRE a la izquierda -->
        <ul class="fighter-list blue-bg">
          <li><b>Nombre:</b> {{ usuarioLuchador.nombre }}</li>
          <li><b>País:</b> {{ usuarioLuchador.pais }} <span v-if="usuarioLuchador.bandera">{{ usuarioLuchador.bandera }}</span></li>
          <li><b>Altura:</b> {{ usuarioLuchador.altura }} cm</li>
          <li><b>Peso:</b> {{ usuarioLuchador.peso }} kg</li>
          <li><b>Press banca:</b> {{ usuarioLuchador.pressBanca }} kg</li>
          <li><b>Agilidad:</b> {{ usuarioLuchador.agilidad }}</li>
          <li><b>Objeto:</b> {{ usuarioLuchador.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ usuarioLuchador.habilidad }}</li>
          <li><b>Profesión:</b> {{ usuarioLuchador.profesion }}</li>
          <li><b>Discapacidad:</b> {{ usuarioLuchador.discapacidad }}</li>
        </ul>
      </div>
      <div class="vs-center">
        <span class="vs-text">VS</span>
      </div>
      <div class="fighter-card fighter-right">
        <div class="fighter-header-row">
          <img :src="avatarDefault" alt="Avatar" class="avatar-mini-rival" />
        </div>
        <!-- Rival SIEMPRE a la derecha -->
        <ul class="fighter-list red-bg">
          <li><b>Nombre:</b> {{ rivalLuchador.nombre }}</li>
          <li><b>País:</b> {{ rivalLuchador.pais }} <span v-if="rivalLuchador.bandera">{{ rivalLuchador.bandera }}</span></li>
          <li><b>Altura:</b> {{ rivalLuchador.altura }} cm</li>
          <li><b>Peso:</b> {{ rivalLuchador.peso }} kg</li>
          <li><b>Press banca:</b> {{ rivalLuchador.pressBanca }} kg</li>
          <li><b>Agilidad:</b> {{ rivalLuchador.agilidad }}</li>
          <li><b>Objeto:</b> {{ rivalLuchador.objeto }}</li>
          <li><b>Habilidad con el objeto:</b> {{ rivalLuchador.habilidad }}</li>
          <li><b>Profesión:</b> {{ rivalLuchador.profesion }}</li>
          <li><b>Discapacidad:</b> {{ rivalLuchador.discapacidad }}</li>
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
    <div v-if="esCampeon && mostrarModalCampeon" class="campeon-modal" @mounted="createConfetti">
      <div class="campeon-content">
        <span class="campeon-copa">🏆</span>
        <h2 class="campeon-title">¡{{ personaje.nombre }} es el CAMPEÓN!</h2>
        <p class="campeon-subtitle">¡Felicidades, has ganado el torneo mundial!</p>
      </div>
      <button class="close-campeon-btn" @click="mostrarModalCampeon = false" title="Cerrar">✖</button>
    </div>

    <!-- Modal de ganador cuando pierde el usuario -->
    <div v-if="ganadorTorneo && usuarioEliminado && mostrarModalGanador" class="ganador-modal">
      <div class="ganador-content">
        <button 
          class="close-ganador-btn" 
          @click="mostrarModalGanador = false"
          title="Ver bracket final"
        >✖</button>
        <div class="ganador-header">
          <span class="ganador-copa">🏆</span>
          <h2 class="ganador-title">¡{{ ganadorTorneo.nombre }} es el CAMPEÓN!</h2>
        </div>
        <div class="ganador-info">
          <span class="ganador-flag">{{ ganadorTorneo.bandera }}</span>
          <ul class="ganador-stats-list">
            <li><b>País:</b> {{ ganadorTorneo.pais }}</li>
            <li><b>Altura:</b> {{ ganadorTorneo.altura }} cm</li>
            <li><b>Peso:</b> {{ ganadorTorneo.peso }} kg</li>
            <li><b>Press banca:</b> {{ ganadorTorneo.pressBanca }} kg</li>
            <li><b>Agilidad:</b> {{ ganadorTorneo.agilidad }}</li>
            <li><b>Objeto:</b> {{ ganadorTorneo.objeto }}</li>
            <li><b>Habilidad con el objeto:</b> {{ ganadorTorneo.habilidad }}</li>
            <li><b>Profesión:</b> {{ ganadorTorneo.profesion }}</li>
            <li><b>Discapacidad:</b> {{ ganadorTorneo.discapacidad }}</li>
          </ul>
        </div>
        <p class="ganador-subtitle">¡Ha conquistado el torneo mundial!</p>
      </div>
    </div>

    <!-- Bracket final y botón de reinicio tras ganar o perder -->
    <div v-if="(esCampeon && !mostrarModalCampeon) || (usuarioEliminado && !mostrarModalGanador)">
      <button class="reiniciar-bracket-btn reiniciar-bracket-btn-fixed" @click="reiniciar">
        🔄 Reiniciar Bracket
      </button>
      <div class="bracket-visual-vertical-container">
        <div class="bracket-vertical">
          <div
            v-for="(ronda, rondaIdx) in [...bracket].reverse()"
            :key="rondaIdx"
            class="bracket-vertical-row"
          >
            <div class="round-label">
              {{ getRoundName(ronda.length) }}
            </div>
            <div v-for="(par, parIdx) in getPares(ronda)" :key="parIdx" class="bracket-match">
              <div class="bracket-pair">
                <div 
                  v-for="luchador in par" 
                  :key="luchador?.nombre"
                  class="bracket-vertical-cell"
                  :class="{
                    'bracket-user': luchador?.esUsuario,
                    'winner': isWinner(luchador, rondaIdx),
                    'eliminated': isEliminated(luchador, rondaIdx)
                  }"
                  @click="luchador && verStatsLuchador(luchador)"
                >
                  <span class="bracket-flag">
                    <span v-if="ganadorTorneo && luchador?.nombre === ganadorTorneo.nombre" class="bracket-copa">🏆</span>
                    {{ luchador?.bandera || '🏳️' }}
                  </span>
                  <span class="bracket-nombre">{{ luchador?.nombre || 'TBD' }}</span>
                  <span v-if="ganadorTorneo && luchador?.nombre === ganadorTorneo.nombre" class="bracket-winner-label">
                    CAMPEÓN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="usuarioEliminado" class="usuario-eliminado-simple-msg">
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
const porcentajeLuchadores = 0.32 // Modificado para tener 32 luchadores
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
  'Electricista', 'Jardinero', 'Veterinario', 'Periodista', 'Informático', 'Arquitecto', 'Estilista',
  'Psicólogo', 'Contador', 'Farmacéutico', 'Dentista', 'Soldado', 'Astrónomo', 'Biólogo', 'Geólogo', 'Historiador',
  'Librero', 'Recepcionista', 'Actor', 'Cantante', 'Locutor', 'Programador', 'Diseñador gráfico', 'Diseñador de moda',
  'Tatuador', 'Barbero', 'Esteticista', 'Conductor de autobús', 'Conductor de tren', 'Taxista', 'Marinero',
  'Pescador', 'Minero', 'Obrero', 'Albañil', 'Guardabosques', 'Agente inmobiliario', 'Chef', 'Sommelier',
  'Mesero', 'Barman', 'Guía turístico', 'Traductor', 'Intérprete', 'Notario', 'Juez', 'Fiscal', 'Secretario',
  'Asistente virtual', 'Técnico de laboratorio', 'Radiólogo', 'Paramédico', 'Físico', 'Químico', 'Matemático',
  'Economista', 'Politólogo', 'Sociólogo', 'Antropólogo', 'Filósofo', 'Teólogo', 'Pastor', 'Sacerdote',
  'Monja', 'Monje', 'Astronauta', 'Controlador aéreo', 'Ingeniero aeroespacial', 'Ingeniero civil', 
  'Ingeniero eléctrico', 'Ingeniero mecánico', 'Ingeniero químico', 'Bioingeniero', 'Zoologo', 'Botánico',
  'Ecólogo', 'Meteorólogo', 'Oceanógrafo', 'Ingeniero ambiental', 'Diseñador de videojuegos', 
  'Desarrollador web', 'Ciberseguridad', 'Analista de datos', 'Consultor', 'Coach', 'Entrenador personal',
  'Nutricionista', 'Chef vegano', 'Panadero artesanal', 'Cerrajero', 'Tapicero', 'Decorador de interiores',
  'Agente de seguros', 'Corredor de bolsa', 'Banquero', 'Cajero', 'Logopeda', 'Terapeuta ocupacional',
  'Fisioterapeuta', 'Kinesiólogo', 'Dietista', 'Optometrista', 'Podólogo', 'Ortopedista', 'Geriatra',
  'Pediatra', 'Neurólogo', 'Cardiólogo', 'Urólogo', 'Dermatólogo', 'Oncólogo', 'Cirujano', 'Anestesista',
  'Endocrinólogo', 'Reumatólogo','Actor/Actriz porno', 'Probador de colchones', 'Catador de helados', 'Espantapájaros humano', 'Tirador de confeti profesional',
  'Catador de agua de grifo', 'Organizador de peleas de almohadas', 'Domador de caracoles', 'Influencer de cementerio',
  'Probador de videojuegos de granjas', 'Acariciador de gatos profesional', 'Modelador de cera para velas aromáticas',
  'Detective de olores raros', 'Técnico de aplausos en vivo', 'Psicólogo de plantas', 'Cazador de fantasmas freelance',
  'Contador de ovejas nocturno', 'Repartidor de abrazos', 'Asistente de mago mediocre', 'Editor de memes vintage',
  'Diseñador de croquetas gourmet', 'Asistente de payaso triste', 'Fotógrafo de pies', 'Recreador de escenas históricas con títeres',
  'Animador de ascensores', 'Escribidor de mensajes en galletas de la fortuna', 'Comediante de funerales', 'Reparador de pelucas',
  'Pastor de llamas zen', 'Crítico de películas que no ha visto'
];

const generarProfesion = () => profesiones[Math.floor(Math.random() * profesiones.length)]

const objetos = [ 
  'Sin objetos', 'Desatascador', 'Cepillo de dientes', 'Cuchillo', 'Bate', 'Sartén', 'Pala', 'Peluche', 'Libro', 'Ladrillo',
  'Cuerda', 'Taza', 'Regla', 'Martillo', 'Destornillador', 'Bolso', 'Sombrero', 'Piedra', 'Cuchara', 'Escoba', 'Calcetín', 'Palo selfie',
  'Almohada', 'Linterna', 'Pelota', 'Botella', 'Paraguas', 'Cascabel', 'Cinta adhesiva', 'Cubo', 'Espejo', 'Zapatilla',
  'Candelabro', 'Teléfono viejo', 'Llave inglesa', 'Cuaderno', 'Cacerola', 'Estuche', 'Cinta métrica', 'Gafas de sol', 'Juguete', 'Percha',
  'Mochila', 'Colador', 'Bote de pintura', 'Tijeras', 'Radiocasete', 'Muñeca', 'Cepillo para el pelo', 'Toalla', 'Globo', 'Alambre',
  'Dildo de Goma Rosa de 30 cm' ,'Muñeca inchable','Porro', 'Bastón de madera', 'Cinturón de castidad', 'Pipa de agua', 'Bola de bolos', 'Cuchara de palo', 'Escudo medieval',  'Consolador con forma de dragón', 'Tostadora poseída', 'Tanga de leopardo XXL', 'Mano de maniquí', 'Pato de goma ninja',
  'Cabeza de muñeca rota', 'Calcetín sudado de un vikingo', 'Taza que grita al llenarse', 'Cucharón sagrado de la abuela', 'Tubo de ensayo con esperma de unicornio',
  'Cráneo de plástico con luces LED', 'Cenicero con forma de pie', 'Espátula bendecida por un monje budista', 'Brazalete de castidad mental', 'Plátano de peluche usado',
  'Braga con WiFi', 'Reloj de muñeca que da shocks eléctricos', 'Nariz falsa con bigote', 'Kit de iniciación para invocar demonios', 'Tenedor con GPS',
  'Zanahoria fosforescente', 'Rana disecada con capa', 'Camiseta que dice “No soy tu padre”', 'Pastilla de jabón en forma de pene', 'Spray anti fantasmas',
  'Oreja de goma tamaño real', 'Disfraz de hot dog usado', 'Esqueleto de pez prehistórico de juguete', 'Cojín que se ríe solo', 'Biberón para adultos'
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
  'China': ['Wei', 'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Xu', 'Sun', 'Ma', 'Zhou', 'Gao', 'Fang', 'Jie', 'Ming', 'Tian', 'Xiao', 'Qian', 'Mei', 'Lina', 'Cheng'],
  'India': ['Amit', 'Priya', 'Rahul', 'Anjali', 'Vijay', 'Sunita', 'Raj', 'Pooja', 'Sanjay', 'Neha', 'Arjun', 'Rani', 'Deepak', 'Kiran', 'Manoj', 'Suresh', 'Meena', 'Ravi', 'Lakshmi', 'Kavita'],
  'EE. UU.': ['John', 'Emily', 'Michael', 'Jessica', 'David', 'Ashley', 'James', 'Sarah', 'Robert', 'Amanda', 'William', 'Jennifer', 'Matthew', 'Elizabeth', 'Joshua', 'Andrew', 'Lauren', 'Christopher', 'Brittany', 'Daniel'],
  'Indonesia': ['Agus', 'Siti', 'Budi', 'Dewi', 'Joko', 'Putri', 'Rizki', 'Fitri', 'Andi', 'Nur', 'Yusuf', 'Sri', 'Hendra', 'Rina', 'Dian', 'Adi', 'Ratna', 'Bayu', 'Wulan', 'Eka'],
  'Pakistán': ['Ali', 'Fatima', 'Ahmed', 'Ayesha', 'Hassan', 'Sana', 'Imran', 'Zainab', 'Bilal', 'Maryam', 'Usman', 'Sara', 'Hamza', 'Rabia', 'Kashif', 'Nadia', 'Fahad', 'Zeeshan', 'Hina', 'Shahid'],
  'Nigeria': ['Emeka', 'Ngozi', 'Chinedu', 'Amina', 'Ifeanyi', 'Bola', 'Uche', 'Chika', 'Tunde', 'Ada', 'Segun', 'Kemi', 'Yemi', 'Amaka', 'Sola', 'Nkechi', 'Tope', 'Obinna', 'Funke', 'Kunle'],
  'Brasil': ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Gabriel', 'Camila', 'Mateus', 'Larissa', 'Felipe', 'Beatriz', 'Rafael', 'Fernanda', 'Bruno', 'Gustavo', 'Patrícia', 'Tiago', 'Cláudia', 'Rodrigo'],
  'Bangladés': ['Abir', 'Sumaiya', 'Hasan', 'Nusrat', 'Sabbir', 'Mitu', 'Rafi', 'Tania', 'Shuvo', 'Rima', 'Sakib', 'Mou', 'Tanvir', 'Jannat', 'Rasel', 'Nayeem', 'Farzana', 'Riad', 'Shanta', 'Rakib'],
  'Rusia': ['Ivan', 'Anna', 'Dmitry', 'Olga', 'Sergey', 'Elena', 'Alexey', 'Natalia', 'Vladimir', 'Tatiana', 'Andrey', 'Ekaterina', 'Mikhail', 'Irina', 'Nikita', 'Yulia', 'Kirill', 'Svetlana', 'Oleg', 'Alina'],
  'México': ['Juan', 'María', 'José', 'Guadalupe', 'Luis', 'Ana', 'Carlos', 'Carmen', 'Jorge', 'Patricia', 'Miguel', 'Verónica', 'Francisco', 'Leticia', 'Ricardo', 'Sandra', 'Alejandro', 'Claudia', 'Eduardo', 'Rosa'],
  'Japón': ['Haruto', 'Yui', 'Sota', 'Rin', 'Yuto', 'Sakura', 'Yuki', 'Hina', 'Kaito', 'Mio', 'Ren', 'Yuna', 'Daiki', 'Aoi', 'Takumi', 'Hinata', 'Rei', 'Shota', 'Mei', 'Nao'],
  'Filipinas': ['Jose', 'Maria', 'Juan', 'Angel', 'Mark', 'Grace', 'Paul', 'Joy', 'James', 'Rose', 'Michael', 'Ann', 'John', 'May', 'Anthony', 'Jessa', 'Liza', 'Carlo', 'Karen', 'Daniel'],
  'Egipto': ['Mohamed', 'Fatma', 'Ahmed', 'Sara', 'Omar', 'Mona', 'Youssef', 'Aya', 'Mahmoud', 'Nour', 'Mostafa', 'Salma', 'Khaled', 'Heba', 'Tamer', 'Sherif', 'Yasmin', 'Walid', 'Layla', 'Amr'],
  'Etiopía': ['Abebe', 'Alem', 'Kebede', 'Mulu', 'Tsegaye', 'Hana', 'Bekele', 'Selam', 'Getachew', 'Almaz', 'Tesfaye', 'Mekdes', 'Haile', 'Tigist', 'Solomon', 'Fikirte', 'Biruk', 'Yeshi', 'Daniel', 'Abel'],
  'Vietnam': ['Nguyen', 'Anh', 'Tran', 'Hoa', 'Le', 'Huong', 'Phuong', 'Minh', 'Thu', 'Quang', 'Tuan', 'Hang', 'Duc', 'Linh', 'Son', 'Trang', 'Hien', 'Van', 'Nhan', 'Binh'],
  'Alemania': ['Lukas', 'Sophie', 'Leon', 'Marie', 'Finn', 'Anna', 'Paul', 'Laura', 'Jonas', 'Lea', 'Ben', 'Lena', 'Elias', 'Mia', 'Maximilian', 'Julian', 'Nina', 'Tobias', 'Katharina', 'Jan'],
  'Irán': ['Mohammad', 'Fatemeh', 'Ali', 'Zahra', 'Reza', 'Maryam', 'Hossein', 'Sara', 'Mehdi', 'Narges', 'Amir', 'Arezoo', 'Saeed', 'Shirin', 'Hassan', 'Leila', 'Ehsan', 'Parisa', 'Navid', 'Sanaz'],
  'Turquía': ['Mehmet', 'Fatma', 'Mustafa', 'Ayşe', 'Ahmet', 'Emine', 'Ali', 'Hatice', 'Hüseyin', 'Zeynep', 'Hasan', 'Elif', 'İbrahim', 'Merve', 'Osman', 'Yusuf', 'Büşra', 'Kemal', 'Aylin', 'Can'],
  'Francia': ['Lucas', 'Emma', 'Nathan', 'Chloé', 'Enzo', 'Manon', 'Louis', 'Léa', 'Hugo', 'Camille', 'Gabriel', 'Sarah', 'Arthur', 'Inès', 'Jules', 'Théo', 'Clara', 'Maxime', 'Zoé', 'Mathis'],
  'Reino Unido': ['Oliver', 'Olivia', 'George', 'Emily', 'Harry', 'Jessica', 'Jack', 'Sophie', 'Jacob', 'Lily', 'Charlie', 'Amelia', 'Thomas', 'Isabella', 'William', 'Freddie', 'Grace', 'Alfie', 'Ruby', 'Oscar'],
  'Italia': ['Francesco', 'Sofia', 'Alessandro', 'Giulia', 'Lorenzo', 'Aurora', 'Andrea', 'Alice', 'Matteo', 'Ginevra', 'Gabriele', 'Emma', 'Leonardo', 'Martina', 'Riccardo', 'Chiara', 'Tommaso', 'Elena', 'Nicola', 'Francesca'],
  'España': ['Antonio', 'María', 'Manuel', 'Carmen', 'José', 'Ana', 'Francisco', 'Isabel', 'David', 'Laura', 'Juan', 'Cristina', 'Javier', 'Marta', 'Daniel', 'Lucía', 'Raúl', 'Sara', 'Álvaro', 'Elena'],
  'Argentina': ['Santiago', 'Sofía', 'Mateo', 'Valentina', 'Martín', 'Martina', 'Lucas', 'Lucía', 'Benjamín', 'Camila', 'Juan', 'Julieta', 'Pedro', 'Agustina', 'Tomás', 'Facundo', 'Milagros', 'Nicolás', 'Josefina', 'Gonzalo']
};

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
const mostrarModalGanador = ref(true)
const mostrarModalCampeon = ref(true)

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
      // Solo para simulados: aplica la fórmula y la discapacidad
      const fuerzaA = fuerzaLuchador(a)
      const fuerzaB = fuerzaLuchador(b)
      siguiente.push(fuerzaA >= fuerzaB ? a : b)
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
  const nuevaRonda = bracket.value[rondaActual.value]
  luchadores.value.splice(0, luchadores.value.length, ...nuevaRonda)
  avanzarHastaElFinal()
  setTimeout(() => {
    const container = document.querySelector('.bracket-visual-vertical-container');
    if (container) {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, 100);
}

function avanzarHastaElFinal() {
  // Mientras no haya ganador, sigue avanzando el bracket
  while (bracket.value[bracket.value.length - 1].length > 1) {
    avanzarBracket(false)
  }
}

const personaje = computed(() => luchadores.value[0])
const usuarioLuchador = computed(() => luchadores.value.find(l => l.esUsuario) || luchadores.value[0])
const rivalLuchador = computed(() => luchadores.value.find(l => !l.esUsuario) || luchadores.value[1])

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

// Funciones helper para el bracket
function getRoundName(numLuchadores) {
  switch(numLuchadores) {
    case 1: return 'Campeón';
    case 2: return 'Final';
    case 4: return 'Semifinales';
    case 8: return 'Cuartos';
    default: return `Ronda de ${numLuchadores}`;
  }
}

function getPares(ronda) {
  const pares = [];
  for (let i = 0; i < ronda.length; i += 2) {
    pares.push([ronda[i], ronda[i + 1]]);
  }
  return pares;
}

function isWinner(luchador, rondaIdx) {
  if (!luchador) return false;
  const siguienteRonda = bracket.value[rondaIdx - 1];
  return siguienteRonda?.some(l => l.nombre === luchador.nombre);
}

function isEliminated(luchador, rondaIdx) {
  if (!luchador) return false;
  const siguienteRonda = bracket.value[rondaIdx - 1];
  return !siguienteRonda?.some(l => l.nombre === luchador.nombre);
}

// Añade esta función en el script
function createConfetti() {
  const colors = [
    '#6366f1', '#ec4899', '#fbbf24', '#34d399', '#60a5fa',
    '#f43f5e', '#8b5cf6', '#10b981', '#f59e0b'
  ];
  
  const container = document.querySelector('.campeon-modal');
  
  // Crear 150 piezas de confetti
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Propiedades aleatorias para cada pieza
    const randomRotation = Math.random() * 360;
    const randomScale = Math.random() * 0.7 + 0.3;
    const randomWidth = Math.random() * 10 + 5;
    const randomHeight = Math.random() * 10 + 5;
    const randomAnimationDelay = Math.random() * 3;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Aplicar estilos inline
    confetti.style.cssText = `
      background-color: ${randomColor};
      width: ${randomWidth}px;
      height: ${randomHeight}px;
      top: -${randomHeight}px;
      left: ${Math.random() * 100}vw;
      opacity: ${Math.random()};
      transform: rotate(${randomRotation}deg) scale(${randomScale});
      animation: confettiRain 3s ease-out infinite;
      animation-delay: ${randomAnimationDelay}s;
    `;
    
    container.appendChild(confetti);
    
    // Eliminar después de la animación
    setTimeout(() => {
      confetti.remove();
    }, 3000 + (randomAnimationDelay * 1000));
  }
}

// Nueva función para calcular la fuerza del luchador
function fuerzaLuchador(l) {
  let fuerza = (l.pressBanca * 1.5) + (l.altura * 2) + (l.peso * 1.75);
  if (l.discapacidad && l.discapacidad !== 'Ninguna') {
    fuerza *= 0.5;
  }
  return fuerza;
}
</script>

<style scoped>
/* Variables globales */
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --bg-white: #ffffff;
  --text-dark: #1e293b;
}

/* Fondo y contenedor principal */
.bracket-bg {
  background: var(--bg-white);
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Header y contenido inicial mejorado */
.header-bar {
  background: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 4rem 3rem;
  width: 90%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 0 100px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  position: relative;
  overflow: hidden;
  animation: headerAppear 0.8s ease-out;
}

.header-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent,
    rgba(99, 102, 241, 0.5),
    rgba(236, 72, 153, 0.5),
    transparent
  );
  animation: shimmer 2s linear infinite;
}

.main-title {
  font-size: 4.5rem;
  font-weight: 800;
  text-align: center;
  margin: 0;
  background: linear-gradient(135deg, 
    #6366f1 0%, 
    #ec4899 50%, 
    #6366f1 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 3s ease infinite;
  text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.fight-btn {
  background: linear-gradient(45deg, #6366f1, #ec4899);
  color: white;
  border: none;
  padding: 1.5rem 4rem;
  font-size: 1.4rem;
  font-weight: 700;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.3),
    0 0 0 2px rgba(99, 102, 241, 0.2);
}

.fight-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: 0.6s;
}

.fight-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 
    0 20px 40px rgba(99, 102, 241, 0.4),
    0 0 0 4px rgba(99, 102, 241, 0.3);
  letter-spacing: 3px;
}

.fight-btn:hover::before {
  left: 100%;
}

/* Estilos para la sección de lucha 1vs1 */
.fighters-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  width: 85%;
  max-width: 1200px;
  padding: 2rem;
  background: rgba(10, 10, 18, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 0 60px rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1rem auto;
}

.fighter-card {
  background: rgba(17, 24, 39, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
  max-width: 400px;
  margin: 0 auto;
}

.fighter-header-row {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-mini,
.avatar-mini-rival {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #6366f1;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.avatar-mini-rival {
  border-color: #ec4899;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
}

.vs-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.vs-text {
  font-size: 4rem;
  margin: 0 1rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
  animation: vsGlow 2s ease-in-out infinite alternate;
}

.fighter-list {
  font-size: 0.9rem;
  gap: 0.5rem;
}

.fighter-list li {
  padding: 0.7rem 1rem;
}

.fighter-list li b {
  min-width: 120px;
  font-size: 0.8rem;
}

/* Botones de control y navegación */
.close-combate-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 0.8rem 1.5rem;
  border-radius: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-combate-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}
/* Botones de control y navegación */
.volver-combate-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 0.8rem 1.5rem;
  border-radius: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 9999;
}

.volver-combate-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}

/* Contenedor de acciones centralizado */
.combate-actions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  position: relative;
}

.combate-bajas-msg {
  font-size: 1.5rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 0.5rem;
}

.combate-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.combate-btn-tick,
.combate-btn-cross {
  width: 50px;
  height: 50px;
  font-size: 1.8rem;
}

/* Estilos del bracket mejorado */
.bracket-visual-vertical-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  padding: 0;
  margin: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 0;
  box-shadow: none;
  overflow-x: auto;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bracket-vertical {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; /* Cambia flex-end por center */
  gap: 4rem;
  min-width: max-content;
  width: fit-content;
  margin: 0 auto;
  height: 100%;
}

.bracket-vertical-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center; /* Centra las celdas verticalmente */
  justify-content: center; /* Añade esto para centrar verticalmente cada columna */
  min-height: 100%;
  height: 100%;
}

.round-label {
  text-align: center;
  color: #e2e8f0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.bracket-match {
  position: relative;
}

.bracket-pair {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

.bracket-vertical-cell {
  background: rgba(30, 41, 59, 0.8);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.bracket-vertical-cell.winner {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.2) 0%,
    rgba(236, 72, 153, 0.2) 100%
  );
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

.bracket-vertical-cell.eliminated {
  opacity: 0.5;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Líneas de conexión mejoradas */
.bracket-pair::after {
  content: '';
  position: absolute;
  right: -2rem;
  top: 50%;
  width: 2rem;
  height: 2px;
  background: rgba(99, 102, 241, 0.5);
}

.bracket-pair::before {
  content: '';
  position: absolute;
  right: -2rem;
  top: 25%;
  height: 50%;
  width: 2px;
  background: rgba(99, 102, 241, 0.5);
}

@media (max-width: 1200px) {
  .bracket-visual-vertical-container {
    width: 100%;
    padding: 1rem;
  }

  .bracket-vertical {
    gap: 2rem;
  }

  .bracket-vertical-cell {
    min-width: 160px;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 768px) {
  .bracket-vertical {
    padding: 1rem;
    gap: 1rem;
  }

  .bracket-vertical-cell {
    min-width: 140px;
    font-size: 0.8rem;
    padding: 0.7rem 1rem;
  }
}

/* Modal de stats del luchador */
.stats-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: modalFadeIn 0.3s ease;
}

.close-stats-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
}

.close-stats-btn:hover {
  transform: rotate(90deg);
  background: rgba(239, 68, 68, 0.3);
  color: #fff;
}

/* Ajusta el padding del contenido para dar espacio al botón */
.stats-content {
  padding-top: 3rem;
}

.stats-content {
  background: rgba(30, 41, 59, 0.95);
  border-radius: 24px;
  padding: 2.5rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 100px rgba(99, 102, 241, 0.15);
  animation: modalSlideIn 0.3s ease;
}

.stats-flag {
  font-size: 3rem;
  display: block;
  text-align: center;
  margin-bottom: 1rem;
  animation: flagBounce 0.5s ease;
}

.stats-title {
  color: #e2e8f0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.stats-list li {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.stats-list li:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.stats-list li b {
  color: #818cf8;
  min-width: 140px;
  margin-right: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos para la celebración del campeón */
.campeon-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: celebrationBg 4s ease-in-out infinite;
}

.campeon-content {
  background: rgba(30, 41, 59, 0.95);
  border-radius: 30px;
  padding: 3rem;
  width: 90%;
  max-width: 600px;
  text-align: center;
  position: relative;
  border: 2px solid rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(99, 102, 241, 0.2);
  animation: celebrationPop 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.campeon-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, 
    rgba(99, 102, 241, 0.1),
    rgba(236, 72, 153, 0.1),
    transparent 70%);
  animation: shimmerEffect 2s ease-in-out infinite;
}

.campeon-copa {
  font-size: 8rem;
  display: block;
  margin-bottom: 1rem;
  animation: trophyDance 2s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
}

.campeon-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #6366f1, #ec4899, #6366f1);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 3s linear infinite;
}

.campeon-subtitle {
  font-size: 1.5rem;
  color: #e2e8f0;
  margin: 0;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards 0.3s;
}

/* Estilo para el modal del ganador */
.ganador-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: modalFadeIn 0.3s ease;
}

.ganador-content {
  background: rgba(30, 41, 59, 0.95);
  border-radius: 24px;
  padding: 2.5rem;
  width: 90%;
  max-width: 500px; /* Mantenemos el mismo max-width que stats-content */
  position: relative;
  border: 2px solid rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(99, 102, 241, 0.2);
  animation: celebrationPop 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.close-ganador-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
}

.close-ganador-btn:hover {
  transform: rotate(90deg);
  background: rgba(239, 68, 68, 0.3);
  color: #fff;
}

.ganador-header {
  text-align: center;
  margin-bottom: 2rem;
}

.ganador-copa {
  font-size: 4rem; /* Reducido de 5rem */
  display: block;
  margin-bottom: 0.5rem; /* Reducido de 1rem */
}

.ganador-title {
  font-size: 2rem; /* Reducido de 2.5rem */
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 3s linear infinite;
}

.ganador-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem; /* Reducido de 2rem */
  margin: 1.5rem 0; /* Reducido de 2rem */
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.ganador-flag {
  font-size: 2.5rem; /* Reducido de 3rem */
  margin-bottom: 1rem; /* Reducido de 1.5rem */
}

.ganador-stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.ganador-stats-list li {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.7rem 1rem; /* Reducido de 0.8rem 1.2rem */
  border-radius: 12px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.ganador-stats-list li:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.ganador-stats-list li b {
  color: #818cf8;
  min-width: 140px;
  margin-right: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ganador-subtitle {
  font-size: 1rem;
  color: #94a3b8;
  text-align: center;
  margin: 1.5rem 0 0 0;
  padding: 0.8rem 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 100px;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  animation: fadeInUp 0.6s ease forwards 0.3s;
}

.ganador-subtitle::before {
  content: '👑';
  margin-right: 0.5rem;
  animation: crownBounce 1s ease infinite;
}

@keyframes crownBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@media (max-width: 768px) {
  .ganador-content {
    padding: 2rem;
  }
  
  .ganador-title {
    font-size: 2rem;
  }
  
  .ganador-copa {
    font-size: 4rem;
  }
  
  .ganador-stats-list li {
    padding: 0.6rem 1rem;
  }
}

.reiniciar-bracket-btn {
  display: block;
  margin: 2rem auto 0 auto;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  color: #fff;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  box-shadow: 0 4px 16px #6366f155;
  transition: background 0.2s, transform 0.2s;
}
.reiniciar-bracket-btn:hover {
  background: linear-gradient(90deg, #ec4899, #6366f1);
  transform: scale(1.05);
}

/* Clase para el botón de reinicio fijo en el bracket final */
.reiniciar-bracket-btn-fixed {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  animation: fadeInUp 0.6s ease forwards;
}
</style>