
import * as THREE from 'three'
 
class Muelle extends THREE.Object3D {
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
      var base = new THREE.Object3D();
      var points = []; // Puntos de control para la trayectoria del muelle
  
      // Genera los puntos de control a lo largo de una curva para el muelle
      for (var i = 0; i < 10; i++) {
        var x = 0; // Posición en el eje X
        var y = i * 0.2; // Posición en el eje Y (ascendente)
        var z = Math.sin(y * 10) * 0.4; // Posición en el eje Z (giratoria)

        points.push(new THREE.Vector3(x, y, z));
    }
  
      // Define la curva de la trayectoria del muelle
      var curve = new THREE.CatmullRomCurve3(points);
  
      // Crea la geometría del muelle usando la forma de barrido a lo largo de la curva
      var geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
  
      // Crea el material para el muelle (puedes usar el mismo material que para la base)
      var material = new THREE.MeshPhongMaterial({ color: 0x808080,side: THREE.DoubleSide }); // Puedes ajustar el color según tu preferencia
  
      // Crea la malla del muelle usando la geometría y el material
      var muelle = new THREE.Mesh(geometry, material);
  
      // Crea un objeto 3D para el muelle
      var muelleObj = new THREE.Object3D();
      base.add(muelle);
  
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

export { Muelle }
