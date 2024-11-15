
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { Circuito } from '../circuito/Circuito.js'

class Coche extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    const posicionSuperficie = new THREE.Object3D();
    const movimientoLateral = new THREE.Object3D();
    const orientacionTubo = new THREE.Object3D();

    posicionSuperficie.add(movimientoLateral);
    movimientoLateral.add(orientacionTubo);
    


    
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../modelo_cargado/model.mtl',
    ( materials ) => {
    objectLoader.setMaterials(materials);
    objectLoader.load('../modelo_cargado/model.obj',
    ( object ) => {
      object.scale.set(0.1, 0.1, 0.1);
      orientacionTubo.add(object);
      this.add(posicionSuperficie);
    } , null , null ) ;
    } ) ;



  }
  
  

  
  createGUI (gui,titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      rotacion : 0
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add (this.guiControls, 'rotacion', -0.125, 0.2, 0.001)
      .name ('Apertura : ')
      .onChange ( (value) => this.setAngulo (-value) );
  }
  
  
  
  setAngulo (valor) {
    this.movil.rotation.z = valor;
  }
  
  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Coche }
