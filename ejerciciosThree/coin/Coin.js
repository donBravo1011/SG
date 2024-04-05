
import * as THREE from 'three'

class Coin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0xffff00});
    this.material2 = new THREE.MeshStandardMaterial({color: 0xff8000,side: THREE.DoubleSide});
    
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.15;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
  }
  
  createBase(tama) {

    var coin = new THREE.Mesh (new THREE.CylinderGeometry (0.5,0.5,0.1,25), this.material);
    var coin2 = new THREE.Mesh (new THREE.CylinderGeometry(0.501, 0.501, 0.2, 25,1,true, 0, 2*Math.PI), this.material2);
    

    // El nodo del que van a colgar la caja y los 2 conos y que se va a devolver
    var base = new THREE.Object3D();
    coin.rotation.z = Math.PI/2;
    coin2.rotation.z = Math.PI/2;
    base.add(coin);
    base.add(coin2);

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
  
  createMovil (tama) {
    // Se crea la parte móvil
    var cajaMovil = new THREE.Mesh (
        new THREE.BoxGeometry (tama, tama*0.12, tama*0.2),
        this.material
    );
    cajaMovil.position.set (-tama*0.45, tama*0.06, 0);
    
    var movil = new THREE.Object3D();
    // IMPORTANTE: Con independencia del orden en el que se escriban las 2 líneas siguientes, SIEMPRE se aplica primero la rotación y después la traslación. Prueba a intercambiar las dos líneas siguientes y verás que no se produce ningún cambio al ejecutar.    
    movil.rotation.z = this.guiControls.rotacion;
    movil.position.set(tama*0.45,tama*0.2,0);
    movil.add(cajaMovil);
    return movil;
  }
  
  setAngulo (valor) {
    this.movil.rotation.z = valor;
  }
  
  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Coin }
