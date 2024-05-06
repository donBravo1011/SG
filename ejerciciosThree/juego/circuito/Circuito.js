
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
 
class Circuito extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0x0000ff,side: THREE.DoubleSide});
    this.material2 = new THREE.MeshStandardMaterial({color: 0x9b9b9b,side: THREE.DoubleSide});
    this.material3 = new THREE.MeshStandardMaterial({color: 0xff0080,side: THREE.DoubleSide});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
  }
  
  createBase(tama) {
    const base = new THREE.Object3D();

    // Definir la trayectoria del circuito
    const points = [
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(0, 2, 2),
        new THREE.Vector3(2, 0, 2),
        new THREE.Vector3(3, 2, 0),
        new THREE.Vector3(2, 4, -2),
        new THREE.Vector3(0, 6, -2),
        new THREE.Vector3(-2, 4, 0),
        new THREE.Vector3(-3, 6, 2),
        new THREE.Vector3(-2, 4, 4),
        new THREE.Vector3(0, 2, 4),
        new THREE.Vector3(2, 0, 3),
        new THREE.Vector3(3, -2, 2),
        new THREE.Vector3(2, 0, 0),
        new THREE.Vector3(0, -2, -2),
       // new THREE.Vector3(-3, 0, 0),
    ];

    // Crear la geometría del tubo
    const curve = new THREE.CatmullRomCurve3(points,true);
     this.tubeGeometry = new THREE.TubeGeometry(curve, 512, 0.25, 8, true);

    // Crear el material del tubo
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    // Crear la malla del tubo
    const tubeMesh = new THREE.Mesh(this.tubeGeometry, tubeMaterial);

    // Escalar el tubo
    tubeMesh.scale.set(tama, tama, tama);

    // Agregar el tubo a la base
    base.add(tubeMesh);

    return base;
}

  get_geometria(){
    return this.tubeGeometry;
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

export { Circuito }
