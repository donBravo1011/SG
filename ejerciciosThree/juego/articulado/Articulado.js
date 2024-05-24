import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js'

class Articulado extends THREE.Object3D {
  constructor() {
    super();
    
    // El material se usa desde varios métodos. Por eso se almacena en un atributo
    this.material = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
    this.material2 = new THREE.MeshStandardMaterial({ color: 0x9b9b9b, side: THREE.DoubleSide });

    // Inicializar ángulos de rotación
    this.shoulderAngle = 0;
    this.elbowAngle = 0;

    // Crear la base del brazo y agregarla al nodo this
    var base = this.createBase();
    this.animateObject();
    this.add(base);

    // Manejar el input del teclado
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }

  createBase() {
    // Crear la esfera del hombro
    var hombro = this.createSphere();

    // Crear el cilindro del bíceps (brazo superior)
    var biceps = this.createBiceps();

    // Crear la esfera del codo
    var codo = this.createSphere();

    // Crear el cilindro del antebrazo (brazo inferior)
    var antebrazo = this.createBiceps();

    // Crear la esfera de la mano
    var mano = this.createSphere();

    // Crear los dedos de la mano
    var dedo1 = this.createDedo();
    var dedo2 = this.createDedo();
    var dedo3 = this.createDedo();
    var dedo4 = this.createDedo();
    var dedo5 = this.createDedo();

    // Posicionar y rotar los elementos del brazo
    biceps.position.y = -0.7; // Ajusta esta posición según el tamaño del hombro y del bíceps
    codo.position.y = -1.5;
    antebrazo.position.y = -1.5;
    antebrazo.rotation.z = Math.PI / 2;
    antebrazo.position.x = -0.9;
    mano.position.y = -1.5;
    mano.position.x = -1.7;
    dedo1.position.y = -1;
    dedo1.position.x = -1.7;
    dedo2.position.y = -1.1;
    dedo2.position.x = -2.1;
    dedo2.rotation.z = Math.PI / 2.5;
    dedo3.position.y = -1.4;
    dedo3.position.x = -2.3;
    dedo3.rotation.z = Math.PI / 2;
    dedo4.position.y = -1.7;
    dedo4.position.x = -2.3;
    dedo4.rotation.z = Math.PI / 1.7;
    dedo5.position.y = -1.9;
    dedo5.position.x = -2.1;
    dedo5.rotation.z = Math.PI / 1.5;

    // Crear un objeto que contenga los elementos del brazo
    var base = new THREE.Object3D();
    base.add(hombro);
    base.add(biceps);
    base.add(codo);
    base.add(antebrazo);
    base.add(mano);
    base.add(dedo1);
    base.add(dedo2);
    base.add(dedo3);
    base.add(dedo4);
    base.add(dedo5);

    return base;
  }

  createSphere() {
    // Crear la geometría y la malla de la esfera
    var esferaGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    var esfera = new THREE.Mesh(esferaGeometry, this.material);
    return esfera;
  }

  createBiceps() {
    // Crear la geometría y la malla del cilindro (bíceps)
    var bicepsGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
    var biceps = new THREE.Mesh(bicepsGeometry, this.material2);
    return biceps;
  }

  createDedo() {
    // Crear la geometría y la malla del cilindro (bíceps)
    var bicepsGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    var biceps = new THREE.Mesh(bicepsGeometry, this.material2);
    return biceps;
  }

  rotateShoulder(angle) {
    this.shoulderAngle = angle;
  }

  rotateElbow(angle) {
    this.elbowAngle = angle;
  }

  onKeyDown(event) {
    switch (event.key) {
      case 'w':
        this.rotateShoulder(Math.min(this.shoulderAngle + 0.1, Math.PI / 2));
        break;
      case 's':
        this.rotateShoulder(Math.max(this.shoulderAngle - 0.1, -Math.PI / 2));
        break;
      case 'a':
        this.rotateElbow(Math.max(this.elbowAngle - 0.1, -Math.PI / 2));
        break;
      case 'd':
        this.rotateElbow(Math.min(this.elbowAngle + 0.1, Math.PI / 2));
        break;
      default:
        break;
    }
  }

  animateObject() {
    var origen = { y: -(Math.PI / 2), z: 0 }; // Inicia desde -pi/2 grados en Y y 0 grados en Z
    var destino = { y: Math.PI / 2, z: Math.PI / 2 }; // Gira hasta pi/2 (90 grados) en Y y Z
    
    var movimiento = new TWEEN.Tween(origen)
        .to(destino, 5000) // Duración de 5000 ms (5 segundos)
        .easing(TWEEN.Easing.Quadratic.InOut) // Utiliza una función de interpolación suave
        .onUpdate(() => {
            // Actualiza la rotación del objeto en los ejes Y y Z
            this.rotation.y = origen.y;
            this.rotation.z = origen.z;
        })
        .repeat(Infinity) // Repite infinitamente
        .yoyo(true); // Hace que la animación vuelva en la dirección opuesta

    // Iniciar la animación
    movimiento.start();
}






  update() {
    // Actualizar las rotaciones del brazo según los ángulos almacenados
    this.children[0].rotation.z = this.shoulderAngle;
    this.children[0].rotation.y = this.elbowAngle;
    TWEEN.update();
  }


  
}

export { Articulado };
