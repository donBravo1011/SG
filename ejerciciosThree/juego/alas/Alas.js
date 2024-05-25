import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';

class Alas extends THREE.Object3D {
  constructor() {
    super();
    
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    this.animateObject();
    this.add(base);
  }
  
  createBase(tama) {
    const base = new THREE.Object3D();

    const shape = new THREE.Shape();
    shape.moveTo(0, 1);
    shape.quadraticCurveTo(1, 1.5, 0.2, 0.8);
    shape.quadraticCurveTo(0.9, 1.2, 0.2, 0.6);
    shape.quadraticCurveTo(0.8, 0.8, 0.2, 0.4);
    shape.quadraticCurveTo(0.6, 0.6, 0, 0.1);
    shape.lineTo(0, 0.1);

    const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.scale(tama, tama, tama);

    const textureLoader = new THREE.TextureLoader();
    const bumpTexture = textureLoader.load('papel.jpeg', () => {
      // Crear material con la textura de bump map
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Color blanco por defecto
        bumpMap: bumpTexture, // Asignar la textura de bump map
        bumpScale: 0.2, // Ajustar la intensidad del relieve
        side: THREE.DoubleSide
      });

      const ala1 = new THREE.Mesh(geometry, material);
      const ala2 = ala1.clone();
      ala1.rotation.y = -(Math.PI / 2);
      ala2.rotation.y = Math.PI / 2;

      ala1.position.set(0, 0, 0.1);
      ala2.position.set(0, 0, -0.1);

      base.add(ala1);
      base.add(ala2);
    }, undefined, (error) => {
      console.error('Error cargando la textura de bump map:', error);
    });

    return base;
  }
  
  animateObject() {
    var origen = { x: -1 };
    var destino = { x: 1 };
    var movimiento = new TWEEN.Tween(origen)
        .to(destino, 5000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
            this.position.x = origen.x;
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();
  }

  update() {
    TWEEN.update();
  }
}

export { Alas }
