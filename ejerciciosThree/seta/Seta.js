
import * as THREE from 'three'
 
class Seta extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0xffff00});
    this.material2 = new THREE.MeshStandardMaterial({color: 0xff8000,side: THREE.DoubleSide});
    
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
  }
  
  createBase(tama) {

    
    
    //-----------------------------Inicio Perfil----------------------------------------------

    const shape = new THREE.Shape();

    const radius = 1; // Radio de la circunferencia

    // Punto inicial
    shape.moveTo(0, -0.5);

    // Punto de control y punto final para la curva cuadrática
    const controlPoint = new THREE.Vector2(radius, radius);
    const endPoint = new THREE.Vector2(0, radius);

    shape.quadraticCurveTo(0.25, -0.5,0.5 ,0.0);
    shape.quadraticCurveTo(radius,-0.25,radius ,0);
    shape.quadraticCurveTo(controlPoint.x,controlPoint.y,endPoint.x,endPoint.y);

    var points=shape.extractPoints (6).shape;


    //-----------------------------Fin de perfil------------------------------------------------
    const geometry = new THREE.LatheGeometry( points );
    geometry.scale(tama,tama,tama);
    const material = new THREE.MeshStandardMaterial( { color:  0xFF0000, side: THREE.DoubleSide} );
    const lathe = new THREE.Mesh( geometry, material );
    var base = new THREE.Object3D();
    base.add( lathe );

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

export { Seta }
