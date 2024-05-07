
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'


 
class Alas extends THREE.Object3D {
  constructor() {
    super();
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0x0000ff,side: THREE.DoubleSide});
    this.material2 = new THREE.MeshStandardMaterial({color: 0x9b9b9b,side: THREE.DoubleSide});
    this.material3 = new THREE.MeshStandardMaterial({color: 0xff0080,side: THREE.DoubleSide});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    this.animateObject();
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
  }
  
  createBase(tama) {
    //-----------------------------Inicio Perfil----------------------------------------------
    const shape = new THREE.Shape();

    // Definir el perfil del ala
    shape.moveTo(0, 1);
    shape.quadraticCurveTo(1, 1.5, 0.2, 0.8);
    shape.quadraticCurveTo(0.9, 1.2, 0.2, 0.6);
    shape.quadraticCurveTo(0.8, 0.8, 0.2, 0.4);
    shape.quadraticCurveTo(0.6, 0.6, 0, 0.1);
    shape.lineTo(0, 0.1); // Asegúrate de cerrar el perfil

    // Crear geometría de extrusión a partir del perfil
    const extrudeSettings = {
        depth: 0.1, // Profundidad de la extrusión
        bevelEnabled: false // Sin biseles
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.scale(tama, tama, tama); // Escalar la geometría según el parámetro 'tama'

    // Crear material y malla
    
    const ala1 = new THREE.Mesh(geometry, this.material);
    var ala2 = ala1.clone();
    ala1.rotation.y = -(Math.PI / 2);
    ala2.rotation.y = Math.PI  / 2;

    ala1.position.set(0, 0, 0.1);
    ala2.position.set(0, 0, -0.1);
    // Crear un objeto contenedor y agregar la malla
    const base = new THREE.Object3D();
    base.add(ala1);
    base.add(ala2);

    return base;
  }
  
  animateObject() {
    var origen = { x: -1 };
    var destino = { x: 1 }; // Cambia el valor de destino según el desplazamiento deseado
    var movimiento = new TWEEN.Tween(origen)
        .to(destino, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
            // Actualiza la posición del objeto según el valor interpolado
            this.position.x = origen.x;
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();
  }


  
  update () {
    TWEEN.update();
  }
}

export { Alas }
