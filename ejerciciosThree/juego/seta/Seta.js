
import * as THREE from 'three'
 
class Seta extends THREE.Object3D {
  constructor(geomTubo) {
    super();
    
    this.t = 0.1;
    this.reloj = new THREE.Clock();

    this.velocidad = 0.011;

    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.posicionSuperficie = new THREE.Object3D();
    this.posicionSuperficie.position.y = this.radio+0.05;
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posicionSuperficie);
 
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0xffff00});
    this.material2 = new THREE.MeshStandardMaterial({color: 0xff8000,side: THREE.DoubleSide});
    
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    this.posicionSuperficie.add(base);
    
    this.add (this.nodoPosOrientTubo);
  }
  
  createBase(tama) {

    
    
    //-----------------------------Inicio Perfil----------------------------------------------

    const shape = new THREE.Shape();

    const radius = 1; // Radio de la circunferencia

    // Punto inicial
    shape.moveTo(0.0001, -0.5);

    // Punto de control y punto final para la curva cuadrática
    const controlPoint = new THREE.Vector2(radius, radius);
    const endPoint = new THREE.Vector2(0.0001, radius);

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

    lathe.scale.set(0.25,0.25,0.25)

    base.add( lathe );

    return base;
  }
  
  
  update () {
    var segundosTranscurridos = this.reloj.getDelta(); 
    this.t += this.velocidad * segundosTranscurridos ;

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

export { Seta }
