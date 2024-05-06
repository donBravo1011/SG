
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
 
class Muro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0x8b8c7a,side: THREE.DoubleSide});
    this.material2 = new THREE.MeshStandardMaterial({color: 0x9b9b9b,side: THREE.DoubleSide});
    this.material3 = new THREE.MeshStandardMaterial({color: 0xff0080,side: THREE.DoubleSide});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
  }
  
  createBase(tama) {
    // Crea el muro principal
    var muro = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), this.material);
    muro.rotation.y = Math.PI / 2;
    muro.position.set(0,-0.2,0);
    
    
    // Crea un agujero en el muro utilizando las formas creadas
    var hole = new THREE.Shape();
    hole.absellipse(0,0,0.1,0.1,0,Math.PI * 2);
    
    var holeGeometry = new THREE.ExtrudeGeometry(hole, {
      depth: 0.35,
      bevelEnabled: false
  });
    
    var geometry = new THREE.ShapeGeometry(hole);

    var hoyo = new THREE.Mesh(holeGeometry, this.material);
    hoyo.rotation.y = Math.PI / 2;
    hoyo.position.set(-0.15,0,0.2);

    var hoyo2 = new THREE.Mesh(holeGeometry, this.material);
    hoyo2.rotation.y = Math.PI / 2;
    hoyo2.position.set(-0.15,0,-0.2);



    // Crear un shape para la boca sonriente
    var bocaShape = new THREE.Shape();
    bocaShape.moveTo(0.25, 0.05);
    bocaShape.quadraticCurveTo(0, 0.35, -0.25, 0.05);

    var bocaGeometry = new THREE.ExtrudeGeometry(bocaShape, {
        depth: 0.35,
        bevelEnabled: false
    });

    var boca = new THREE.Mesh(bocaGeometry, this.material); // Crear la geometría de la boca
    boca.position.set(-0.20, -0.2, 0); // Posición de la boca
    boca.rotation.x = Math.PI ; // Rotar la boca para que esté orientada correctamente
    boca.rotation.y = Math.PI / 2 ;

    var csg = new CSG();
    csg.subtract([muro,hoyo]);
    csg.subtract([hoyo2]);
    csg.subtract([boca]);
    var resulF = csg.toMesh();
    // Crea un objeto 3D para contener el muro y cualquier otra cosa que desees agregar
    const base = new THREE.Object3D();
    base.add(resulF);
    

    return base;
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

export { Muro }
