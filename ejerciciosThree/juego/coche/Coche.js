import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';
import { Circuito } from '../circuito/Circuito.js';

class Coche extends THREE.Object3D {
  constructor() {
    super();
    
    // Crea una instancia de Circuito y obtén la geometría del tubo
    
    
    
    // Carga el modelo del coche
    const materialLoader = new MTLLoader();
    const objectLoader = new OBJLoader();
    materialLoader.load('../modelo_cargado/model.mtl', (materials) => {
      objectLoader.setMaterials(materials);
      objectLoader.load('../modelo_cargado/model.obj', (object) => {
        object.scale.set(0.25, 0.25, 0.25);
        //object.position.set(-3, 0, 0);
        this.add(object);

      });
    });
  
    
  }

  


  update() {
  
  }

}

export { Coche };
