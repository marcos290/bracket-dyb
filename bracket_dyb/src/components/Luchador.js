// Luchador.js
export default class Luchador {
  constructor(nombre) {
    this.nombre = nombre;
    this.fuerza = this.getRandomStat();
    this.velocidad = this.getRandomStat();
    this.resistencia = this.getRandomStat();
    this.vida = 100;
  }

  getRandomStat() {
    return Math.floor(Math.random() * 10) + 1; // 1 a 10
  }

  atacar(objetivo) {
    const golpe = this.fuerza + Math.floor(Math.random() * this.velocidad);
    objetivo.vida -= golpe;
    return golpe;
  }

  estaVivo() {
    return this.vida > 0;
  }
}
