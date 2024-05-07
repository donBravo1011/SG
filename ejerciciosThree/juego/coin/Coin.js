
import * as THREE from 'three'

class Coin extends THREE.Object3D {
  constructor(geomTubo) {
    super();
    this.t = 0.9;
    this.reloj = new THREE.Clock();

    this.velocidad = 0.005;

    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.posicionSuperficie = new THREE.Object3D();
    this.posicionSuperficie.position.y = this.radio+0.225;
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posicionSuperficie);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0xffff00});
    this.material2 = new THREE.MeshStandardMaterial({color: 0xff8000,side: THREE.DoubleSide});
    
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.15;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.posicionSuperficie.add(base);
    
    this.add (this.nodoPosOrientTubo);
  }
  
  createBase(tama) {

    var coin = new THREE.Mesh (new THREE.CylinderGeometry (0.5,0.5,0.1,25), this.material);
    var coin2 = new THREE.Mesh (new THREE.CylinderGeometry(0.501, 0.501, 0.2, 25,1,true, 0, 2*Math.PI), this.material2);
    

    // El nodo del que van a colgar la caja y los 2 conos y que se va a devolver
    var base = new THREE.Object3D();
    coin.rotation.z = Math.PI/2;
    coin2.rotation.z = Math.PI/2;

    coin.rotation.y = Math.PI/2;
    coin2.rotation.y = Math.PI/2;

    coin.scale.set(0.5,0.5,0.5);
    coin2.scale.set(0.5,0.5,0.5);

    base.add(coin);
    base.add(coin2);

    return base;
  }
  
  
  update () {
    var segundosTranscurridos = this.reloj.getDelta(); 
    this.t -= this.velocidad * segundosTranscurridos ;

    if (this.t < 0) {
      this.t += 1;  // Ajustar this.t al límite inferior de la curva
      console.log("hola");
    } else if (this.t > 1) {
        this.t -= 1;  // Ajustar this.t al límite superior de la curva
        console.log("adios");
    }

    var posTmp = this.path.getPointAt(this.t) ;
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
  }
}

export { Coin }
