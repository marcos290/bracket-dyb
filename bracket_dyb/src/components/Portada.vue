<template>
  <div class="portada-container">
    <div class="imagen-container">
      <img src="../assets/Portada-bracket.png" alt="Portada Bracket" class="portada-imagen" />
    </div>
    <button @click="$emit('iniciar')" class="portada-btn">
      INICIAR TORNEO
    </button>
  </div>
</template>

<script setup>
defineEmits(['iniciar'])
</script>

<style scoped>
.portada-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.imagen-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portada-imagen {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.portada-btn {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #facc15, #fde047);
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 1rem 3rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.5);
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
  z-index: 10;
}

.portada-btn:hover {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 0 30px rgba(250, 204, 21, 0.7);
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}
</style>