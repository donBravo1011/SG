import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';
import { Circuito } from '../circuito/Circuito.js';

class Coche extends THREE.Object3D {
  constructor(circuitoGeo) {
    super();
    
    // Crea una instancia de Circuito y obtén la geometría del tubo
    
     this.geomTubo = circuitoGeo;

    // Crea los nodos Object3D
    this.posicionSuperficie = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    // Agrega los nodos al árbol de escena
    this.movimientoLateral.add(this.posicionSuperficie);
    this.nodoPosOrientTubo.add(this.movimientoLateral);
    
    
    // Carga el modelo del coche
    const materialLoader = new MTLLoader();
    const objectLoader = new OBJLoader();
    materialLoader.load('../modelo_cargado/model.mtl', (materials) => {
      objectLoader.setMaterials(materials);
      objectLoader.load('../modelo_cargado/model.obj', (object) => {
        object.scale.set(0.1, 0.1, 0.1);
        //object.position.set(-3, 0, 0);
        this.posicionSuperficie.add(object);
        this.add(this.posicionSuperficie);

      });
    });
    
    // Asigna las propiedades del tubo
    this.tubo = this.geomTubo;
    this.path = this.geomTubo.parameters.path;
    this.radio = this.geomTubo.parameters.radius;
    this.segmentos = this.geomTubo.parameters.tubularSegments;

    this.reloj = new THREE.Clock();

    this.velocidad = 10;
    
    
  
    
  }

  createGUI(gui, titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      rotacion: 0
    };

    // Se crea una sección para los controles de la caja
    const folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'rotacion', -0.125, 0.2, 0.001)
      .name('Apertura : ')
      .onChange((value) => this.setAngulo(-value));
  }

  setAngulo(valor) {
    // Suponiendo que 'movil' es el objeto que quieres rotar
    this.movil.rotation.z = valor;
  }

  update() {
    // En el método 'update', actualizas la posición y orientación del tubo
    /*
    var segundosTranscurridos = this.reloj.getDelta(); //segundos desde la última llamada
    this.t += this.velocidad * segundosTranscurridos;

    const posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);
    
    const tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    const segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
    */
}

}

export { Coche };
